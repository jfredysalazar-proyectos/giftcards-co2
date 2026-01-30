import express, { type Express } from "express";
import fs from "fs";
import { type Server } from "http";
import { nanoid } from "nanoid";
import path from "path";
import { createServer as createViteServer } from "vite";
import viteConfig from "../../vite.config";

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "../..",
        "client",
        "index.html"
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      
      // Inject dynamic meta tags for products
      if (url.startsWith("/product/")) {
        const slug = url.replace("/product/", "").split("?")[0];
        try {
          const { getProductBySlug } = await import("../db");
          const product = await getProductBySlug(slug);
          
          if (product) {
            const title = product.metaTitle || `${product.name} | GiftCards Colombia`;
            const description = product.metaDescription || product.description?.substring(0, 160) || "";
            const keywords = product.metaKeywords || product.category || "";
            const image = product.image || "/logo-giftcards-colombia.webp";
            const productUrl = `https://giftcards.com.co/product/${product.slug}`;
            
            // Replace meta tags in template
            template = template.replace(
              /<title>.*?<\/title>/,
              `<title>${title}</title>`
            );
            template = template.replace(
              /<meta name="description" content=".*?" \/>/,
              `<meta name="description" content="${description}" />`
            );
            template = template.replace(
              /<meta name="keywords" content=".*?" \/>/,
              `<meta name="keywords" content="${keywords}" />`
            );
            
            // Add Open Graph tags and Schema.org Product markup
            const productMarkup = `
    <meta property="og:type" content="product" />
    <meta property="og:url" content="${productUrl}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${image}" />
    <meta property="product:price:amount" content="${product.basePrice || 10}" />
    <meta property="product:price:currency" content="USD" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${image}" />
    <link rel="canonical" href="${productUrl}" />
    <script type="application/ld+json">
    {
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": "${product.name}",
      "image": "${image}",
      "description": "${description}",
      "brand": {
        "@type": "Brand",
        "name": "GiftCards Colombia"
      },
      "offers": {
        "@type": "Offer",
        "url": "${productUrl}",
        "priceCurrency": "USD",
        "price": "${product.basePrice || 10}",
        "availability": "https://schema.org/InStock",
        "seller": {
          "@type": "Organization",
          "name": "GiftCards Colombia"
        }
      }
    }
    </script>`;
            
            template = template.replace("</head>", `${productMarkup}\n  </head>`);
          }
        } catch (error) {
          console.error("Error fetching product metadata:", error);
        }
      }
      
      // Inject dynamic meta tags for blog posts
      if (url.startsWith("/blog/") && url !== "/blog" && url !== "/blog/") {
        const slug = url.replace("/blog/", "").split("?")[0];
        try {
          const { getPostBySlug } = await import("../db");
          const post = await getPostBySlug(slug);
          
          if (post) {
            const title = post.metaTitle || `${post.title} | GiftCards Colombia Blog`;
            const description = post.metaDescription || post.excerpt?.substring(0, 160) || "";
            const keywords = post.metaKeywords || post.category || "";
            const image = post.image || "/logo-giftcards-colombia.webp";
            const postUrl = `https://giftcards.com.co/blog/${post.slug}`;
            
            // Replace meta tags in template
            template = template.replace(
              /<title>.*?<\/title>/,
              `<title>${title}</title>`
            );
            template = template.replace(
              /<meta name="description" content=".*?" \/>/,
              `<meta name="description" content="${description}" />`
            );
            template = template.replace(
              /<meta name="keywords" content=".*?" \/>/,
              `<meta name="keywords" content="${keywords}" />`
            );
            
            // Add Open Graph tags if not present
            const ogTags = `
    <meta property="og:type" content="article" />
    <meta property="og:url" content="${postUrl}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${image}" />
    <meta property="article:published_time" content="${post.publishedAt?.toISOString() || ""}" />
    <meta property="article:author" content="${post.author}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${image}" />
    <link rel="canonical" href="${postUrl}" />`;
            
            template = template.replace("</head>", `${ogTags}\n  </head>`);
          }
        } catch (error) {
          console.error("Error fetching blog post metadata:", error);
        }
      }
      
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  const distPath =
    process.env.NODE_ENV === "development"
      ? path.resolve(import.meta.dirname, "../..", "dist", "public")
      : path.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    console.error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use("*", async (req, res) => {
    const url = req.originalUrl;
    const indexPath = path.resolve(distPath, "index.html");
    
    // Inject dynamic meta tags for products in production
    if (url.startsWith("/product/")) {
      const slug = url.replace("/product/", "").split("?")[0];
      console.log('[SSR PRODUCT] ============================================');
      console.log('[SSR PRODUCT] URL:', url);
      console.log('[SSR PRODUCT] Slug:', slug);
      try {
        const { getProductBySlug } = await import("../db");
        console.log('[SSR PRODUCT] Fetching from database...');
        const product = await getProductBySlug(slug);
        console.log('[SSR PRODUCT] Product found:', product ? product.name : 'NOT FOUND');
        
        if (product) {
          console.log('[SSR PRODUCT] Product exists, generating SSR...');
          let template = await fs.promises.readFile(indexPath, "utf-8");
          console.log('[SSR PRODUCT] Template loaded, length:', template.length);
          
          const title = product.metaTitle || `${product.name} | GiftCards Colombia`;
          console.log('[SSR PRODUCT] Title:', title);
          const description = product.metaDescription || product.description?.substring(0, 160) || "";
          const keywords = product.metaKeywords || product.category || "";
          const image = product.image || "/logo-giftcards-colombia.webp";
          const productUrl = `https://giftcards.com.co/product/${product.slug}`;
          
          // Replace meta tags in template
          template = template.replace(
            /<title>.*?<\/title>/,
            `<title>${title}</title>`
          );
          template = template.replace(
            /<meta name="description" content=".*?" \/>/,
            `<meta name="description" content="${description}" />`
          );
          template = template.replace(
            /<meta name="keywords" content=".*?" \/>/,
            `<meta name="keywords" content="${keywords}" />`
          );
          
          // Add Open Graph tags and Schema.org Product markup
          const productMarkup = `
    <meta property="og:type" content="product" />
    <meta property="og:url" content="${productUrl}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${image}" />
    <meta property="product:price:amount" content="${product.basePrice || 10}" />
    <meta property="product:price:currency" content="USD" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${image}" />
    <link rel="canonical" href="${productUrl}" />
    <script type="application/ld+json">
    {
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": "${product.name}",
      "image": "${image}",
      "description": "${description}",
      "brand": {
        "@type": "Brand",
        "name": "GiftCards Colombia"
      },
      "offers": {
        "@type": "Offer",
        "url": "${productUrl}",
        "priceCurrency": "USD",
        "price": "${product.basePrice || 10}",
        "availability": "https://schema.org/InStock",
        "seller": {
          "@type": "Organization",
          "name": "GiftCards Colombia"
        }
      }
    }
    </script>`;
          
          template = template.replace("</head>", `${productMarkup}\n  </head>`);
          console.log('[SSR PRODUCT] Template modified successfully');
          console.log('[SSR PRODUCT] Sending SSR HTML to client');
          
          res.status(200).set({ "Content-Type": "text/html" }).send(template);
          return;
        }
      } catch (error) {
        console.error("[SSR PRODUCT] Error fetching product metadata:", error);
        console.error("[SSR PRODUCT] Stack trace:", error.stack);
      }
      console.log('[SSR PRODUCT] No product found or error occurred, serving default HTML');
    } else {
      console.log('[SSR] Request for non-product URL:', url);
    }
    
    // Inject dynamic meta tags for blog posts in production
    if (url.startsWith("/blog/") && url !== "/blog" && url !== "/blog/") {
      const slug = url.replace("/blog/", "").split("?")[0];
      try {
        const { getPostBySlug } = await import("../db");
        const post = await getPostBySlug(slug);
        
        if (post) {
          let template = await fs.promises.readFile(indexPath, "utf-8");
          
          const title = post.metaTitle || `${post.title} | GiftCards Colombia Blog`;
          const description = post.metaDescription || post.excerpt?.substring(0, 160) || "";
          const keywords = post.metaKeywords || post.category || "";
          const image = post.image || "/logo-giftcards-colombia.webp";
          const postUrl = `https://giftcards.com.co/blog/${post.slug}`;
          
          // Replace meta tags in template
          template = template.replace(
            /<title>.*?<\/title>/,
            `<title>${title}</title>`
          );
          template = template.replace(
            /<meta name="description" content=".*?" \/>/,
            `<meta name="description" content="${description}" />`
          );
          template = template.replace(
            /<meta name="keywords" content=".*?" \/>/,
            `<meta name="keywords" content="${keywords}" />`
          );
          
          // Add Open Graph tags if not present
          const ogTags = `
    <meta property="og:type" content="article" />
    <meta property="og:url" content="${postUrl}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${image}" />
    <meta property="article:published_time" content="${post.publishedAt?.toISOString() || ""}" />
    <meta property="article:author" content="${post.author}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${image}" />
    <link rel="canonical" href="${postUrl}" />`;
          
          template = template.replace("</head>", `${ogTags}\n  </head>`);
          
          res.status(200).set({ "Content-Type": "text/html" }).send(template);
          return;
        }
      } catch (error) {
        console.error("Error fetching blog post metadata:", error);
      }
    }
    
    res.sendFile(indexPath);
  });
}

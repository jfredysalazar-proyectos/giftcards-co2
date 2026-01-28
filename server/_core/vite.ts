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
      
      // Inject dynamic meta tags for blog posts
      if (url.startsWith('/blog/') && url !== '/blog' && url !== '/blog/') {
        const slug = url.replace('/blog/', '').split('?')[0];
        try {
          const { getBlogPostBySlug } = await import('../db');
          const post = await getBlogPostBySlug(slug);
          
          if (post && post.published) {
            const title = post.metaTitle || `${post.title} | Blog GiftCards.com.co`;
            const description = post.metaDescription || post.excerpt;
            const keywords = post.metaKeywords || post.keywords || '';
            const image = post.featuredImage || '/logo-giftcards-colombia.webp';
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
    <meta property="article:published_time" content="${post.publishedAt?.toISOString() || ''}" />
    <meta property="article:author" content="${post.author}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${image}" />
    <link rel="canonical" href="${postUrl}" />`;
            
            template = template.replace('</head>', `${ogTags}\n  </head>`);
          }
        } catch (error) {
          console.error('Error fetching blog post metadata:', error);
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
    
    // Inject dynamic meta tags for blog posts in production
    if (url.startsWith('/blog/') && url !== '/blog' && url !== '/blog/') {
      const slug = url.replace('/blog/', '').split('?')[0];
      try {
        const { getBlogPostBySlug } = await import('../db');
        const post = await getBlogPostBySlug(slug);
        
        if (post && post.published) {
          let template = await fs.promises.readFile(indexPath, "utf-8");
          
          const title = post.metaTitle || `${post.title} | Blog GiftCards.com.co`;
          const description = post.metaDescription || post.excerpt;
          const keywords = post.metaKeywords || post.keywords || '';
          const image = post.featuredImage || '/logo-giftcards-colombia.webp';
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
          
          // Add Open Graph tags
          const ogTags = `
    <meta property="og:type" content="article" />
    <meta property="og:url" content="${postUrl}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${image}" />
    <meta property="article:published_time" content="${post.publishedAt?.toISOString() || ''}" />
    <meta property="article:author" content="${post.author}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${image}" />
    <link rel="canonical" href="${postUrl}" />`;
          
          template = template.replace('</head>', `${ogTags}\n  </head>`);
          
          res.status(200).set({ "Content-Type": "text/html" }).send(template);
          return;
        }
      } catch (error) {
        console.error('Error fetching blog post metadata:', error);
      }
    }
    
    res.sendFile(indexPath);
  });
}

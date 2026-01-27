import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  schema?: object;
}

export default function SEO({
  title = "Tarjetas de Regalo Digitales Colombia | GiftCards",
  description = "Compra tarjetas de regalo digitales de PSN, Xbox, Nintendo, Amazon y más. Entrega instantánea por WhatsApp. Los mejores precios en Colombia.",
  keywords = "tarjetas de regalo, gift cards, PSN, Xbox, Nintendo, Amazon, entrega instantánea, Colombia, tarjetas digitales",
  image = "/logo-giftcards-colombia.webp",
  url = "https://giftcards.com.co/",
  type = "website",
  schema
}: SEOProps) {
  const siteTitle = title.includes("GiftCards") ? title : `${title} | GiftCards Colombia`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{siteTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={siteTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />

      {/* Canonical URL */}
      <link rel="canonical" href={url} />

      {/* Schema.org JSON-LD */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
}

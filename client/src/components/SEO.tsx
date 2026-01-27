import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  schema?: object;
  noindex?: boolean;
}

export default function SEO({
  title = "Tarjetas de Regalo Digitales Colombia | GiftCards.com.co",
  description = "Compra tarjetas de regalo digitales de PSN, Xbox, Nintendo, Amazon y más. Entrega instantánea por WhatsApp. Los mejores precios en Colombia.",
  keywords = "tarjetas de regalo, gift cards, PSN, Xbox, Nintendo, Amazon, entrega instantánea, Colombia, tarjetas digitales",
  image = "/logo-giftcards-colombia.webp",
  url = "https://giftcards.com.co/",
  type = "website",
  schema,
  noindex = false
}: SEOProps) {
  const siteTitle = title.includes("GiftCards") ? title : `${title} | GiftCards Colombia`;

  return (
    <Helmet>
      {/* 1. Etiquetas Básicas y Localización */}
      <html lang="es" />
      <title>{siteTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={url} />
      <link rel="alternate" href={url} hrefLang="es-CO" />
      
      {/* 2. Control de Robots Dinámico */}
      <meta name="robots" content={noindex ? "noindex, nofollow" : "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"} />

      {/* 3. Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="GiftCards Colombia" />
      <meta property="og:locale" content="es_CO" />

      {/* 4. Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* 5. Rendimiento: Preconnect para Cloudinary y Google Fonts */}
      <link rel="preconnect" href="https://res.cloudinary.com" />
      <link rel="dns-prefetch" href="https://res.cloudinary.com" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

      {/* 6. Datos Estructurados (Schema.org) JSON-LD */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
}

import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  product?: {
    name: string;
    description: string;
    price: number;
    currency: string;
    image: string;
    availability: 'InStock' | 'OutOfStock' | 'PreOrder';
    brand?: string;
    sku?: string;
    rating?: number;
    reviewCount?: number;
  };
  article?: {
    publishedTime: string;
    modifiedTime?: string;
    author: string;
    section?: string;
    tags?: string[];
  };
  breadcrumbs?: Array<{
    name: string;
    url: string;
  }>;
  organization?: boolean;
  localBusiness?: {
    name: string;
    address: string;
    city: string;
    region: string;
    postalCode: string;
    country: string;
    phone: string;
    openingHours?: string[];
  };
}

const SEO = ({
  title = 'ChocoElite - Premium Fruit-Infused Chocolates | Guilt-Free Indulgence',
  description = 'Experience guilt-free indulgence with ChocoElite\'s premium fruit-infused chocolates. Made with real fruits and finest cocoa. Free delivery on orders above ₹1000. Shop luxury chocolate online in Mumbai & Pune.',
  keywords = 'premium chocolate, fruit chocolate, luxury chocolate, dark chocolate, milk chocolate, white chocolate, vegan chocolate, sugar-free chocolate, buy chocolate online, Mumbai chocolate, Pune chocolate, gift chocolates, bulk chocolate, corporate gifts, ChocoElite, fruit at every bite',
  image = 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=1200&h=630&fit=crop',
  url = 'https://chocoelite.lovable.app',
  type = 'website',
  product,
  article,
  breadcrumbs,
  organization = true,
  localBusiness,
}: SEOProps) => {
  // Organization Schema
  const organizationSchema = organization ? {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "ChocoElite",
    "url": "https://chocoelite.lovable.app",
    "logo": "https://chocoelite.lovable.app/logo.png",
    "description": "Premium fruit-infused chocolate manufacturer offering guilt-free indulgence with real fruits and finest cocoa.",
    "sameAs": [
      "https://instagram.com/chocoelite",
      "https://facebook.com/chocoelite",
      "https://twitter.com/chocoelite"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-9130032225",
      "contactType": "customer service",
      "availableLanguage": ["English", "Hindi", "Marathi"]
    }
  } : null;

  // Product Schema
  const productSchema = product ? {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "image": product.image,
    "brand": {
      "@type": "Brand",
      "name": product.brand || "ChocoElite"
    },
    "sku": product.sku,
    "offers": {
      "@type": "Offer",
      "url": url,
      "priceCurrency": product.currency,
      "price": product.price,
      "availability": `https://schema.org/${product.availability}`,
      "seller": {
        "@type": "Organization",
        "name": "ChocoElite"
      }
    },
    ...(product.rating && product.reviewCount ? {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": product.rating,
        "reviewCount": product.reviewCount
      }
    } : {})
  } : null;

  // Article Schema
  const articleSchema = article ? {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": description,
    "image": image,
    "datePublished": article.publishedTime,
    "dateModified": article.modifiedTime || article.publishedTime,
    "author": {
      "@type": "Person",
      "name": article.author
    },
    "publisher": {
      "@type": "Organization",
      "name": "ChocoElite",
      "logo": {
        "@type": "ImageObject",
        "url": "https://chocoelite.lovable.app/logo.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url
    }
  } : null;

  // Breadcrumb Schema
  const breadcrumbSchema = breadcrumbs && breadcrumbs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  } : null;

  // Local Business Schema
  const localBusinessSchema = localBusiness ? {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": localBusiness.name,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": localBusiness.address,
      "addressLocality": localBusiness.city,
      "addressRegion": localBusiness.region,
      "postalCode": localBusiness.postalCode,
      "addressCountry": localBusiness.country
    },
    "telephone": localBusiness.phone,
    "openingHoursSpecification": localBusiness.openingHours?.map(hours => ({
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": hours.split(' ')[0],
      "opens": hours.split(' ')[1]?.split('-')[0],
      "closes": hours.split(' ')[1]?.split('-')[1]
    }))
  } : null;

  // WebSite Schema for Sitelinks Search Box
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "ChocoElite",
    "url": "https://chocoelite.lovable.app",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://chocoelite.lovable.app/shop?search={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  // FAQ Schema for common questions
  const faqSchema = type === 'website' ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What makes ChocoElite chocolates unique?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "ChocoElite chocolates are infused with real fruits, offering guilt-free indulgence. We use premium cocoa and natural ingredients to create a perfect blend of luxury and health."
        }
      },
      {
        "@type": "Question",
        "name": "Where does ChocoElite deliver?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Currently, we deliver to Mumbai and Pune. Free delivery is available on orders above ₹1000."
        }
      },
      {
        "@type": "Question",
        "name": "What payment methods do you accept?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We currently accept Cash on Delivery (COD) for all orders."
        }
      }
    ]
  } : null;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="ChocoElite" />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />
      <meta name="bingbot" content="index, follow" />
      
      {/* Geo Tags */}
      <meta name="geo.region" content="IN-MH" />
      <meta name="geo.placename" content="Mumbai, Pune" />
      <meta name="geo.position" content="19.0760;72.8777" />
      <meta name="ICBM" content="19.0760, 72.8777" />
      
      {/* Language */}
      <meta httpEquiv="content-language" content="en-IN" />
      <link rel="alternate" hrefLang="en-in" href={url} />
      <link rel="alternate" hrefLang="en" href={url} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="ChocoElite Premium Fruit-Infused Chocolates" />
      <meta property="og:site_name" content="ChocoElite" />
      <meta property="og:locale" content="en_IN" />
      
      {/* Article specific OG tags */}
      {article && (
        <>
          <meta property="article:published_time" content={article.publishedTime} />
          {article.modifiedTime && <meta property="article:modified_time" content={article.modifiedTime} />}
          <meta property="article:author" content={article.author} />
          {article.section && <meta property="article:section" content={article.section} />}
          {article.tags?.map((tag, i) => <meta key={i} property="article:tag" content={tag} />)}
        </>
      )}
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content="ChocoElite Premium Fruit-Infused Chocolates" />
      <meta name="twitter:site" content="@chocoelite" />
      <meta name="twitter:creator" content="@chocoelite" />
      
      {/* WhatsApp */}
      <meta property="og:image:secure_url" content={image} />
      
      {/* Pinterest */}
      <meta name="pinterest-rich-pin" content="true" />
      
      {/* Additional SEO Tags */}
      <link rel="canonical" href={url} />
      
      {/* Mobile */}
      <meta name="format-detection" content="telephone=yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="ChocoElite" />
      
      {/* Preconnect for performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://images.unsplash.com" />
      
      {/* DNS Prefetch */}
      <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      <link rel="dns-prefetch" href="https://images.unsplash.com" />
      
      {/* Structured Data - JSON-LD */}
      {organizationSchema && (
        <script type="application/ld+json">
          {JSON.stringify(organizationSchema)}
        </script>
      )}
      
      {productSchema && (
        <script type="application/ld+json">
          {JSON.stringify(productSchema)}
        </script>
      )}
      
      {articleSchema && (
        <script type="application/ld+json">
          {JSON.stringify(articleSchema)}
        </script>
      )}
      
      {breadcrumbSchema && (
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      )}
      
      {localBusinessSchema && (
        <script type="application/ld+json">
          {JSON.stringify(localBusinessSchema)}
        </script>
      )}
      
      <script type="application/ld+json">
        {JSON.stringify(websiteSchema)}
      </script>
      
      {faqSchema && (
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
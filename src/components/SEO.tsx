import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
}

const SEO = ({
  title = 'ChocoElite - Premium Fruit-Infused Chocolates',
  description = 'Experience guilt-free indulgence with ChocoElite\'s premium fruit-infused chocolates. Made with real fruits and finest cocoa. Shop luxury chocolate online.',
  keywords = 'premium chocolate, fruit chocolate, luxury chocolate, dark chocolate, milk chocolate, white chocolate, vegan chocolate, sugar-free chocolate, buy chocolate online',
  image = 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=1200&h=630&fit=crop',
  url = 'https://chocoelite.lovable.app',
  type = 'website',
}: SEOProps) => {
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Open Graph Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="ChocoElite" />
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Additional SEO Tags */}
      <link rel="canonical" href={url} />
      <meta name="robots" content="index, follow" />
      <meta name="author" content="ChocoElite" />
    </Helmet>
  );
};

export default SEO;

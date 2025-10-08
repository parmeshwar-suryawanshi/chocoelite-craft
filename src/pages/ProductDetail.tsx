import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Star, Heart, Share2, Truck, Shield, Award } from 'lucide-react';
import { products } from '@/data/products';
import { useCart } from '@/contexts/CartContext';
import { toast } from '@/hooks/use-toast';
import ProductCard from '@/components/ProductCard';

const ProductDetail = () => {
  const { id } = useParams();
  const product = products.find(p => p.id === id);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  if (!product) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-display font-bold mb-4">Product Not Found</h1>
          <Link to="/shop">
            <Button className="gradient-luxury text-white">Back to Shop</Button>
          </Link>
        </div>
      </div>
    );
  }

  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
      });
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({ title: 'Link copied!', description: 'Product link copied to clipboard' });
  };

  return (
    <>
      <SEO
        title={`${product.name} | ChocoElite`}
        description={product.longDescription}
        keywords={`${product.name}, ${product.category}, buy chocolate, premium chocolate`}
        image={product.image}
        url={`https://chocoelite.lovable.app/product/${product.id}`}
        type="product"
      />

      <div className="min-h-screen pt-24 pb-20">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link to="/" className="hover:text-luxury-brown">Home</Link>
            <span>/</span>
            <Link to="/shop" className="hover:text-luxury-brown">Shop</Link>
            <span>/</span>
            <span className="text-foreground">{product.name}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="relative overflow-hidden rounded-2xl aspect-square shadow-2xl">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {product.bestseller && (
                  <Badge className="absolute top-4 left-4 bg-luxury-gold text-white">
                    Bestseller
                  </Badge>
                )}
                {product.limitedEdition && (
                  <Badge variant="destructive" className="absolute top-4 right-4">
                    Limited Edition
                  </Badge>
                )}
              </div>
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative overflow-hidden rounded-lg aspect-square ${
                      selectedImage === index ? 'ring-2 ring-luxury-brown' : ''
                    }`}
                  >
                    <img src={image} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Details */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Badge className="gradient-luxury text-white">{product.category}</Badge>
                {!product.inStock && <Badge variant="destructive">Out of Stock</Badge>}
              </div>

              <h1 className="text-3xl md:text-5xl font-display font-bold mb-4">
                {product.name}
              </h1>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating)
                          ? 'fill-luxury-gold text-luxury-gold'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-lg font-medium">{product.rating}</span>
                <span className="text-muted-foreground">({product.reviews} reviews)</span>
              </div>

              <p className="text-4xl font-bold text-luxury-brown mb-6">₹{product.price}</p>

              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                {product.longDescription}
              </p>

              <Separator className="my-6" />

              {/* Quantity Selector */}
              <div className="flex items-center gap-4 mb-6">
                <p className="font-semibold">Quantity:</p>
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </Button>
                  <span className="px-6 font-semibold">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </Button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mb-8">
                <Button
                  size="lg"
                  className="flex-1 gradient-luxury text-white hover:opacity-90"
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </Button>
                <Button size="lg" variant="outline">
                  <Heart className="h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline" onClick={handleShare}>
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="text-center p-4 rounded-lg bg-muted">
                  <Truck className="h-6 w-6 mx-auto mb-2 text-luxury-brown" />
                  <p className="text-sm font-medium">Free Shipping</p>
                  <p className="text-xs text-muted-foreground">On orders ₹999+</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-muted">
                  <Shield className="h-6 w-6 mx-auto mb-2 text-luxury-brown" />
                  <p className="text-sm font-medium">Quality Assured</p>
                  <p className="text-xs text-muted-foreground">Premium ingredients</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-muted">
                  <Award className="h-6 w-6 mx-auto mb-2 text-luxury-brown" />
                  <p className="text-sm font-medium">Earn Points</p>
                  <p className="text-xs text-muted-foreground">ChocoPoints rewards</p>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Product Info */}
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Ingredients:</h3>
                  <p className="text-muted-foreground">{product.ingredients.join(', ')}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Allergens:</h3>
                  <p className="text-muted-foreground">{product.allergens.join(', ')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-8 text-gradient-luxury">
                You May Also Like
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct, index) => (
                  <ProductCard key={relatedProduct.id} product={relatedProduct} index={index} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductDetail;

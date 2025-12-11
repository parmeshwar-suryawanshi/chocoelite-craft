import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Star, Heart, Eye, Plus } from 'lucide-react';
import { Product } from '@/data/products';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/hooks/useWishlist';
import { useState } from 'react';
import ProductQuickView from './ProductQuickView';

interface ProductCardProps {
  product: Product;
  index?: number;
}

const ProductCard = ({ product, index = 0 }: ProductCardProps) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [isImageHovered, setIsImageHovered] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: product.id,
      name: product.name,
      price: product.bulkPacks?.[0]?.price || product.price,
      image: product.image,
      category: product.category,
    });
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickViewOpen(true);
  };

  return (
    <>
      <Link to={`/product/${product.id}`}>
        <Card
          className="group overflow-hidden border-none shadow-lg hover:shadow-2xl transition-all duration-500 h-full bg-card"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          {/* Image Container with Zoom Effect */}
          <div 
            className="relative overflow-hidden aspect-square"
            onMouseEnter={() => setIsImageHovered(true)}
            onMouseLeave={() => setIsImageHovered(false)}
          >
            {/* Zoomed Image Background (for smooth zoom effect) */}
            <div 
              className={`absolute inset-0 transition-transform duration-700 ease-out ${
                isImageHovered ? 'scale-125' : 'scale-100'
              }`}
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>

            {/* Overlay on hover */}
            <div className={`absolute inset-0 bg-gradient-to-t from-luxury-dark/80 via-luxury-dark/20 to-transparent transition-opacity duration-300 ${
              isImageHovered ? 'opacity-100' : 'opacity-0'
            }`} />

            {/* Wishlist Button */}
            <Button
              onClick={handleWishlist}
              size="icon"
              variant="ghost"
              className={`absolute top-4 left-4 bg-white/90 backdrop-blur-sm hover:bg-white shadow-md transition-all duration-300 ${
                isImageHovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
              }`}
            >
              <Heart
                className={`h-5 w-5 transition-colors ${
                  isInWishlist(product.id) ? 'fill-red-500 text-red-500' : 'text-luxury-brown'
                }`}
              />
            </Button>

            {/* Badges */}
            <div className="absolute top-4 right-4 flex flex-col gap-2">
              <Badge className="gradient-luxury text-white border-none shadow-lg">
                {product.category}
              </Badge>
              {product.bestseller && (
                <Badge className="bg-luxury-gold text-luxury-dark border-none shadow-lg">
                  Bestseller
                </Badge>
              )}
              {product.limitedEdition && (
                <Badge variant="destructive" className="shadow-lg">
                  Limited
                </Badge>
              )}
            </div>

            {/* Quick Actions (visible on hover) */}
            <div className={`absolute bottom-4 left-4 right-4 flex gap-2 transition-all duration-300 ${
              isImageHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
              <Button
                onClick={handleQuickView}
                variant="secondary"
                size="sm"
                className="flex-1 bg-white/95 backdrop-blur-sm hover:bg-white text-luxury-brown font-medium shadow-lg"
              >
                <Eye className="h-4 w-4 mr-2" />
                Quick View
              </Button>
              <Button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                size="icon"
                className="gradient-luxury text-white hover:opacity-90 shadow-lg"
              >
                <Plus className="h-5 w-5" />
              </Button>
            </div>

            {/* Out of Stock Overlay */}
            {!product.inStock && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <Badge variant="destructive" className="text-lg px-4 py-2">
                  Out of Stock
                </Badge>
              </div>
            )}
          </div>

          {/* Card Content */}
          <CardContent className="p-5">
            {/* Rating */}
            <div className="flex items-center gap-1 mb-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3.5 w-3.5 ${
                      i < Math.floor(product.rating)
                        ? 'fill-luxury-gold text-luxury-gold'
                        : 'text-muted-foreground/30'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-medium text-muted-foreground ml-1">
                ({product.reviews})
              </span>
            </div>

            {/* Product Name */}
            <h3 className="text-lg font-semibold mb-1.5 group-hover:text-luxury-brown transition-colors line-clamp-1">
              {product.name}
            </h3>

            {/* Description */}
            <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-2">
              {product.description}
            </p>

            {/* Price and Add to Cart */}
            <div className="flex items-center justify-between">
              <div>
                {product.bulkPacks && product.bulkPacks.length > 0 ? (
                  <>
                    <p className="text-xs text-muted-foreground">From</p>
                    <p className="text-xl font-bold text-luxury-brown">₹{product.bulkPacks[0].price}</p>
                  </>
                ) : (
                  <p className="text-xl font-bold text-luxury-brown">₹{product.price}</p>
                )}
              </div>
              <Button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="gradient-luxury text-white hover:opacity-90 shadow-md"
                size="sm"
              >
                <ShoppingCart className="h-4 w-4 mr-1.5" />
                Add
              </Button>
            </div>
          </CardContent>
        </Card>
      </Link>

      {/* Quick View Modal */}
      <ProductQuickView
        product={product}
        open={quickViewOpen}
        onOpenChange={setQuickViewOpen}
      />
    </>
  );
};

export default ProductCard;

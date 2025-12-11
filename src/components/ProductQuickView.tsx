import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Star, Heart, X, Eye, Plus, Minus } from 'lucide-react';
import { Product } from '@/data/products';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/hooks/useWishlist';
import { Link } from 'react-router-dom';
import { useState } from 'react';

interface ProductQuickViewProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ProductQuickView = ({ product, open, onOpenChange }: ProductQuickViewProps) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [selectedPack, setSelectedPack] = useState(0);
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const handleAddToCart = () => {
    const price = product.bulkPacks?.[selectedPack]?.price || product.price;
    const packInfo = product.bulkPacks?.[selectedPack]?.quantity || '';
    
    // Add items based on quantity selected
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: packInfo ? `${product.id}-${packInfo}` : product.id,
        name: packInfo ? `${product.name} (${packInfo})` : product.name,
        price: price,
        image: product.image,
        category: product.category,
      });
    }
    onOpenChange(false);
  };

  const handleWishlist = () => {
    toggleWishlist(product.id);
  };

  const currentPrice = product.bulkPacks?.[selectedPack]?.price || product.price;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden bg-card border-luxury-brown/20">
        <div className="grid md:grid-cols-2 gap-0">
          {/* Product Image */}
          <div className="relative aspect-square bg-gradient-to-br from-luxury-cream to-luxury-light overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.bestseller && (
                <Badge className="bg-luxury-gold text-luxury-dark border-none">
                  Bestseller
                </Badge>
              )}
              {product.limitedEdition && (
                <Badge variant="destructive">
                  Limited Edition
                </Badge>
              )}
            </div>
            <Button
              onClick={handleWishlist}
              size="icon"
              variant="ghost"
              className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg"
            >
              <Heart
                className={`h-5 w-5 transition-colors ${
                  isInWishlist(product.id) ? 'fill-red-500 text-red-500' : 'text-luxury-brown'
                }`}
              />
            </Button>
          </div>

          {/* Product Details */}
          <div className="p-6 flex flex-col">
            <DialogHeader className="text-left mb-4">
              <Badge className="w-fit mb-2 gradient-luxury text-white border-none">
                {product.category}
              </Badge>
              <DialogTitle className="text-2xl font-bold text-foreground">
                {product.name}
              </DialogTitle>
            </DialogHeader>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(product.rating)
                        ? 'fill-luxury-gold text-luxury-gold'
                        : 'text-muted-foreground'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-medium">{product.rating}</span>
              <span className="text-sm text-muted-foreground">
                ({product.reviews} reviews)
              </span>
            </div>

            {/* Description */}
            <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
              {product.description}
            </p>

            {/* Bulk Pack Selection */}
            {product.bulkPacks && product.bulkPacks.length > 0 && (
              <div className="mb-6">
                <label className="text-sm font-medium mb-2 block">Select Pack Size</label>
                <div className="flex flex-wrap gap-2">
                  {product.bulkPacks.map((pack, index) => (
                    <Button
                      key={index}
                      variant={selectedPack === index ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedPack(index)}
                      className={selectedPack === index 
                        ? "gradient-luxury text-white border-none" 
                        : "border-luxury-brown/30 hover:border-luxury-brown hover:bg-luxury-cream/50"
                      }
                    >
                      {pack.quantity} - ₹{pack.price}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="mb-6">
              <label className="text-sm font-medium mb-2 block">Quantity</label>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="border-luxury-brown/30 hover:border-luxury-brown"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-semibold">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                  className="border-luxury-brown/30 hover:border-luxury-brown"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Price */}
            <div className="mb-6">
              <p className="text-3xl font-bold text-luxury-brown">
                ₹{currentPrice * quantity}
              </p>
              {quantity > 1 && (
                <p className="text-sm text-muted-foreground">
                  ₹{currentPrice} each
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-auto">
              <Button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="flex-1 gradient-luxury text-white hover:opacity-90"
                size="lg"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart
              </Button>
              <Link to={`/product/${product.id}`} className="flex-1">
                <Button
                  variant="outline"
                  className="w-full border-luxury-brown/30 hover:border-luxury-brown hover:bg-luxury-cream/50"
                  size="lg"
                  onClick={() => onOpenChange(false)}
                >
                  <Eye className="h-5 w-5 mr-2" />
                  View Details
                </Button>
              </Link>
            </div>

            {!product.inStock && (
              <p className="text-destructive text-sm mt-3 text-center">
                This product is currently out of stock
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductQuickView;

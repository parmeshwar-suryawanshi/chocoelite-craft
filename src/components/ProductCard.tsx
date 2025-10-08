import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Star } from 'lucide-react';
import { Product } from '@/data/products';
import { useCart } from '@/contexts/CartContext';

interface ProductCardProps {
  product: Product;
  index?: number;
}

const ProductCard = ({ product, index = 0 }: ProductCardProps) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
    });
  };

  return (
    <Link to={`/product/${product.id}`}>
      <Card
        className="group overflow-hidden hover-lift border-none shadow-lg h-full"
        style={{ animationDelay: `${index * 0.1}s` }}
      >
        <div className="relative overflow-hidden aspect-square">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <Badge className="gradient-luxury text-white border-none shadow-lg">
              {product.category}
            </Badge>
            {product.bestseller && (
              <Badge variant="secondary" className="shadow-lg">
                Bestseller
              </Badge>
            )}
            {product.limitedEdition && (
              <Badge variant="destructive" className="shadow-lg">
                Limited Edition
              </Badge>
            )}
          </div>
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <Badge variant="destructive" className="text-lg px-4 py-2">
                Out of Stock
              </Badge>
            </div>
          )}
        </div>
        <CardContent className="p-6">
          <div className="flex items-center gap-1 mb-2">
            <Star className="h-4 w-4 fill-luxury-gold text-luxury-gold" />
            <span className="text-sm font-medium">{product.rating}</span>
            <span className="text-xs text-muted-foreground">
              ({product.reviews} reviews)
            </span>
          </div>
          <h3 className="text-xl font-semibold mb-2 group-hover:text-luxury-brown transition-colors">
            {product.name}
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed mb-4">
            {product.description}
          </p>
          <div className="flex items-center justify-between">
            <p className="text-2xl font-bold text-luxury-brown">
              ₹{product.price}
            </p>
            <Button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="gradient-luxury text-white hover:opacity-90"
              size="sm"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ProductCard;

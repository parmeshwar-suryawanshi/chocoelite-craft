import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCompare } from '@/contexts/CompareContext';
import { useCart } from '@/contexts/CartContext';
import { X, ShoppingCart, Star, Check, Minus } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProductComparison = () => {
  const { compareItems, removeFromCompare, clearCompare, isCompareOpen, setIsCompareOpen } = useCompare();
  const { addToCart } = useCart();

  const handleAddToCart = (product: typeof compareItems[0]) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.bulkPacks?.[0]?.price || product.price,
      image: product.image,
      category: product.category,
    });
  };

  const comparisonFields = [
    { label: 'Price', key: 'price', render: (p: typeof compareItems[0]) => 
      `₹${p.bulkPacks?.[0]?.price || p.price}` 
    },
    { label: 'Category', key: 'category', render: (p: typeof compareItems[0]) => p.category },
    { label: 'Type', key: 'type', render: (p: typeof compareItems[0]) => p.type },
    { label: 'Rating', key: 'rating', render: (p: typeof compareItems[0]) => (
      <div className="flex items-center gap-1">
        <Star className="h-4 w-4 fill-luxury-gold text-luxury-gold" />
        <span>{p.rating}</span>
        <span className="text-muted-foreground text-xs">({p.reviews})</span>
      </div>
    )},
    { label: 'In Stock', key: 'inStock', render: (p: typeof compareItems[0]) => 
      p.inStock ? (
        <span className="flex items-center gap-1 text-green-600">
          <Check className="h-4 w-4" /> Yes
        </span>
      ) : (
        <span className="flex items-center gap-1 text-red-500">
          <Minus className="h-4 w-4" /> No
        </span>
      )
    },
    { label: 'Bestseller', key: 'bestseller', render: (p: typeof compareItems[0]) => 
      p.bestseller ? <Badge className="bg-luxury-gold text-luxury-dark">Yes</Badge> : <span className="text-muted-foreground">No</span>
    },
    { label: 'Limited Edition', key: 'limitedEdition', render: (p: typeof compareItems[0]) => 
      p.limitedEdition ? <Badge variant="destructive">Yes</Badge> : <span className="text-muted-foreground">No</span>
    },
    { label: 'Allergens', key: 'allergens', render: (p: typeof compareItems[0]) => 
      p.allergens?.join(', ') || 'None'
    },
  ];

  return (
    <Sheet open={isCompareOpen} onOpenChange={setIsCompareOpen}>
      <SheetContent side="bottom" className="h-[80vh] bg-background overflow-auto">
        <SheetHeader className="mb-6">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-2xl font-bold">
              Compare Products ({compareItems.length}/3)
            </SheetTitle>
            {compareItems.length > 0 && (
              <Button variant="outline" size="sm" onClick={clearCompare} className="border-luxury-brown/30">
                Clear All
              </Button>
            )}
          </div>
        </SheetHeader>

        {compareItems.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-lg text-muted-foreground mb-4">
              No products to compare. Add products from the shop to compare them.
            </p>
            <Button onClick={() => setIsCompareOpen(false)} className="gradient-luxury text-white">
              Continue Shopping
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr>
                  <th className="text-left p-4 bg-muted/30 rounded-tl-lg font-medium text-muted-foreground w-[150px]">
                    Product
                  </th>
                  {compareItems.map((product) => (
                    <th key={product.id} className="p-4 bg-muted/30 text-center">
                      <div className="relative">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute -top-2 -right-2 h-6 w-6 bg-destructive/10 hover:bg-destructive/20"
                          onClick={() => removeFromCompare(product.id)}
                        >
                          <X className="h-3 w-3 text-destructive" />
                        </Button>
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-24 h-24 object-cover rounded-lg mx-auto mb-3 shadow-md"
                        />
                        <Link 
                          to={`/product/${product.id}`}
                          onClick={() => setIsCompareOpen(false)}
                          className="font-semibold text-foreground hover:text-luxury-brown transition-colors line-clamp-2"
                        >
                          {product.name}
                        </Link>
                      </div>
                    </th>
                  ))}
                  {/* Empty slots */}
                  {Array.from({ length: 3 - compareItems.length }).map((_, i) => (
                    <th key={`empty-${i}`} className="p-4 bg-muted/30 text-center">
                      <div className="w-24 h-24 border-2 border-dashed border-muted-foreground/30 rounded-lg mx-auto flex items-center justify-center">
                        <span className="text-muted-foreground text-sm">Add product</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonFields.map((field, index) => (
                  <tr key={field.key} className={index % 2 === 0 ? 'bg-muted/10' : ''}>
                    <td className="p-4 font-medium text-muted-foreground">{field.label}</td>
                    {compareItems.map((product) => (
                      <td key={product.id} className="p-4 text-center">
                        {field.render(product)}
                      </td>
                    ))}
                    {Array.from({ length: 3 - compareItems.length }).map((_, i) => (
                      <td key={`empty-${i}`} className="p-4 text-center text-muted-foreground">
                        -
                      </td>
                    ))}
                  </tr>
                ))}
                {/* Add to Cart Row */}
                <tr className="bg-muted/30">
                  <td className="p-4 font-medium text-muted-foreground">Action</td>
                  {compareItems.map((product) => (
                    <td key={product.id} className="p-4 text-center">
                      <Button
                        onClick={() => handleAddToCart(product)}
                        disabled={!product.inStock}
                        className="gradient-luxury text-white hover:opacity-90"
                        size="sm"
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add to Cart
                      </Button>
                    </td>
                  ))}
                  {Array.from({ length: 3 - compareItems.length }).map((_, i) => (
                    <td key={`empty-${i}`} className="p-4 text-center">-</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default ProductComparison;

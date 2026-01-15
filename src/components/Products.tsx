import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingBag, Star, Eye } from "lucide-react";
import { Link } from "react-router-dom";

interface BulkPack {
  size: number;
  price: number;
  originalPrice?: number;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  type: string;
  limited_edition: boolean;
  bestseller: boolean;
  bulk_packs: BulkPack[];
  rating?: number;
  category?: string;
}

const Products = () => {
  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as unknown as Product[];
    }
  });

  if (isLoading) {
    return (
      <section id="products" className="py-24 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Skeleton className="h-10 w-48 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="aspect-[4/5] rounded-2xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section id="products" className="py-24 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium">
            Our Collection
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground">
            Handcrafted Chocolates
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our exquisite collection of fruit-infused chocolates, crafted with passion and premium ingredients.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => {
            const bulkPacks = product.bulk_packs as BulkPack[] || [];
            const lowestPrice = bulkPacks.length > 0 ? bulkPacks[0].price : product.price;
            
            return (
              <Card
                key={product.id}
                className="group relative overflow-hidden rounded-2xl border-0 bg-card shadow-sm hover:shadow-xl transition-all duration-500"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Image Container */}
                <div className="relative aspect-square overflow-hidden bg-muted/50">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  
                  {/* Overlay on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Quick Actions */}
                  <div className="absolute bottom-4 left-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                    <Button
                      asChild
                      size="sm"
                      className="flex-1 bg-white/95 text-foreground hover:bg-white backdrop-blur-sm"
                    >
                      <Link to={`/product/${product.id}`}>
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Link>
                    </Button>
                  </div>

                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {product.bestseller && (
                      <Badge className="bg-amber-500 text-white border-0 shadow-md">
                        <Star className="w-3 h-3 mr-1 fill-current" />
                        Bestseller
                      </Badge>
                    )}
                    {product.limited_edition && (
                      <Badge variant="destructive" className="shadow-md">
                        Limited Edition
                      </Badge>
                    )}
                  </div>

                  {/* Type Badge */}
                  <div className="absolute top-4 right-4">
                    <Badge 
                      variant="secondary" 
                      className="bg-white/90 text-foreground backdrop-blur-sm shadow-sm"
                    >
                      {product.type === 'white' ? 'White Chocolate' : 'Milk Chocolate'}
                    </Badge>
                  </div>
                </div>

                {/* Content */}
                <CardContent className="p-6 space-y-4">
                  {/* Category & Rating */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      {product.category || 'Chocolate'}
                    </span>
                    {product.rating && (
                      <div className="flex items-center gap-1 text-amber-500">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-sm font-medium">{product.rating}</span>
                      </div>
                    )}
                  </div>

                  {/* Name */}
                  <h3 className="text-xl font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>

                  {/* Price & Pack Info */}
                  <div className="flex items-end justify-between pt-2 border-t border-border/50">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Starting from</p>
                      <p className="text-2xl font-bold text-primary">
                        ₹{lowestPrice}
                      </p>
                    </div>
                    {bulkPacks.length > 0 && (
                      <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">
                        {bulkPacks.length} pack {bulkPacks.length === 1 ? 'size' : 'sizes'}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Button asChild size="lg" variant="outline" className="rounded-full px-8">
            <Link to="/shop">
              <ShoppingBag className="w-5 h-5 mr-2" />
              View All Products
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Products;

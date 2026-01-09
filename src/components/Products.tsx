import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

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
      <section id="products" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Skeleton className="h-12 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="aspect-square rounded-lg" />
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
    <section id="products" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-4 text-gradient">
            Our Products
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover our exquisite collection of fruit-infused chocolates, where nature
            meets indulgence in every handcrafted piece.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, index) => {
            const bulkPacks = product.bulk_packs as BulkPack[] || [];
            
            return (
              <Card
                key={product.id}
                className="group overflow-hidden hover-lift border-none shadow-lg"
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
                    <Badge className="gradient-luxury text-white border-none">
                      {product.type === 'white' ? 'White' : 'Milk'}
                    </Badge>
                    {product.limited_edition && (
                      <Badge variant="destructive">Limited</Badge>
                    )}
                    {product.bestseller && (
                      <Badge className="bg-luxury-gold text-white">Bestseller</Badge>
                    )}
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-secondary transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      {bulkPacks.length > 0 ? (
                        <>
                          <p className="text-xs text-muted-foreground mb-1">Starting from</p>
                          <p className="text-2xl font-bold text-luxury-brown">₹{bulkPacks[0].price}</p>
                        </>
                      ) : (
                        <p className="text-2xl font-bold text-luxury-brown">₹{product.price}</p>
                      )}
                    </div>
                    {bulkPacks.length > 0 && (
                      <Badge variant="outline" className="text-xs">
                        {bulkPacks.length} pack sizes
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Products;

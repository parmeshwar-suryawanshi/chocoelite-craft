import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingBag, Star, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { useSectionStyle, generateSectionStyles } from "@/hooks/useSectionStyles";

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

  const { style } = useSectionStyle('products');
  const styles = generateSectionStyles(style);

  if (isLoading) {
    return (
      <section id="products" className={`${style.padding_top} ${style.padding_bottom}`} style={styles.containerStyle}>
        <div className={`container mx-auto ${style.padding_x}`}>
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
    <section id="products" className={`${style.padding_top} ${style.padding_bottom}`} style={styles.containerStyle}>
      <div className={`container mx-auto ${style.padding_x}`}>
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <span 
            className="inline-block px-4 py-1.5 rounded-full text-sm font-medium"
            style={styles.badgeStyle}
          >
            Our Collection
          </span>
          <h2 className={`${style.heading_font_size} md:text-5xl font-display font-bold`} style={styles.headingStyle}>
            Handcrafted Chocolates
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={styles.subheadingStyle}>
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
                className={`group relative overflow-hidden ${style.card_border_radius} border-0 ${style.card_shadow} hover:shadow-xl transition-all duration-500`}
                style={{ 
                  animationDelay: `${index * 0.1}s`,
                  backgroundColor: style.card_bg,
                }}
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
                      <Badge 
                        className="border-0 shadow-md"
                        style={styles.badgeStyle}
                      >
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
                  <h3 
                    className="text-xl font-semibold line-clamp-1 transition-colors"
                    style={{ color: style.heading_color }}
                  >
                    {product.name}
                  </h3>

                  {/* Description */}
                  <p className="text-sm line-clamp-2 leading-relaxed" style={{ color: style.text_color }}>
                    {product.description}
                  </p>

                  {/* Price & Pack Info */}
                  <div className="flex items-end justify-between pt-2 border-t border-border/50">
                    <div>
                      <p className="text-xs mb-1" style={{ color: style.subheading_color }}>Starting from</p>
                      <p className="text-2xl font-bold" style={{ color: style.accent_color }}>
                        ₹{lowestPrice}
                      </p>
                    </div>
                    {bulkPacks.length > 0 && (
                      <span className="text-xs bg-muted px-2 py-1 rounded-md" style={{ color: style.text_color }}>
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
          <Button 
            asChild 
            size="lg" 
            className={`${style.button_primary_border_radius} px-8`}
            style={styles.primaryButtonStyle}
          >
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

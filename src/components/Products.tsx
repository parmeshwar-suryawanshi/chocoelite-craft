import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { products } from "@/data/products";

const Products = () => {

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
          {products.map((product, index) => (
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
                  {product.limitedEdition && (
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
                    <p className="text-xs text-muted-foreground mb-1">Starting from</p>
                    <p className="text-2xl font-bold text-luxury-brown">₹{product.sizes[0].price}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    3 sizes
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Products;

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Products = () => {
  const products = [
    {
      name: "Custard Apple White Chocolate",
      description: "Creamy white chocolate infused with exotic custard apple for a tropical delight.",
      category: "White Chocolate",
      image: "https://bizimages.withfloats.com/actual/fea2e489a60d4b848ead1bc9da3ac005.jpg",
    },
    {
      name: "Strawberry Dark Chocolate",
      description: "Rich dark chocolate paired with fresh strawberry for a perfect balance of sweet and intense.",
      category: "Dark Chocolate",
      image: "https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=400&h=400&fit=crop",
    },
    {
      name: "Mango Milk Chocolate",
      description: "Smooth milk chocolate meets the king of fruits—mango for a luscious, tropical experience.",
      category: "Milk Chocolate",
      image: "https://images.unsplash.com/photo-1511381939415-e44015466834?w=400&h=400&fit=crop",
    },
    {
      name: "Orange Dark Chocolate",
      description: "Zesty orange essence combined with premium dark chocolate for a sophisticated treat.",
      category: "Dark Chocolate",
      image: "https://images.unsplash.com/photo-1606312619070-d48b4772d8f0?w=400&h=400&fit=crop",
    },
    {
      name: "Raspberry White Chocolate",
      description: "Delicate white chocolate enhanced with tangy raspberry for an elegant flavor profile.",
      category: "White Chocolate",
      image: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400&h=400&fit=crop",
    },
    {
      name: "Blueberry Dark Chocolate",
      description: "Antioxidant-rich blueberries meet intense dark chocolate for a guilt-free indulgence.",
      category: "Dark Chocolate",
      image: "https://images.unsplash.com/photo-1590080876847-eba8039d7b8b?w=400&h=400&fit=crop",
    },
    {
      name: "Passion Fruit Milk Chocolate",
      description: "Exotic passion fruit swirled into velvety milk chocolate for an unforgettable taste.",
      category: "Milk Chocolate",
      image: "https://images.unsplash.com/photo-1481391243133-f96216dcb5d2?w=400&h=400&fit=crop",
    },
    {
      name: "Mixed Berry Chocolate",
      description: "A symphony of berries—strawberry, raspberry, and blueberry in premium chocolate.",
      category: "Specialty",
      image: "https://images.unsplash.com/photo-1511381939415-e44015466834?w=400&h=400&fit=crop",
    },
  ];

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <Card
              key={index}
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
                <div className="absolute top-4 right-4">
                  <Badge className="gradient-purple-pink text-white border-none">
                    {product.category}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2 group-hover:text-secondary transition-colors">
                  {product.name}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {product.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Products;

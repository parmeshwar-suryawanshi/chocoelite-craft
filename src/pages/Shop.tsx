import { useState } from 'react';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ProductCard from '@/components/ProductCard';
import { products } from '@/data/products';

const Shop = () => {
  const [selectedType, setSelectedType] = useState<string>('all');

  const types = [
    { value: 'all', label: 'All Chocolates' },
    { value: 'dark', label: 'Dark Chocolate' },
    { value: 'milk', label: 'Milk Chocolate' },
    { value: 'white', label: 'White Chocolate' },
    { value: 'vegan', label: 'Vegan' },
    { value: 'sugar-free', label: 'Sugar-Free' },
  ];

  const filteredProducts = selectedType === 'all'
    ? products
    : products.filter(p => p.type === selectedType);

  return (
    <>
      <SEO
        title="Shop Premium Chocolates | ChocoElite"
        description="Browse our collection of premium fruit-infused chocolates. Dark, milk, white, vegan, and sugar-free options available. Free shipping on orders over ₹999."
        keywords="buy chocolate online, premium chocolate, fruit chocolate, dark chocolate, milk chocolate, white chocolate, vegan chocolate"
        url="https://chocoelite.lovable.app/shop"
      />
      
      <div className="min-h-screen pt-24 pb-20">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="text-center mb-12 animate-fade-in-up">
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-4 text-gradient-luxury">
              Our Chocolate Collection
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Discover the perfect blend of premium cocoa and real fruits. Every chocolate is a
              masterpiece crafted with love and precision.
            </p>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {types.map((type) => (
              <Button
                key={type.value}
                onClick={() => setSelectedType(type.value)}
                variant={selectedType === type.value ? 'default' : 'outline'}
                className={selectedType === type.value ? 'gradient-luxury text-white' : ''}
              >
                {type.label}
              </Button>
            ))}
          </div>

          {/* Product Stats */}
          <div className="flex justify-center gap-8 mb-12">
            <div className="text-center">
              <p className="text-3xl font-bold text-luxury-brown">{filteredProducts.length}</p>
              <p className="text-sm text-muted-foreground">Products</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-luxury-brown">
                {filteredProducts.filter(p => p.inStock).length}
              </p>
              <p className="text-sm text-muted-foreground">In Stock</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-luxury-brown">
                {filteredProducts.filter(p => p.featured).length}
              </p>
              <p className="text-sm text-muted-foreground">Featured</p>
            </div>
          </div>

          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-xl text-muted-foreground">No products found in this category.</p>
            </div>
          )}

          {/* Special Offers Banner */}
          <div className="mt-16 gradient-luxury rounded-2xl p-8 md:p-12 text-white text-center shadow-glow">
            <h3 className="text-2xl md:text-3xl font-display font-bold mb-4">
              Free Shipping on Orders Above ₹999
            </h3>
            <p className="text-lg mb-4">
              Plus, earn ChocoPoints on every purchase and get exclusive rewards!
            </p>
            <Badge className="bg-white text-luxury-brown text-lg px-6 py-2">
              Use Code: FREESHIP999
            </Badge>
          </div>
        </div>
      </div>
    </>
  );
};

export default Shop;

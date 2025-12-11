import { useState, useMemo } from 'react';
import SEO from '@/components/SEO';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Badge } from '@/components/ui/badge';
import ProductCard from '@/components/ProductCard';
import ProductFilters, { FilterState } from '@/components/ProductFilters';
import ProductComparison from '@/components/ProductComparison';
import CompareFloatingButton from '@/components/CompareFloatingButton';
import { products } from '@/data/products';

const Shop = () => {
  const types = [
    { value: 'all', label: 'All' },
    { value: 'dark', label: 'Dark' },
    { value: 'milk', label: 'Milk' },
    { value: 'white', label: 'White' },
    { value: 'vegan', label: 'Vegan' },
    { value: 'sugar-free', label: 'Sugar-Free' },
  ];

  const maxPrice = Math.max(...products.map(p => p.bulkPacks?.[0]?.price || p.price));

  const [filters, setFilters] = useState<FilterState>({
    type: 'all',
    priceRange: [0, maxPrice],
    minRating: 0,
    sortBy: 'popularity'
  });

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    // Filter by type
    if (filters.type !== 'all') {
      result = result.filter(p => p.type === filters.type);
    }

    // Filter by price range
    result = result.filter(p => {
      const price = p.bulkPacks?.[0]?.price || p.price;
      return price >= filters.priceRange[0] && price <= filters.priceRange[1];
    });

    // Filter by rating
    if (filters.minRating > 0) {
      result = result.filter(p => p.rating >= filters.minRating);
    }

    // Sort
    switch (filters.sortBy) {
      case 'price-low':
        result.sort((a, b) => (a.bulkPacks?.[0]?.price || a.price) - (b.bulkPacks?.[0]?.price || b.price));
        break;
      case 'price-high':
        result.sort((a, b) => (b.bulkPacks?.[0]?.price || b.price) - (a.bulkPacks?.[0]?.price || a.price));
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        // Assuming newer products are at the end of the array
        result.reverse();
        break;
      case 'popularity':
      default:
        result.sort((a, b) => b.reviews - a.reviews);
        break;
    }

    return result;
  }, [filters]);

  return (
    <>
      <SEO
        title="Shop Premium Chocolates | ChocoElite"
        description="Browse our collection of premium fruit-infused chocolates. Dark, milk, white, vegan, and sugar-free options available. Free shipping on orders over ₹999."
        keywords="buy chocolate online, premium chocolate, fruit chocolate, dark chocolate, milk chocolate, white chocolate, vegan chocolate"
        url="https://chocoelite.lovable.app/shop"
      />
      <Navbar />
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

          {/* Main Content */}
          <div className="lg:flex gap-8">
            {/* Filters Sidebar */}
            <div className="lg:w-[280px] flex-shrink-0 mb-6 lg:mb-0">
              <ProductFilters
                filters={filters}
                onFiltersChange={setFilters}
                types={types}
                maxPrice={maxPrice}
              />
            </div>

            {/* Products Section */}
            <div className="flex-1 min-w-0">
              {/* Results Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <p className="text-muted-foreground">
                    Showing <span className="font-semibold text-foreground">{filteredAndSortedProducts.length}</span> products
                  </p>
                  {filters.type !== 'all' && (
                    <Badge variant="secondary" className="capitalize">
                      {filters.type}
                    </Badge>
                  )}
                  {filters.minRating > 0 && (
                    <Badge variant="secondary">
                      {filters.minRating}+ stars
                    </Badge>
                  )}
                </div>
              </div>

              {/* Products Grid */}
              {filteredAndSortedProducts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredAndSortedProducts.map((product, index) => (
                    <ProductCard key={product.id} product={product} index={index} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-card rounded-xl border border-luxury-brown/10">
                  <p className="text-xl text-muted-foreground mb-4">No products match your filters.</p>
                  <p className="text-sm text-muted-foreground">
                    Try adjusting your filters to find what you're looking for.
                  </p>
                </div>
              )}
            </div>
          </div>

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
      <Footer />
      
      {/* Compare Components */}
      <CompareFloatingButton />
      <ProductComparison />
    </>
  );
};

export default Shop;

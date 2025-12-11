import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { SlidersHorizontal, Star, X, RotateCcw } from 'lucide-react';

export interface FilterState {
  type: string;
  priceRange: [number, number];
  minRating: number;
  sortBy: string;
}

interface ProductFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  types: { value: string; label: string }[];
  maxPrice: number;
}

const ProductFilters = ({ filters, onFiltersChange, types, maxPrice }: ProductFiltersProps) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const resetFilters = () => {
    const defaultFilters: FilterState = {
      type: 'all',
      priceRange: [0, maxPrice],
      minRating: 0,
      sortBy: 'popularity'
    };
    setLocalFilters(defaultFilters);
    onFiltersChange(defaultFilters);
  };

  const FilterContent = () => (
    <div className="space-y-8">
      {/* Sort By */}
      <div>
        <Label className="text-sm font-medium mb-3 block">Sort By</Label>
        <Select value={localFilters.sortBy} onValueChange={(value) => updateFilter('sortBy', value)}>
          <SelectTrigger className="w-full bg-background border-luxury-brown/20">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent className="bg-background border-luxury-brown/20 z-50">
            <SelectItem value="popularity">Most Popular</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
            <SelectItem value="rating">Highest Rated</SelectItem>
            <SelectItem value="newest">Newest First</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Type Filter */}
      <div>
        <Label className="text-sm font-medium mb-3 block">Category</Label>
        <div className="flex flex-wrap gap-2">
          {types.map((type) => (
            <Button
              key={type.value}
              size="sm"
              variant={localFilters.type === type.value ? 'default' : 'outline'}
              onClick={() => updateFilter('type', type.value)}
              className={localFilters.type === type.value 
                ? 'gradient-luxury text-white border-none' 
                : 'border-luxury-brown/30 hover:border-luxury-brown hover:bg-luxury-cream/50'
              }
            >
              {type.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <Label className="text-sm font-medium mb-3 block">
          Price Range: ₹{localFilters.priceRange[0]} - ₹{localFilters.priceRange[1]}
        </Label>
        <Slider
          value={localFilters.priceRange}
          onValueChange={(value) => updateFilter('priceRange', value as [number, number])}
          min={0}
          max={maxPrice}
          step={50}
          className="mt-4"
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          <span>₹0</span>
          <span>₹{maxPrice}</span>
        </div>
      </div>

      {/* Rating Filter */}
      <div>
        <Label className="text-sm font-medium mb-3 block">Minimum Rating</Label>
        <div className="flex gap-2">
          {[0, 3, 4, 4.5].map((rating) => (
            <Button
              key={rating}
              size="sm"
              variant={localFilters.minRating === rating ? 'default' : 'outline'}
              onClick={() => updateFilter('minRating', rating)}
              className={`flex items-center gap-1 ${
                localFilters.minRating === rating 
                  ? 'gradient-luxury text-white border-none' 
                  : 'border-luxury-brown/30 hover:border-luxury-brown hover:bg-luxury-cream/50'
              }`}
            >
              {rating === 0 ? 'All' : (
                <>
                  {rating}+ <Star className="h-3 w-3 fill-current" />
                </>
              )}
            </Button>
          ))}
        </div>
      </div>

      {/* Reset Button */}
      <Button
        variant="outline"
        onClick={resetFilters}
        className="w-full border-luxury-brown/30 hover:border-luxury-brown"
      >
        <RotateCcw className="h-4 w-4 mr-2" />
        Reset All Filters
      </Button>
    </div>
  );

  return (
    <>
      {/* Desktop Filters */}
      <div className="hidden lg:block">
        <div className="bg-card rounded-xl p-6 border border-luxury-brown/10 shadow-lg sticky top-24">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <SlidersHorizontal className="h-5 w-5 text-luxury-brown" />
              Filters
            </h3>
          </div>
          <FilterContent />
        </div>
      </div>

      {/* Mobile Filters */}
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="gap-2 border-luxury-brown/30">
              <SlidersHorizontal className="h-4 w-4" />
              Filters & Sort
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] bg-background">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <SlidersHorizontal className="h-5 w-5 text-luxury-brown" />
                Filters & Sort
              </SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <FilterContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};

export default ProductFilters;

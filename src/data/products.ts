export interface Product {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  price: number;
  bulkPacks?: {
    quantity: string;
    price: number;
  }[];
  category: string;
  type: 'dark' | 'milk' | 'white' | 'vegan' | 'sugar-free';
  image: string;
  images: string[];
  ingredients: string[];
  allergens: string[];
  nutritionalInfo?: {
    calories: string;
    protein: string;
    carbs: string;
    fat: string;
  };
  rating: number;
  reviews: number;
  inStock: boolean;
  featured?: boolean;
  limitedEdition?: boolean;
  bestseller?: boolean;
}

export const products: Product[] = [
  {
    id: 'mango-white',
    name: 'Mango White Chocolate',
    description: 'Luxurious white chocolate infused with authentic Alphonso mango essence - a tropical delight.',
    longDescription: 'Our premium white chocolate combined with the rich, sweet flavor of Alphonso mangoes creates an extraordinary taste experience. Hand-crafted with real mango pulp from select Indian orchards, each piece offers a perfect balance of creamy sweetness and tropical fruit notes.',
    price: 549,
    bulkPacks: [
      { quantity: 'Pack of 6', price: 549 },
      { quantity: 'Pack of 12', price: 999 },
      { quantity: 'Pack of 24', price: 1799 }
    ],
    category: 'Fruit Chocolate',
    type: 'white',
    image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=800&h=800&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1511381939415-e44015466834?w=800&h=800&fit=crop'
    ],
    ingredients: ['Premium White Chocolate', 'Alphonso Mango Pulp', 'Cocoa Butter', 'Milk Powder', 'Natural Flavors'],
    allergens: ['Milk', 'May contain traces of nuts and soy'],
    nutritionalInfo: {
      calories: '140 per 25g',
      protein: '2g',
      carbs: '18g',
      fat: '7g'
    },
    rating: 4.9,
    reviews: 248,
    inStock: true,
    featured: true,
    bestseller: true,
  },
  {
    id: 'mango-milk',
    name: 'Mango Milk Chocolate',
    description: 'Smooth milk chocolate meets the king of fruits - a perfect harmony of flavors.',
    longDescription: 'Our signature milk chocolate blended with sun-ripened Alphonso mango creates an irresistible combination. The creamy milk chocolate base perfectly complements the tropical sweetness of mango, making this a favorite among chocolate lovers of all ages.',
    price: 499,
    bulkPacks: [
      { quantity: 'Pack of 6', price: 499 },
      { quantity: 'Pack of 12', price: 899 },
      { quantity: 'Pack of 24', price: 1649 }
    ],
    category: 'Fruit Chocolate',
    type: 'milk',
    image: 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=800&h=800&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1511381939415-e44015466834?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1481391243133-f96216dcb5d2?w=800&h=800&fit=crop'
    ],
    ingredients: ['Milk Chocolate', 'Mango Pulp', 'Cocoa Solids', 'Milk Solids', 'Sugar', 'Natural Mango Extract'],
    allergens: ['Milk', 'May contain traces of nuts and soy'],
    nutritionalInfo: {
      calories: '135 per 25g',
      protein: '2.5g',
      carbs: '17g',
      fat: '6g'
    },
    rating: 4.8,
    reviews: 312,
    inStock: true,
    featured: true,
    bestseller: true,
  },
  {
    id: 'strawberry-white',
    name: 'Strawberry White Chocolate',
    description: 'Delicate white chocolate enhanced with sweet, tangy strawberry goodness.',
    longDescription: 'Experience the romance of fresh strawberries combined with premium white chocolate. Made with real strawberry pieces and natural extracts, each bite delivers a burst of fruity freshness enveloped in smooth, creamy white chocolate.',
    price: 529,
    bulkPacks: [
      { quantity: 'Pack of 6', price: 529 },
      { quantity: 'Pack of 12', price: 969 },
      { quantity: 'Pack of 24', price: 1749 }
    ],
    category: 'Fruit Chocolate',
    type: 'white',
    image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=800&h=800&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=800&h=800&fit=crop'
    ],
    ingredients: ['White Chocolate', 'Strawberry Pieces', 'Strawberry Extract', 'Cocoa Butter', 'Milk Powder'],
    allergens: ['Milk', 'May contain traces of nuts and soy'],
    nutritionalInfo: {
      calories: '138 per 25g',
      protein: '2g',
      carbs: '18g',
      fat: '6.5g'
    },
    rating: 4.7,
    reviews: 189,
    inStock: true,
    featured: true,
  },
  {
    id: 'strawberry-milk',
    name: 'Strawberry Milk Chocolate',
    description: 'Classic milk chocolate paired with fresh strawberry for a timeless favorite.',
    longDescription: 'A beloved classic reimagined with premium ingredients. Our rich milk chocolate combined with real strawberry creates a nostalgic yet sophisticated treat that appeals to both children and adults. Perfect balance of creamy and fruity notes.',
    price: 479,
    bulkPacks: [
      { quantity: 'Pack of 6', price: 479 },
      { quantity: 'Pack of 12', price: 869 },
      { quantity: 'Pack of 24', price: 1599 }
    ],
    category: 'Fruit Chocolate',
    type: 'milk',
    image: 'https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=800&h=800&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1590080876847-eba8039d7b8b?w=800&h=800&fit=crop'
    ],
    ingredients: ['Milk Chocolate', 'Strawberry Pieces', 'Cocoa Solids', 'Milk Solids', 'Natural Strawberry Flavor'],
    allergens: ['Milk', 'May contain traces of nuts and soy'],
    nutritionalInfo: {
      calories: '133 per 25g',
      protein: '2.3g',
      carbs: '17g',
      fat: '6g'
    },
    rating: 4.8,
    reviews: 267,
    inStock: true,
    bestseller: true,
  },
  {
    id: 'custard-apple-white',
    name: 'Custard Apple White Chocolate',
    description: 'Exotic custard apple meets creamy white chocolate - an innovative fusion.',
    longDescription: 'Discover the unique taste of custard apple (sitaphal) blended into premium white chocolate. This exotic combination offers a distinctive flavor profile with the natural sweetness and creamy texture of custard apple perfectly complementing our smooth white chocolate.',
    price: 599,
    bulkPacks: [
      { quantity: 'Pack of 6', price: 599 },
      { quantity: 'Pack of 12', price: 1099 },
      { quantity: 'Pack of 24', price: 1999 }
    ],
    category: 'Fruit Chocolate',
    type: 'white',
    image: 'https://bizimages.withfloats.com/actual/fea2e489a60d4b848ead1bc9da3ac005.jpg',
    images: [
      'https://bizimages.withfloats.com/actual/fea2e489a60d4b848ead1bc9da3ac005.jpg',
      'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=800&h=800&fit=crop'
    ],
    ingredients: ['White Chocolate', 'Custard Apple Pulp', 'Cocoa Butter', 'Milk Powder', 'Natural Custard Apple Extract'],
    allergens: ['Milk', 'May contain traces of nuts and soy'],
    nutritionalInfo: {
      calories: '142 per 25g',
      protein: '2g',
      carbs: '19g',
      fat: '7g'
    },
    rating: 4.9,
    reviews: 156,
    inStock: true,
    featured: true,
    limitedEdition: true,
    bestseller: true,
  },
  {
    id: 'custard-apple-milk',
    name: 'Custard Apple Milk Chocolate',
    description: 'Rich milk chocolate infused with the rare and delicious custard apple flavor.',
    longDescription: 'A rare treat for adventurous chocolate lovers. Our premium milk chocolate enhanced with authentic custard apple creates a one-of-a-kind indulgence. The natural sweetness and unique texture of custard apple adds an exotic dimension to classic milk chocolate.',
    price: 569,
    bulkPacks: [
      { quantity: 'Pack of 6', price: 569 },
      { quantity: 'Pack of 12', price: 1049 },
      { quantity: 'Pack of 24', price: 1899 }
    ],
    category: 'Fruit Chocolate',
    type: 'milk',
    image: 'https://images.unsplash.com/photo-1606312619070-d48b4772d8f0?w=800&h=800&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1606312619070-d48b4772d8f0?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1511381939415-e44015466834?w=800&h=800&fit=crop'
    ],
    ingredients: ['Milk Chocolate', 'Custard Apple Pulp', 'Cocoa Solids', 'Milk Solids', 'Sugar', 'Natural Flavor'],
    allergens: ['Milk', 'May contain traces of nuts and soy'],
    nutritionalInfo: {
      calories: '137 per 25g',
      protein: '2.4g',
      carbs: '18g',
      fat: '6.5g'
    },
    rating: 4.8,
    reviews: 142,
    inStock: true,
    limitedEdition: true,
  },
  {
    id: 'strawberry-dark',
    name: 'Strawberry Dark Chocolate',
    description: 'Rich dark chocolate paired with fresh strawberry for a perfect balance of sweet and intense.',
    longDescription: '70% premium dark chocolate meets the sweetness of sun-ripened strawberries. A guilt-free indulgence packed with antioxidants and natural fruit goodness.',
    price: 649,
    category: 'Dark Chocolate',
    type: 'dark',
    image: 'https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=800&h=800&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=800&h=800&fit=crop'
    ],
    ingredients: ['Dark Chocolate 70%', 'Strawberry', 'Natural Flavors'],
    allergens: ['May contain traces of milk and nuts'],
    rating: 4.9,
    reviews: 203,
    inStock: true,
    bestseller: true,
  },
  {
    id: 'mango-milk',
    name: 'Mango Milk Chocolate',
    description: 'Smooth milk chocolate meets the king of fruits—mango for a luscious, tropical experience.',
    longDescription: 'Alphonso mango, known as the king of mangoes, combined with our premium milk chocolate creates an irresistible treat that captures the essence of Indian summers.',
    price: 549,
    category: 'Milk Chocolate',
    type: 'milk',
    image: 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=800&h=800&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1511381939415-e44015466834?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1481391243133-f96216dcb5d2?w=800&h=800&fit=crop'
    ],
    ingredients: ['Milk Chocolate', 'Mango Pulp', 'Cocoa', 'Sugar', 'Milk'],
    allergens: ['Milk', 'May contain traces of nuts'],
    rating: 4.7,
    reviews: 156,
    inStock: true,
    featured: true,
  },
  {
    id: 'orange-dark',
    name: 'Orange Dark Chocolate',
    description: 'Zesty orange essence combined with premium dark chocolate for a sophisticated treat.',
    longDescription: 'Belgian dark chocolate infused with natural orange oil creates a refined taste experience. The citrus notes perfectly complement the deep cocoa flavor.',
    price: 629,
    category: 'Dark Chocolate',
    type: 'dark',
    image: 'https://images.unsplash.com/photo-1606312619070-d48b4772d8f0?w=800&h=800&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1606312619070-d48b4772d8f0?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=800&h=800&fit=crop'
    ],
    ingredients: ['Dark Chocolate 65%', 'Orange Oil', 'Cocoa Butter'],
    allergens: ['May contain traces of milk and nuts'],
    rating: 4.6,
    reviews: 89,
    inStock: true,
  },
  {
    id: 'raspberry-white',
    name: 'Raspberry White Chocolate',
    description: 'Delicate white chocolate enhanced with tangy raspberry for an elegant flavor profile.',
    longDescription: 'Pure white chocolate meets the tartness of fresh raspberries. This elegant combination offers a sophisticated taste experience perfect for gifting.',
    price: 599,
    category: 'White Chocolate',
    type: 'white',
    image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=800&h=800&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=800&h=800&fit=crop'
    ],
    ingredients: ['White Chocolate', 'Raspberry', 'Cocoa Butter', 'Sugar', 'Milk Powder'],
    allergens: ['Milk', 'May contain traces of nuts'],
    rating: 4.8,
    reviews: 142,
    inStock: true,
    limitedEdition: true,
  },
  {
    id: 'blueberry-dark',
    name: 'Blueberry Dark Chocolate',
    description: 'Antioxidant-rich blueberries meet intense dark chocolate for a guilt-free indulgence.',
    longDescription: 'Superfood blueberries paired with 75% dark chocolate create a powerhouse of antioxidants and flavor. Perfect for health-conscious chocolate lovers.',
    price: 679,
    category: 'Dark Chocolate',
    type: 'dark',
    image: 'https://images.unsplash.com/photo-1590080876847-eba8039d7b8b?w=800&h=800&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1590080876847-eba8039d7b8b?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=800&h=800&fit=crop'
    ],
    ingredients: ['Dark Chocolate 75%', 'Blueberry', 'Cocoa Mass'],
    allergens: ['May contain traces of milk and nuts'],
    rating: 4.9,
    reviews: 178,
    inStock: true,
    featured: true,
  },
  {
    id: 'passion-fruit-milk',
    name: 'Passion Fruit Milk Chocolate',
    description: 'Exotic passion fruit swirled into velvety milk chocolate for an unforgettable taste.',
    longDescription: 'Tropical passion fruit brings an exotic twist to our creamy milk chocolate. Each bite transports you to a tropical paradise.',
    price: 569,
    category: 'Milk Chocolate',
    type: 'milk',
    image: 'https://images.unsplash.com/photo-1481391243133-f96216dcb5d2?w=800&h=800&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1481391243133-f96216dcb5d2?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1511381939415-e44015466834?w=800&h=800&fit=crop'
    ],
    ingredients: ['Milk Chocolate', 'Passion Fruit', 'Sugar', 'Cocoa', 'Milk'],
    allergens: ['Milk', 'May contain traces of nuts'],
    rating: 4.7,
    reviews: 95,
    inStock: true,
  },
  {
    id: 'mixed-berry',
    name: 'Mixed Berry Chocolate',
    description: 'A symphony of berries—strawberry, raspberry, and blueberry in premium chocolate.',
    longDescription: 'Three premium berries unite in perfect harmony with our signature milk chocolate. A berry lover\'s dream come true.',
    price: 699,
    category: 'Specialty',
    type: 'milk',
    image: 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=800&h=800&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1511381939415-e44015466834?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=800&h=800&fit=crop'
    ],
    ingredients: ['Milk Chocolate', 'Strawberry', 'Raspberry', 'Blueberry', 'Sugar'],
    allergens: ['Milk', 'May contain traces of nuts'],
    rating: 4.8,
    reviews: 167,
    inStock: true,
    limitedEdition: true,
  },
  {
    id: 'vegan-dark-almond',
    name: 'Vegan Dark Almond Chocolate',
    description: 'Plant-based dark chocolate with crunchy almonds for conscious indulgence.',
    longDescription: '100% vegan dark chocolate made with organic cocoa and topped with roasted California almonds. Ethical luxury you can feel good about.',
    price: 749,
    category: 'Vegan',
    type: 'vegan',
    image: 'https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=800&h=800&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1606312619070-d48b4772d8f0?w=800&h=800&fit=crop'
    ],
    ingredients: ['Organic Dark Chocolate', 'Almonds', 'Coconut Sugar', 'Cocoa Mass'],
    allergens: ['Tree nuts (Almonds)'],
    rating: 4.9,
    reviews: 134,
    inStock: true,
    featured: true,
  },
  {
    id: 'sugar-free-hazelnut',
    name: 'Sugar-Free Hazelnut Chocolate',
    description: 'Delicious milk chocolate with hazelnuts, sweetened naturally without sugar.',
    longDescription: 'Guilt-free indulgence with natural stevia sweetener and premium hazelnuts. Perfect for those watching their sugar intake.',
    price: 799,
    category: 'Sugar-Free',
    type: 'sugar-free',
    image: 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=800&h=800&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1511381939415-e44015466834?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1481391243133-f96216dcb5d2?w=800&h=800&fit=crop'
    ],
    ingredients: ['Sugar-Free Milk Chocolate', 'Hazelnuts', 'Stevia', 'Cocoa', 'Milk Powder'],
    allergens: ['Milk', 'Tree nuts (Hazelnuts)'],
    rating: 4.6,
    reviews: 87,
    inStock: true,
  },
];

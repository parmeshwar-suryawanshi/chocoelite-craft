import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setItems([]);
    }
  }, [user]);

  const fetchCart = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', user.id);
    
    if (data) {
      const cartItems: CartItem[] = data.map(item => ({
        id: item.product_id,
        name: item.product_name,
        price: parseFloat(item.price.toString()),
        quantity: item.quantity,
        image: item.product_image,
        category: item.product_category
      }));
      setItems(cartItems);
    }
  };

  const addToCart = async (product: Omit<CartItem, 'quantity'>) => {
    if (!user) {
      toast({ title: "Please sign in", description: "You need to be signed in to add items to cart" });
      return;
    }

    const existing = items.find(item => item.id === product.id);
    
    if (existing) {
      await supabase
        .from('cart_items')
        .update({ quantity: existing.quantity + 1 })
        .eq('user_id', user.id)
        .eq('product_id', product.id);
      
      setItems(prev =>
        prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
      toast({ title: "Updated cart", description: `${product.name} quantity increased` });
    } else {
      await supabase.from('cart_items').insert({
        user_id: user.id,
        product_id: product.id,
        product_name: product.name,
        product_image: product.image,
        product_category: product.category,
        price: product.price,
        quantity: 1
      });
      
      setItems(prev => [...prev, { ...product, quantity: 1 }]);
      toast({ title: "Added to cart", description: `${product.name} added successfully` });
    }
  };

  const removeFromCart = async (id: string) => {
    if (user) {
      await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', id);
    }
    setItems(prev => prev.filter(item => item.id !== id));
    toast({ title: "Removed from cart" });
  };

  const updateQuantity = async (id: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(id);
      return;
    }
    
    if (user) {
      await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('user_id', user.id)
        .eq('product_id', id);
    }
    
    setItems(prev =>
      prev.map(item => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const clearCart = async () => {
    if (user) {
      await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id);
    }
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};

import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, Pencil, MessageCircle, Phone, Mail, MapPin } from 'lucide-react';
import { format } from 'date-fns';

interface WhatsAppOrder {
  id: string;
  created_at: string;
  total_amount: number;
  status: string;
  delivery_status: string;
  customer_name: string | null;
  customer_phone: string | null;
  customer_email: string | null;
  shipping_address: unknown;
  tracking_notes: string | null;
  order_source: string;
}

interface OrderItem {
  product_name: string;
  quantity: number;
  price: number;
}

const initialOrderForm = {
  customer_name: '',
  customer_phone: '',
  customer_email: '',
  address: '',
  city: 'Mumbai',
  pincode: '',
  items: [{ product_name: '', quantity: 1, price: 0 }] as OrderItem[],
  total_amount: 0,
  tracking_notes: '',
};

const WhatsAppOrderManagement = () => {
  const { toast } = useToast();
  const [orders, setOrders] = useState<WhatsAppOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [orderForm, setOrderForm] = useState(initialOrderForm);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingOrder, setEditingOrder] = useState<string | null>(null);

  useEffect(() => {
    fetchWhatsAppOrders();
  }, []);

  const fetchWhatsAppOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('order_source', 'whatsapp')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching WhatsApp orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = (items: OrderItem[]) => {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const addItem = () => {
    const newItems = [...orderForm.items, { product_name: '', quantity: 1, price: 0 }];
    setOrderForm({ 
      ...orderForm, 
      items: newItems,
      total_amount: calculateTotal(newItems)
    });
  };

  const updateItem = (index: number, field: keyof OrderItem, value: string | number) => {
    const newItems = [...orderForm.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setOrderForm({ 
      ...orderForm, 
      items: newItems,
      total_amount: calculateTotal(newItems)
    });
  };

  const removeItem = (index: number) => {
    if (orderForm.items.length === 1) return;
    const newItems = orderForm.items.filter((_, i) => i !== index);
    setOrderForm({ 
      ...orderForm, 
      items: newItems,
      total_amount: calculateTotal(newItems)
    });
  };

  const handleSubmit = async () => {
    if (!orderForm.customer_name || !orderForm.customer_phone || !orderForm.address || !orderForm.city) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in customer name, phone, address, and city',
        variant: 'destructive',
      });
      return;
    }

    if (orderForm.items.some(item => !item.product_name || item.price <= 0)) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all item details with valid prices',
        variant: 'destructive',
      });
      return;
    }

    setSaving(true);
    try {
      // Get current user for the order
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const orderData = {
        user_id: user.id, // Admin creates on behalf
        customer_name: orderForm.customer_name,
        customer_phone: orderForm.customer_phone,
        customer_email: orderForm.customer_email || null,
        shipping_address: {
          address: orderForm.address,
          city: orderForm.city,
          pincode: orderForm.pincode,
        },
        total_amount: orderForm.total_amount,
        tracking_notes: orderForm.tracking_notes || null,
        order_source: 'whatsapp',
        status: 'confirmed',
        delivery_status: 'processing',
        payment_method: 'cod', // WhatsApp orders typically COD
      };

      if (editingOrder) {
        const { error } = await supabase
          .from('orders')
          .update({
            customer_name: orderForm.customer_name,
            customer_phone: orderForm.customer_phone,
            customer_email: orderForm.customer_email || null,
            shipping_address: orderData.shipping_address,
            total_amount: orderForm.total_amount,
            tracking_notes: orderForm.tracking_notes || null,
          })
          .eq('id', editingOrder);

        if (error) throw error;
        toast({ title: 'Success', description: 'WhatsApp order updated successfully' });
      } else {
        const { data: newOrder, error: orderError } = await supabase
          .from('orders')
          .insert(orderData)
          .select()
          .single();

        if (orderError) throw orderError;

        // Insert order items
        const orderItems = orderForm.items.map(item => ({
          order_id: newOrder.id,
          product_id: item.product_name.toLowerCase().replace(/\s+/g, '-'),
          product_name: item.product_name,
          product_image: '/placeholder.svg',
          quantity: item.quantity,
          price: item.price,
        }));

        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(orderItems);

        if (itemsError) throw itemsError;

        toast({ title: 'Success', description: 'WhatsApp order created successfully' });
      }

      setIsDialogOpen(false);
      setOrderForm(initialOrderForm);
      setEditingOrder(null);
      fetchWhatsAppOrders();
    } catch (error: any) {
      console.error('Error saving order:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save WhatsApp order',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string, deliveryStatus: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ status, delivery_status: deliveryStatus })
      .eq('id', orderId);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to update order status',
        variant: 'destructive',
      });
    } else {
      toast({ title: 'Success', description: 'Order status updated' });
      fetchWhatsAppOrders();
    }
  };

  const handleEditOrder = (order: WhatsAppOrder) => {
    const address = order.shipping_address as { address?: string; city?: string; pincode?: string };
    setOrderForm({
      customer_name: order.customer_name || '',
      customer_phone: order.customer_phone || '',
      customer_email: order.customer_email || '',
      address: address?.address || '',
      city: address?.city || 'Mumbai',
      pincode: address?.pincode || '',
      items: [{ product_name: 'Order items', quantity: 1, price: Number(order.total_amount) }],
      total_amount: Number(order.total_amount),
      tracking_notes: order.tracking_notes || '',
    });
    setEditingOrder(order.id);
    setIsDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Info Card */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <MessageCircle className="h-8 w-8 text-primary" />
            <div>
              <h3 className="font-semibold mb-1">WhatsApp Orders</h3>
              <p className="text-sm text-muted-foreground">
                Manually enter orders received via WhatsApp. These orders are tracked separately 
                and shown in analytics. Once WhatsApp Business API is integrated, this process 
                will be automated.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders Management */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-green-600" />
              WhatsApp Orders
            </CardTitle>
            <CardDescription>Manage orders placed via WhatsApp</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) {
              setOrderForm(initialOrderForm);
              setEditingOrder(null);
            }
          }}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add WhatsApp Order
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingOrder ? 'Edit WhatsApp Order' : 'Create WhatsApp Order'}</DialogTitle>
                <DialogDescription>Enter customer and order details from WhatsApp conversation</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                {/* Customer Details */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-sm text-muted-foreground">Customer Details</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="customer-name">Customer Name *</Label>
                      <Input
                        id="customer-name"
                        placeholder="Customer name"
                        value={orderForm.customer_name}
                        onChange={(e) => setOrderForm({ ...orderForm, customer_name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="customer-phone">Phone Number *</Label>
                      <Input
                        id="customer-phone"
                        placeholder="+91 XXXXXXXXXX"
                        value={orderForm.customer_phone}
                        onChange={(e) => setOrderForm({ ...orderForm, customer_phone: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customer-email">Email (Optional)</Label>
                    <Input
                      id="customer-email"
                      type="email"
                      placeholder="customer@email.com"
                      value={orderForm.customer_email}
                      onChange={(e) => setOrderForm({ ...orderForm, customer_email: e.target.value })}
                    />
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-sm text-muted-foreground">Shipping Address</h4>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address *</Label>
                    <Textarea
                      id="address"
                      placeholder="Full address"
                      value={orderForm.address}
                      onChange={(e) => setOrderForm({ ...orderForm, address: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Select
                        value={orderForm.city}
                        onValueChange={(value) => setOrderForm({ ...orderForm, city: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select city" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Mumbai">Mumbai</SelectItem>
                          <SelectItem value="Pune">Pune</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pincode">Pincode</Label>
                      <Input
                        id="pincode"
                        placeholder="400001"
                        value={orderForm.pincode}
                        onChange={(e) => setOrderForm({ ...orderForm, pincode: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-sm text-muted-foreground">Order Items</h4>
                    <Button type="button" variant="outline" size="sm" onClick={addItem}>
                      <Plus className="h-4 w-4 mr-1" /> Add Item
                    </Button>
                  </div>
                  {orderForm.items.map((item, index) => (
                    <div key={index} className="grid grid-cols-12 gap-2 items-end">
                      <div className="col-span-5 space-y-1">
                        <Label className="text-xs">Product Name</Label>
                        <Input
                          placeholder="Product name"
                          value={item.product_name}
                          onChange={(e) => updateItem(index, 'product_name', e.target.value)}
                        />
                      </div>
                      <div className="col-span-2 space-y-1">
                        <Label className="text-xs">Qty</Label>
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateItem(index, 'quantity', Number(e.target.value))}
                        />
                      </div>
                      <div className="col-span-3 space-y-1">
                        <Label className="text-xs">Price (₹)</Label>
                        <Input
                          type="number"
                          min="0"
                          value={item.price}
                          onChange={(e) => updateItem(index, 'price', Number(e.target.value))}
                        />
                      </div>
                      <div className="col-span-2">
                        {orderForm.items.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="text-destructive"
                            onClick={() => removeItem(index)}
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                  <div className="text-right font-semibold">
                    Total: ₹{orderForm.total_amount.toLocaleString()}
                  </div>
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <Label htmlFor="notes">Tracking Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any additional notes about the order..."
                    value={orderForm.tracking_notes}
                    onChange={(e) => setOrderForm({ ...orderForm, tracking_notes: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmit} disabled={saving}>
                  {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  {editingOrder ? 'Update' : 'Create'} Order
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No WhatsApp orders yet</p>
              <p className="text-sm">Orders placed via WhatsApp will appear here</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => {
                    const address = order.shipping_address as { city?: string };
                    return (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">
                          {order.customer_name || 'N/A'}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            {order.customer_phone && (
                              <span className="text-xs flex items-center gap-1">
                                <Phone className="h-3 w-3" /> {order.customer_phone}
                              </span>
                            )}
                            {order.customer_email && (
                              <span className="text-xs flex items-center gap-1 text-muted-foreground">
                                <Mail className="h-3 w-3" /> {order.customer_email}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" /> {address?.city || 'N/A'}
                          </span>
                        </TableCell>
                        <TableCell className="font-semibold">
                          ₹{Number(order.total_amount).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Badge variant={
                            order.delivery_status === 'delivered' ? 'default' :
                            order.delivery_status === 'shipped' ? 'secondary' :
                            'outline'
                          }>
                            {order.delivery_status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {format(new Date(order.created_at), 'MMM dd, yyyy')}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Select
                              value={order.delivery_status}
                              onValueChange={(value) => updateOrderStatus(order.id, order.status, value)}
                            >
                              <SelectTrigger className="w-[130px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="processing">Processing</SelectItem>
                                <SelectItem value="shipped">Shipped</SelectItem>
                                <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
                                <SelectItem value="delivered">Delivered</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditOrder(order)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WhatsAppOrderManagement;
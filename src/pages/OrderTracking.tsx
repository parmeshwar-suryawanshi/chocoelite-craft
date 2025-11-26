import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Package, Truck, CheckCircle, Clock, MapPin } from "lucide-react";

const OrderTracking = () => {
  const [orderId, setOrderId] = useState("");
  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "processing":
        return <Clock className="h-5 w-5" />;
      case "confirmed":
      case "packed":
        return <Package className="h-5 w-5" />;
      case "shipped":
      case "out_for_delivery":
        return <Truck className="h-5 w-5" />;
      case "delivered":
        return <CheckCircle className="h-5 w-5" />;
      default:
        return <Package className="h-5 w-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "processing":
        return "bg-yellow-500";
      case "confirmed":
      case "packed":
        return "bg-blue-500";
      case "shipped":
      case "out_for_delivery":
        return "bg-purple-500";
      case "delivered":
        return "bg-green-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const statusSteps = [
    { key: "processing", label: "Order Processing" },
    { key: "confirmed", label: "Order Confirmed" },
    { key: "packed", label: "Packed" },
    { key: "shipped", label: "Shipped" },
    { key: "out_for_delivery", label: "Out for Delivery" },
    { key: "delivered", label: "Delivered" },
  ];

  const handleTrackOrder = async () => {
    if (!orderId.trim()) {
      toast.error("Please enter an order ID");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          order_items (
            *
          )
        `)
        .eq("id", orderId)
        .single();

      if (error) {
        toast.error("Order not found. Please check your order ID.");
        setOrderData(null);
        return;
      }

      setOrderData(data);
    } catch (error) {
      toast.error("Failed to fetch order details");
      setOrderData(null);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentStepIndex = (status: string) => {
    return statusSteps.findIndex((step) => step.key === status);
  };

  return (
    <>
      <SEO
        title="Track Your Order | Choco Bliss"
        description="Track your chocolate order delivery status and estimated delivery time in real-time."
      />
      <div className="min-h-screen bg-background">
        <Navbar />
        
        <main className="container mx-auto px-4 py-8 mt-20">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-center mb-2">Track Your Order</h1>
            <p className="text-muted-foreground text-center mb-8">
              Enter your order ID to see real-time delivery status
            </p>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Enter Order Details</CardTitle>
                <CardDescription>
                  Your order ID was sent to your email after purchase
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <Input
                    placeholder="Enter your order ID"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleTrackOrder()}
                  />
                  <Button onClick={handleTrackOrder} disabled={loading}>
                    {loading ? "Tracking..." : "Track Order"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {orderData && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Order #{orderData.id.slice(0, 8)}</CardTitle>
                        <CardDescription>
                          Placed on {new Date(orderData.created_at).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <Badge className={getStatusColor(orderData.delivery_status)}>
                        {orderData.delivery_status.replace(/_/g, " ").toUpperCase()}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start gap-2">
                        <MapPin className="h-5 w-5 text-muted-foreground mt-1" />
                        <div>
                          <p className="font-medium">Shipping Address</p>
                          <p className="text-sm text-muted-foreground">
                            {orderData.shipping_address.fullName}<br />
                            {orderData.shipping_address.address}<br />
                            {orderData.shipping_address.city}, {orderData.shipping_address.state} {orderData.shipping_address.pincode}<br />
                            Phone: {orderData.shipping_address.phone}
                          </p>
                        </div>
                      </div>

                      {orderData.estimated_delivery_date && (
                        <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                          <Clock className="h-5 w-5 text-primary" />
                          <div>
                            <p className="font-medium">Estimated Delivery</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(orderData.estimated_delivery_date).toLocaleDateString("en-IN", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </p>
                          </div>
                        </div>
                      )}

                      {orderData.tracking_notes && (
                        <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                          <p className="text-sm font-medium mb-1">Latest Update</p>
                          <p className="text-sm text-muted-foreground">{orderData.tracking_notes}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Delivery Progress</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative">
                      {statusSteps.map((step, index) => {
                        const currentIndex = getCurrentStepIndex(orderData.delivery_status);
                        const isCompleted = index <= currentIndex;
                        const isCurrent = index === currentIndex;

                        return (
                          <div key={step.key} className="relative flex items-center mb-8 last:mb-0">
                            {index < statusSteps.length - 1 && (
                              <div
                                className={`absolute left-4 top-8 w-0.5 h-16 ${
                                  isCompleted ? "bg-primary" : "bg-muted"
                                }`}
                              />
                            )}
                            <div
                              className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full ${
                                isCompleted ? "bg-primary text-primary-foreground" : "bg-muted"
                              }`}
                            >
                              {getStatusIcon(step.key)}
                            </div>
                            <div className="ml-4">
                              <p className={`font-medium ${isCurrent ? "text-primary" : ""}`}>
                                {step.label}
                              </p>
                              {isCurrent && (
                                <p className="text-sm text-muted-foreground">Current Status</p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Order Items</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {orderData.order_items.map((item: any) => (
                        <div key={item.id} className="flex items-center gap-4">
                          <img
                            src={item.product_image}
                            alt={item.product_name}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div className="flex-1">
                            <p className="font-medium">{item.product_name}</p>
                            <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                          </div>
                          <p className="font-medium">₹{item.price}</p>
                        </div>
                      ))}
                      <div className="pt-4 border-t">
                        <div className="flex justify-between items-center">
                          <p className="text-lg font-bold">Total Amount</p>
                          <p className="text-lg font-bold">₹{orderData.total_amount}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default OrderTracking;

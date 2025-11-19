import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

const systemPrompt = `You are a friendly and knowledgeable chocolate shop assistant for ChocoElite. Your role is to:

1. Help customers learn about our products:
   - Mango White Chocolate (17gm ₹89, 35gm ₹169, 75gm ₹329)
   - Mango Milk Chocolate (17gm ₹79, 35gm ₹149, 75gm ₹299)
   - Strawberry White Chocolate (17gm ₹85, 35gm ₹159, 75gm ₹319)
   - Strawberry Milk Chocolate (17gm ₹75, 35gm ₹145, 75gm ₹289)
   - Custard Apple White Chocolate (17gm ₹95, 35gm ₹179, 75gm ₹349) - Limited Edition
   - Custard Apple Milk Chocolate (17gm ₹89, 35gm ₹169, 75gm ₹329) - Limited Edition

2. Promote current offers:
   - Buy 2 Get 1 FREE (limited time)
   - Flat 20% OFF on orders above ₹999 (code: CHOCO20)
   - Free delivery on orders above ₹499
   - Free premium gift wrapping on all orders
   - Festive combo packs starting at ₹199

3. Answer questions about:
   - Product ingredients and allergens
   - Delivery and shipping (All India delivery available)
   - Gift options and customization
   - Order tracking and returns
   - Nutritional information

4. Help with ordering:
   - Guide customers to place orders through the website or WhatsApp
   - Suggest products based on preferences
   - Recommend gift sets and combos

Be warm, helpful, and enthusiastic about our handcrafted fruit chocolates. Use emojis occasionally to be friendly. If asked to place an order, provide clear instructions on how to complete the purchase.`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, query } = await req.json();

    console.log('Received query:', query);

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ 
            response: "I'm experiencing high demand right now. Please try again in a moment or contact us directly on WhatsApp!" 
          }),
          { 
            status: 429,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ 
            response: "Our AI assistant is temporarily unavailable. Please contact us directly on WhatsApp for immediate assistance!" 
          }),
          { 
            status: 402,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    const assistantResponse = data.choices[0].message.content;

    console.log('AI Response:', assistantResponse);

    return new Response(
      JSON.stringify({ response: assistantResponse }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in whatsapp-assistant function:', error);
    return new Response(
      JSON.stringify({ 
        response: "I apologize, but I'm having trouble right now. Please try again or contact us directly on WhatsApp for assistance!" 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SuggestionRequest {
  type: 'product' | 'offer' | 'combo' | 'festival' | 'gallery' | 'video' | 'winner';
  context?: Record<string, unknown>;
  prompt?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, context, prompt } = await req.json() as SuggestionRequest;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    let systemPrompt = "";
    let userPrompt = prompt || "";

    switch (type) {
      case 'product':
        systemPrompt = `You are a premium chocolate brand content expert. Generate compelling, luxurious product descriptions and suggestions for ChocoElite, a premium artisan chocolate brand. Keep descriptions elegant, appetizing, and highlight quality ingredients. Focus on sensory experiences and premium quality.`;
        userPrompt = userPrompt || `Generate suggestions for a chocolate product with these details: ${JSON.stringify(context)}. Provide:
1. An improved product name (if applicable)
2. A short compelling description (max 100 words)
3. A detailed long description (max 200 words)
4. 3-5 key ingredients to highlight
5. Suggested allergen warnings
Format as JSON with keys: name, description, longDescription, ingredients, allergens`;
        break;
        
      case 'offer':
        systemPrompt = `You are a marketing expert for a premium chocolate brand. Create enticing promotional offers that drive sales while maintaining brand prestige. Focus on value perception and urgency.`;
        userPrompt = userPrompt || `Generate an attractive promotional offer for a premium chocolate brand. Context: ${JSON.stringify(context)}. Provide:
1. A catchy offer title
2. Compelling description
3. Suggested discount code
4. Marketing copy for the offer
Format as JSON with keys: title, description, code, marketingCopy`;
        break;
        
      case 'combo':
        systemPrompt = `You are a product bundling expert for a luxury chocolate brand. Create irresistible combo offers that maximize value perception and encourage larger purchases.`;
        userPrompt = userPrompt || `Create a combo offer suggestion. Context: ${JSON.stringify(context)}. Provide:
1. Creative combo name
2. Enticing description
3. Suggested pricing strategy
4. Recommended products to include
Format as JSON with keys: title, description, pricingTip, productSuggestions`;
        break;
        
      case 'festival':
        systemPrompt = `You are a seasonal marketing expert for a premium chocolate brand. Create festive promotional campaigns that resonate with cultural celebrations while maintaining luxury appeal.`;
        userPrompt = userPrompt || `Create a festival/seasonal offer for ${context?.festival || 'an upcoming celebration'}. Provide:
1. Festival-themed offer title
2. Celebratory description
3. Special discount code
4. Terms and conditions
Format as JSON with keys: title, description, code, terms`;
        break;
        
      case 'gallery':
        systemPrompt = `You are a visual content strategist for a premium chocolate brand. Suggest compelling image captions and alt texts that are both SEO-friendly and evocative.`;
        userPrompt = userPrompt || `Generate image title and alt text suggestions for a chocolate brand gallery. Context: ${JSON.stringify(context)}. Provide:
1. Engaging title
2. SEO-friendly alt text
3. Suggested image category
Format as JSON with keys: title, altText, category`;
        break;
        
      case 'video':
        systemPrompt = `You are a video content strategist for a premium chocolate brand. Create engaging video titles and descriptions that attract viewers and showcase craftsmanship.`;
        userPrompt = userPrompt || `Generate video content suggestions. Context: ${JSON.stringify(context)}. Provide:
1. Captivating video title
2. Engaging description
3. Suggested duration
4. Key talking points
Format as JSON with keys: title, description, duration, talkingPoints`;
        break;
        
      case 'winner':
        systemPrompt = `You are a customer engagement specialist. Create celebratory winner announcements that build community excitement and encourage participation in future campaigns.`;
        userPrompt = userPrompt || `Generate lucky winner announcement content. Context: ${JSON.stringify(context)}. Provide:
1. Celebration headline
2. Winner spotlight description
3. Suggested testimonial prompt
4. Campaign hashtag
Format as JSON with keys: headline, description, testimonialPrompt, hashtag`;
        break;
    }

    console.log(`Generating AI suggestions for type: ${type}`);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;
    
    let suggestions;
    try {
      suggestions = JSON.parse(content);
    } catch {
      suggestions = { rawSuggestion: content };
    }

    console.log(`Successfully generated suggestions for ${type}`);

    return new Response(
      JSON.stringify({ suggestions, type }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("AI suggestion error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Failed to generate suggestions" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');

const SUSTAINABILITY_CONTEXT = `
Você é um assistente especializado em sustentabilidade para uma plataforma de eco-ideias. Seu papel é:

1. ORIENTAR sobre categorias de impacto:
   - Conservação de Água
   - Eficiência Energética  
   - Redução de Resíduos
   - Transporte Sustentável
   - Materiais Sustentáveis
   - Biodiversidade

2. SUGERIR melhorias e alternativas sustentáveis
3. EXPLICAR impactos ambientais e benefícios
4. FORNECER dados e estatísticas quando relevante
5. AUXILIAR na quantificação de impactos (litros, kWh, kg, toneladas, %, unidades)

Seja sempre positivo, educativo e prático. Responda em português brasileiro.
`;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (!GEMINI_API_KEY) {
    console.error('GEMINI_API_KEY não configurada');
    return new Response(
      JSON.stringify({ error: 'API key não configurada' }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }

  try {
    const { message } = await req.json();

    if (!message) {
      return new Response(
        JSON.stringify({ error: 'Mensagem é obrigatória' }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Consultando Gemini com mensagem:', message);

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `${SUSTAINABILITY_CONTEXT}\n\nPergunta do usuário: ${message}`
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erro na API do Gemini:', response.status, errorText);
      return new Response(
        JSON.stringify({ error: 'Erro na consulta à IA' }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const data = await response.json();
    console.log('Resposta do Gemini:', data);
    
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Desculpe, não consegui gerar uma resposta.';

    return new Response(
      JSON.stringify({ reply }), 
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Erro no sustainability-ai:', error);
    return new Response(
      JSON.stringify({ error: 'Erro interno do servidor' }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
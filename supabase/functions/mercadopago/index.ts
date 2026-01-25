import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const MP_ACCESS_TOKEN = Deno.env.get('MP_ACCESS_TOKEN')!;
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

serve(async (req) => {
  const url = new URL(req.url);

  // 1. ROTA PARA CRIAR O LINK (O App chama aqui)
  if (req.method === 'POST' && url.pathname.includes('/criar-preferencia')) {
    try {
      const { user_id, email, title, price } = await req.json();

      const preference = {
        items: [
          {
            title: title,
            quantity: 1,
            currency_id: 'BRL',
            unit_price: Number(price)
          }
        ],
        payer: { email: email },
        external_reference: user_id, // AQUI VAI O ID DO USUÁRIO
        back_urls: {
          success: "axoryn://payment-success",
          failure: "axoryn://payment-failure",
          pending: "axoryn://payment-pending"
        },
        auto_return: "approved",
        // URL onde o Mercado Pago avisa que pagou
        notification_url: `${url.origin}/mercadopago/webhook` 
      };

      const res = await fetch('https://api.mercadopago.com/checkout/preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${MP_ACCESS_TOKEN}`
        },
        body: JSON.stringify(preference)
      });

      const data = await res.json();
      return new Response(JSON.stringify({ init_point: data.init_point }), { 
        headers: { 'Content-Type': 'application/json' } 
      });

    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 400 });
    }
  }

  // 2. ROTA DE WEBHOOK (O Mercado Pago chama aqui)
  if (req.method === 'POST' && url.pathname.includes('/webhook')) {
    try {
      // O Mercado Pago manda o ID no query ?id=... ou ?data.id=...
      const topic = url.searchParams.get('topic') || url.searchParams.get('type');
      const id = url.searchParams.get('id') || url.searchParams.get('data.id');

      if (topic === 'payment' && id) {
        // Consultar status no Mercado Pago
        const res = await fetch(`https://api.mercadopago.com/v1/payments/${id}`, {
          headers: { 'Authorization': `Bearer ${MP_ACCESS_TOKEN}` }
        });
        
        if (res.ok) {
          const paymentData = await res.json();
          const status = paymentData.status; // approved, pending...
          const userId = paymentData.external_reference; // O ID do usuário que guardamos antes

          // Salvar no Banco
          if (userId) {
            await supabase.from('assinaturas').upsert({ 
              user_id: userId, 
              payment_id: String(id), 
              status: status,
              valor: paymentData.transaction_amount
            });
          }
        }
      }
      return new Response("OK", { status: 200 });
    } catch (err) {
      return new Response("Erro webhook", { status: 400 });
    }
  }

  return new Response("Função MercadoPago Online!", { status: 200 });
});
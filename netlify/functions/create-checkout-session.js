// netlify/functions/create-checkout-session.js

// 1) Stripe SDK avec ta clé secrète (en variable d'environnement)
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// 2) Headers CORS (nécessaires pour appeler la fonction depuis tes sites)
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',                  // le temps des tests ; tu pourras restreindre à tes domaines
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json'
};

exports.handler = async (event) => {
  try {
    // 3) Réponse au preflight (OPTIONS) – indispensable pour CORS
    if (event.httpMethod === 'OPTIONS') {
      return { statusCode: 204, headers: CORS_HEADERS, body: '' };
    }

    // 4) On accepte uniquement POST
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        headers: CORS_HEADERS,
        body: JSON.stringify({ error: 'Method Not Allowed' })
      };
    }

    // 5) Lecture du body
    const body = JSON.parse(event.body || '{}');
    const product = (body.product || '').toLowerCase().trim();

    // 6) Mapping "produit" -> price_id (via variables Netlify)
    const priceMap = {
      peak:           process.env.PRICE_PEAK,
      warrior:        process.env.PRICE_WARRIOR,
      performance:    process.env.PRICE_PERFORMANCE,
      biohacking:     process.env.PRICE_BIOHACKING,
      intimacy:       process.env.PRICE_INTIMACY,
      energy:         process.env.PRICE_ENERGY,
      fat:            process.env.PRICE_FAT,
      focus:          process.env.PRICE_FOCUS,
      fasting:        process.env.PRICE_FASTING,
      meal:           process.env.PRICE_MEAL,
      nutrition:      process.env.PRICE_NUTRITION,
      mindfulness:    process.env.PRICE_MINDFULNESS,
      virility:       process.env.PRICE_VIRILITY,
      sleep:          process.env.PRICE_SLEEP,
      supplement:     process.env.PRICE_SUPPLEMENT,
      stress:         process.env.PRICE_STRESS,
      transformation: process.env.PRICE_TRANSFORMATION,
      hormone:        process.env.PRICE_HORMONE,
      assessment:     process.env.PRICE_ASSESSMENT,
      narcissist:     process.env.PRICE_NARCISSIST,
      muscle:         process.env.PRICE_MUSCLE,
    };

    const priceId = priceMap[product];

    // Aide au debug côté Netlify (visible dans Functions logs)
    console.log('Incoming product =', product);
    console.log('Resolved priceId =', priceId);

    if (!priceId || !String(priceId).startsWith('price_')) {
      return {
        statusCode: 400,
        headers: CORS_HEADERS,
        body: JSON.stringify({ error: 'Invalid product or missing Price ID' })
      };
    }

    // 7) URLs de redirection (configurables via env ou fallback sur /success.html & /cancel.html)
    const SUCCESS_URL =
      process.env.SUCCESS_URL || `${process.env.URL}/success.html`;
    const CANCEL_URL =
      process.env.CANCEL_URL || `${process.env.URL}/cancel.html`;

    // 8) Création de la session Checkout
    // (tes PriceIDs sont "one_time" d’après tes captures, donc mode: "payment")
    const session = await stripe.checkout.sessions.create({
      mode: 'payment', // mets "subscription" si tu utilises des prix récurrents
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: SUCCESS_URL,
      cancel_url: CANCEL_URL,
      // (facultatif) metadata pour suivi interne
      metadata: {
        product,
        from: 'netlify-fn'
      }
    });

    // 9) Réponse OK avec l’URL de Stripe
    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({ url: session.url })
    };
  } catch (err) {
    console.error('Checkout error:', err);
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: err.message || 'Server error' })
    };
  }
};
// netlify/functions/create-checkout-session.js








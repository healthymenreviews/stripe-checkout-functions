const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Clé API Stripe

exports.handler = async function(event, context) {
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  const sig = event.headers['stripe-signature'];
  const body = event.body;

  let receivedEvent;

  try {
    receivedEvent = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err) {
    console.error('❌ Webhook signature verification failed.', err.message);
    return {
      statusCode: 400,
      body: `Webhook Error: ${err.message}`,
    };
  }

  console.log('✅ Webhook received:', receivedEvent.type);

  if (receivedEvent.type === 'checkout.session.completed') {
    const session = receivedEvent.data.object;
    console.log(`💰 Payment successful for session ${session.id}`);
    // 👉 Ici tu peux mettre à jour la base de données, envoyer un email, débloquer un accès, etc.
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ received: true }),
  };
};


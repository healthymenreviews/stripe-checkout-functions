// ✅ Une seule déclaration stripe (CommonJS)
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const body = JSON.parse(event.body || "{}");

    // Mapping produit -> Price ID (depuis les variables d'env Netlify)
    const priceMap = {
      peak:        process.env.PRICE_PEAK,
      warrior:     process.env.PRICE_WARRIOR,
      performance: process.env.PRICE_PERFORMANCE,
      biohacking:  process.env.PRICE_BIOHACKING,
      intimacy:    process.env.PRICE_INTIMACY,
      energy:      process.env.PRICE_ENERGY,
      fat:         process.env.PRICE_FAT,
      focus:       process.env.PRICE_FOCUS,
      fasting:     process.env.PRICE_FASTING,
      meal:        process.env.PRICE_MEAL,
      nutrition:   process.env.PRICE_NUTRITION,
      mindfulness: process.env.PRICE_MINDFULNESS,
      virility:    process.env.PRICE_VIRILITY,
      sleep:       process.env.PRICE_SLEEP,
      supplement:  process.env.PRICE_SUPPLEMENT,
      stress:      process.env.PRICE_STRESS,
      transformation: process.env.PRICE_TRANSFORMATION,
      hormone:     process.env.PRICE_HORMONE,
      assessment:  process.env.PRICE_ASSESSMENT,
      narcissist:  process.env.PRICE_NARCISSIST,
      muscle:      process.env.PRICE_MUSCLE,
    };

    const product = body.product;             // ex: "peak"
    const priceId = priceMap[product];

    // 🔎 Logs pour Netlify -> Functions -> Logs
    console.log("📩 Body reçu:", body);
    console.log("➡️ Produit demandé:", product);
    console.log("➡️ PriceId sélectionné:", priceId);

    if (!priceId) {
      throw new Error("Invalid product or missing Price ID");
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment", // mets "subscription" si prix récurrent dans Stripe
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.URL}/success.html`,
      cancel_url: `${process.env.URL}/cancel.html`,
      metadata: { product },
    });

    console.log("✅ Session créée:", session.id);

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: session.url }),
    };
  } catch (err) {
    console.error("❌ Erreur Stripe:", err.message);
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: err.message }),
    };
  }
};








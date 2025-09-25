// /.netlify/functions/create-checkout-session.js
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20',
});

export async function handler(event) {
  try {
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const { userId, appSlug } = JSON.parse(event.body || '{}');

    const priceMap = {
      peak: "price_1S6iRuGGTyzK4rFlez0W8xg",
      warrior: "price_1S6iTgGGTyzK4rFfETVsfvHE",
      performance: "price_1S6iImGGTyzK4rFFL4Hyl73",
      biohacking: "price_1S6iGuGGTyzK4rFf6NsVEGfT",
      intimacy: "price_1S6iFnGGTyzK4rFFRAWAtMRS",
      energy: "price_1S6iDpGGTyzK4rFFsFebPohW",
      fat: "price_1S6iAFGGTyzK4rFfVDDIifvB",
      focus: "price_1S6i8cGGTyzK4rFfAupRMvA",
      fasting: "price_1S6iUGGTyzK4rFfgpPUvaVF",
      meal: "price_1S6i20GGTyzK4rFfqsRabpsL",
      nutrition: "price_1S6hz0GGTyzK4rFFeNEzY7rE",
      mindfulness: "price_1S6hxPGGGTyzK4rF5RvkLkvl",
      virility: "price_1S6hs1GGTyzK4rFFw3WTNkAV",
      sleep: "price_1S6hq6GGTyzK4rFFBbkiihKb",
      supplement: "price_1S6hoQGGTyzK4rFFycrLOruA",
      stress: "price_1S59u8GGTyzK4rFFgLC0Vgf1",
      transformation: "price_1S59QbGGTyzK4rFFc2Qdb6TZ",
      hormone: "price_1S59J3GGTyzK4rFFk4JnAewC",
      assessment: "price_1S59DwGGTyzK4rF0RsrF70U",
      narcissist: "price_1S59z3GGTyzK4rFFbLkxHxfI",
      muscle: "price_1S4xwzGGTyzK4rFfKPFg6JqA"
    };

    if (!priceMap[appSlug]) {
      return { statusCode: 400, body: 'Unknown appSlug / price not found' };
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',               // matches your current code
      payment_method_types: ['card'],     // ok with current API
      line_items: [{ price: priceMap[appSlug], quantity: 1 }],
      success_url: "https://playbook.healthymenreviews.com/success",
      cancel_url: "https://playbook.healthymenreviews.com/cancel",
      metadata: { userId, appSlug }
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: session.url })
    };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
}
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.handler = async function (event) {
  try {
    // Tu peux tester avec un seul price_id pour l’instant
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription", // ou "payment" si tu veux un paiement unique
      line_items: [
        {
          price: "price_1S6hq6GGTyzK4rfFBbkiiHkb", 
          quantity: 1,
        },
      ],
      success_url: "https://stripe-checkout-functions.netlify.app/success",
      cancel_url: "https://stripe-checkout-functions.netlify.app/cancel",
    });

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: session.url }),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};






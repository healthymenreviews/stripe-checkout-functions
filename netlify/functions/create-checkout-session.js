const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  try {
    const { userId, appSlug } = JSON.parse(event.body);

    const priceMap = {
      peak: "price_1S6iRuGGTyzK4rfFlez0w8xg",
      warrior: "price_1S6iTgGGTyzK4rfFETVsfvHE",		
      performance: "price_1S6iImGGTyzK4rfFLH4Yly73",	
      biohacking: "price_1S6iGuGGTyzK4rfF6NsVEGTf",	 
      intimacy: "price_1S6iFnGGTyzK4rfFRAWAtMRS",	 
      energy: "price_1S6iDpGGTyzK4rfFsfebPohW",	
      fat: "price_1S6iAFGGTyzK4rfFVDDiifVb",	
      focus: "price_1S6i8cGGTyzK4rfF4AupRMvA",	 
      fasting: "price_1S6i6UGGTyzK4rfFgpPuVaVF",	
      meal: "price_1S6i2OGGTyzK4rfFqsRabpsL",	
      nutrition: "price_1S6hz0GGTyzK4rfFNeE7xXF9",	
      mindfulness: "price_1S6hxPGGTyzK4rfF5RvkLkvl",	
      virility: "price_1S6hs1GGTyzK4rfFw3WTNkAV",	
      sleep: "price_1S6hq6GGTyzK4rfFBbkiiHkb",	
      supplement: "price_1S6hoQGGTyzK4rfFYcrL0ruA",	
      stress: "price_1S5gU8GGTyzK4rfFgLC0Vgf1",	
      transformation: "price_1S5gObGGTyzK4rfFc2Qdb6Tz",	
      hormone: "price_1S5gJ3GGTyzK4rfFK4JnAewC",	
      assessment: "price_1S5gDwGGTyzK4rfFoRsrF70U",	
      narcissist: "price_1S5g32GGTyzK4rfFbLkxHxfI",	
      muscle: "price_1S4xwzGGTyzK4rfFKPfg6JAq",	

    };

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [
        {
          price: priceMap[appSlug],
          quantity: 1,
        },
      ],
      success_url: "https://playbook.healthymenreviews.com/success",
      cancel_url: "https://playbook.healthymenreviews.com/cancel",
      metadata: { userId, appSlug },
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ url: session.url }),
    };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};

[build]
  functions = "netlify/functions"









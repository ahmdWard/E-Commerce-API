const stripe = require('stripe')(process.env.SECRET_KEY);

exports.createCheckoutSession = async (amount, currency = 'usd', metadata={},req) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment', 
      line_items: [
        {
          price_data: {
            currency,
            product_data: {
              name: 'a7a', 
            },
            unit_amount: amount*100, 
          },
          quantity: 1,
        },
      ],
      success_url: `${req.protocol}://${req.get('host')}/api/v1/order/confirm/:paymentId`,
      cancel_url: `${req.protocol}://${req.get('host')}/api/v1/cart`,
      customer_email: req.user.email,
      metadata,

    });

    return {
      success: true,
      checkoutUrl: session.url, 
      sessionId: session.id,
    };
  } catch (error) {
    console.error('Stripe checkout error:', error);

    return {
      success: false,
      error: error.message,
    };
  }
};

exports.getSessionStatus = async (sessionId) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    return {
      success: true,
      status: session.payment_status, 
      paymentMethod: session.payment_method_types[0],
      amount: session.amount_total,
    };
  } catch (error) {
    console.error('Error retrieving session status:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

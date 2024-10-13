const stripe = require('stripe')('sk_test_51Nrsh6LyLk8ANAJ2ntNQZ0iMQ2tMNeKnUcRvrkI8uMEfE02atbUJVQBavS0RyaiIPhXN0zb2En7plmdDaswqL7Kw00eYuC3JEg');

app.post('/payment-sheet', async (req, res) => {
  // Use an existing Customer ID if this is a returning customer.
  const customer = await stripe.customers.create();
  const ephemeralKey = await stripe.ephemeralKeys.create(
    {customer: customer.id},
    {apiVersion: '2023-08-16'}
  );
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 1099,
    currency: 'eur',
    customer: customer.id,
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.json({
    paymentIntent: paymentIntent.client_secret,
    ephemeralKey: ephemeralKey.secret,
    customer: customer.id,
    publishableKey: 'pk_test_51Nrsh6LyLk8ANAJ21UWigg4M0LgdF7jAxn92U7SlWQzlVLCxTyCaDoXVUUVaxMCsZFJxSJWpHuQAML2swPmAaabU00IXIGIZGm'
  });
});
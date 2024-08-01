import express from "express";
import Stripe from "stripe";

const app = express();
const port = 3000;

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || "your_secret_key_here";
const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2020-08-27" });

app.use(express.json());

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
app.post("/create-payment-intent", async (req, res) => {
  try {
    const { montantTotale } = req.body; // Extract the montantTotale from the request body

    if (!montantTotale || isNaN(montantTotale)) {
      return res.status(400).json({ error: "Invalid montantTotale" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(montantTotale * 100), // Convert montantTotale to cents (assuming it's in dollars)
      currency: "usd",
      payment_method_types: ["card"],
    });

    const clientSecret = paymentIntent.client_secret;

    res.json({
      clientSecret: clientSecret,
    });
  } catch (e) {
    console.error(e.message);
    res.status(500).json({ error: "An error occurred" });
  }
});
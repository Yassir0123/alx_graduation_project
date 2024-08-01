<?php
require 'vendor/autoload.php';
use Stripe\StripeClient; // Add this line
$stripe = new StripeClient('sk_test_51Nrsh6LyLk8ANAJ2ntNQZ0iMQ2tMNeKnUcRvrkI8uMEfE02atbUJVQBavS0RyaiIPhXN0zb2En7plmdDaswqL7Kw00eYuC3JEg'); // Replace with your Stripe Secret Key

$customer = $stripe->customers->create();
$ephemeralKey = $stripe->ephemeralKeys->create([
  'customer' => $customer->id,
], [
  'stripe_version' => '2022-08-01',
]);
$paymentIntent = $stripe->paymentIntents->create([
  'amount' => 1099, // Adjust the amount and currency as needed
  'currency' => 'eur', // Replace with your desired currency
  'customer' => $customer->id,
  'statement_descriptor' => 'Custom descriptor',
  'automatic_payment_methods' => [
    'enabled' => 'true',
  ],
]);

echo json_encode(
  [
    'paymentIntent' => $paymentIntent->client_secret,
    'ephemeralKey' => $ephemeralKey->secret,
    'customer' => $customer->id,
    'publishableKey' => 'pk_test_51Nrsh6LyLk8ANAJ21UWigg4M0LgdF7jAxn92U7SlWQzlVLCxTyCaDoXVUUVaxMCsZFJxSJWpHuQAML2swPmAaabU00IXIGIZGm', // Replace with your Publishable Key
  ]
);
http_response_code(200);
?>

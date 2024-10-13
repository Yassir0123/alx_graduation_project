// StripePay.js
import React from 'react';
import { StripeContainer } from '@stripe/stripe-react-native';
import StripeApp from './StripeApp';

const StripePay = ({ mt }) => {
  return (
    <StripeContainer>
      <StripeApp
        publishablekey='pk_test_51Nrsh6LyLk8ANAJ21UWigg4M0LgdF7jAxn92U7SlWQzlVLCxTyCaDoXVUUVaxMCsZFJxSJWpHuQAML2swPmAaabU00IXIGIZGm'
        montantTotale={mt} // Pass the montantTotale as a prop to StripeApp
      />
    </StripeContainer>
  );
};

export default StripePay;

import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography, Box, CircularProgress, TextField
} from '@mui/material';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardExpiryElement,
  CardNumberElement,
  useStripe,
  useElements,
  CardCvcElement
} from '@stripe/react-stripe-js';
import { toast } from 'material-react-toastify';
import PaymentService from '../../services/PaymentService';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import OrderService from '../../services/OrderService';
import { CartItemDto } from '../../models/Cart';
import CartService from '../../services/CartService';
import { useNavigate } from 'react-router-dom';
import { clearCart } from '../../redux/slices/cartSlice';

const stripePromise = loadStripe('pk_test_51RArt3GalAtnvnKaEyPaQPWGQe7W5B6qF2DhpYtUUf8wj3hFPHBXxuEkZYClIlH1qL0PAMPXAk9Ap9755oOf68Cf00XwVFUnTg');

interface CheckoutModalProps {
  open: boolean;
  onClose: () => void;
  totalAmount: number;
  cartItems: CartItemDto[];
}

const CheckoutForm: React.FC<{ totalAmount: number; onClose: () => void; cartItems: CartItemDto[] }> = ({ totalAmount, onClose, cartItems }) => {
  const userId = useSelector((state: RootState) => state.user.userId);
  const stripe = useStripe();
  const elements = useElements();
  const [cardHolderName, setCardHolderName] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isDarkMode = useSelector((state: RootState) => state.theme.isDarkMode);

  const textPrimary = isDarkMode ? '#f5f5f5' : '#0d0d0d';
  const textSecondary = isDarkMode ? '#c0c0c0' : '#4f4f4f';
  const errorColor = isDarkMode ? '#ef5350' : '#d32f2f';

  const elementOptions = {
    style: {
      base: {
        color: textPrimary,
        fontSize: '16px',
        '::placeholder': {
          color: textSecondary,
        },
      },
      invalid: {
        color: errorColor,
      },
    },
  };

  const handlePayment = async () => {
    if (!userId) {
      toast.error("You must be logged in to use this feature!");
      navigate(-1);
      return;
    }

    if (!stripe || !elements) return;

    setError(null);

    // Get elements
    const cardNumber = elements.getElement(CardNumberElement);
    const expiry = elements.getElement(CardExpiryElement);
    const cvc = elements.getElement(CardCvcElement);

    if (!cardNumber || !expiry || !cvc) {
      setError("One or more card elements are not initialized properly.");
      return;
    }

    setLoading(true);

    try {
      const { clientSecret } = await PaymentService.createPaymentIntent(totalAmount);

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardNumber,
          billing_details: {
            name: cardHolderName,
          }
        }
      });

      if (result.error) {
        toast.error(result.error.message || 'Payment failed');
      } else if (result.paymentIntent?.status === 'succeeded') {
        const paymentIntentId = result.paymentIntent.id;

        const order = await OrderService.createOrder({
          userId: userId,
          paymentIntentId: paymentIntentId,
          status: "Pending"
        });

        for (const item of cartItems) {
          await OrderService.addItemToOrder(order.orderId, {
            variantId: item.variantId,
            quantity: item.quantity,
            priceAtPurchase: item.price,
          });
        }

        await CartService.clearCart(userId);

        dispatch(clearCart());

        toast.success('Payment successful!');
        onClose();
      }

    } catch (error) {
      toast.error("Failed to process payment");
      throw new Error("Failed to process payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <DialogContent>
        <Typography variant="subtitle1" gutterBottom>
          Enter your card details to complete the payment of ${(totalAmount / 100).toFixed(2)}:
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Cardholder Name */}
          <Box>
            <Typography variant="body2">Cardholder's Name</Typography>
            <TextField
              fullWidth
              variant="outlined"
              value={cardHolderName}
              onChange={(e) => setCardHolderName(e.target.value)}
              placeholder="Cardholder Name"
              error={!!error}
              helperText={error && 'Cardholder name is required'}
            />
          </Box>

          {/* Card Number */}
          <Box>
            <Typography variant="body2">Card Number</Typography>
            <Box sx={{ border: '1px solid', borderRadius: 1, p: 1 }}>
              <CardNumberElement options={elementOptions} />
            </Box>
          </Box>

          {/* Expiry and CVC */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2">Expiry</Typography>
              <Box sx={{ border: '1px solid', borderRadius: 1, p: 1 }}>
                <CardExpiryElement options={elementOptions} />
              </Box>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2">CVC</Typography>
              <Box sx={{ border: '1px solid', borderRadius: 1, p: 1 }}>
                <CardCvcElement options={elementOptions} />
              </Box>
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading}>Cancel</Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handlePayment}
          disabled={loading}
        >
          {loading ? <CircularProgress size={20} /> : 'Pay Now'}
        </Button>
      </DialogActions>
    </>
  );
};

const CheckoutModal: React.FC<CheckoutModalProps> = ({ open, onClose, totalAmount, cartItems }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Checkout</DialogTitle>
      <Elements stripe={stripePromise}>
        <CheckoutForm totalAmount={totalAmount} onClose={onClose} cartItems={cartItems} />
      </Elements>
    </Dialog>
  );
};

export default CheckoutModal;

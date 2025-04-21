import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Pagination, CircularProgress, IconButton } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';
import { CartItemDto } from '../../models/Cart';
import CartService from '../../services/CartService';
import VariantPreviewModal from './VariantPreviewModal';
import { toast } from 'material-react-toastify';
import DeleteIcon from '@mui/icons-material/Delete';
import ConfirmationPopup from '../shared/ConfirmationPopup';
import CheckoutModal from './CheckoutModal';
import { resetCart, setCartItems } from '../../redux/slices/cartSlice';
import { useNavigate } from 'react-router-dom';

const ITEMS_PER_PAGE = 5;

const CartPreview: React.FC = () => {
  const userId = useSelector((state: RootState) => state.user.userId);
  const cart = useSelector((state: RootState) => state.cart); 
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [itemToRemove, setItemToRemove] = useState<CartItemDto | null>(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  useEffect(() => {
    if (!userId) {
      toast.error("You must be logged in to use this feature!");
      return;
    }

    const fetchCart = async () => {
      try {
        const data = await CartService.getCartForUser(userId);
        dispatch(setCartItems(data.items));
      } catch (error) {
        console.error('Failed to fetch cart:', error);
      } finally {
        setLoading(false);
      }
    };

    if (!cart.isCheckoutComplete) {
      fetchCart();
    }

    return () => {
      if (cart.isCheckoutComplete) {
        dispatch(resetCart()); // Reset the cart when checkout is complete
      }
    };
  }, [userId, cart.isCheckoutComplete, dispatch]);

  const handlePreview = (variantId: string) => {
    setSelectedVariantId(variantId);
    setPreviewOpen(true);
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleRemoveClick = (item: CartItemDto) => {
    setItemToRemove(item);
    setConfirmDialogOpen(true);
  };

  const handleRemoveConfirm = async () => {
    if (!userId) {
      toast.error("You must be logged in to use this feature!");
      return;
    }

    if (itemToRemove) {
      try {
        await CartService.removeCartItem(userId, itemToRemove.cartItemId);
        dispatch(setCartItems(cart.items.filter(item => item.cartItemId !== itemToRemove.cartItemId)));
        toast.success("Item removed from cart!");
      } catch (error) {
        toast.error("Failed to remove item from cart.");
      } finally {
        setConfirmDialogOpen(false);
        setItemToRemove(null);
      }
    }
  };

  const paginatedItems = cart.items.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  ) || [];

  const totalPrice = cart.items.reduce((sum: number, item: { price: number; quantity: number; }) => sum + item.price * item.quantity, 0);
  const totalPriceInCents = Math.round(totalPrice * 100);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (cart.isCheckoutComplete) {
    return (
      <Box textAlign="center" mt={5} mb={5}>
        <Typography variant="h5">Checkout successful! Your order is being processed.</Typography>
        <Button variant="contained" color="primary" onClick={() => navigate('/orders')}>
          View Order Details
        </Button>
      </Box>
    );
  }

  if (!cart.items.length) {
    return (
      <Box textAlign="center" mt={5}>
        <Typography variant="h5">Your cart is empty 🛒</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: '1000px', margin: 'auto', mt: 4, px: 2 }}>
      <Typography variant="h4" gutterBottom>
        Your Shopping Cart
      </Typography>

      <TableContainer component={Paper} sx={{ mb: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Product</strong></TableCell>
              <TableCell align="right"><strong>Price</strong></TableCell>
              <TableCell align="right"><strong>Quantity</strong></TableCell>
              <TableCell align="right"><strong>Total</strong></TableCell>
              <TableCell align="right"><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedItems.map((item: CartItemDto) => (
              <TableRow key={item.cartItemId}>
                <TableCell
                  sx={{ cursor: 'pointer' }}
                  onClick={() => handlePreview(item.variantId)}
                >
                  {item.variantName}
                </TableCell>
                <TableCell align="right">${item.price.toFixed(2)}</TableCell>
                <TableCell align="right">{item.quantity}</TableCell>
                <TableCell align="right">
                  ${(item.price * item.quantity).toFixed(2)}
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    color="error"
                    onClick={() => handleRemoveClick(item)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {cart.items.length > ITEMS_PER_PAGE && (
        <Box display="flex" justifyContent="center" mb={3}>
          <Pagination
            count={Math.ceil(cart.items.length / ITEMS_PER_PAGE)}
            page={page}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}

      <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
        <Typography variant="h6">
          Total: <strong>${totalPrice.toFixed(2)}</strong>
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={() => setCheckoutOpen(true)}
        >
          Checkout
        </Button>
      </Box>

      <VariantPreviewModal
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        variantId={selectedVariantId}
      />

      <CheckoutModal
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        totalAmount={totalPriceInCents}
        cartItems={cart.items}
      />

      <ConfirmationPopup
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        onConfirm={handleRemoveConfirm}
        title="Remove Item"
        message="Are you sure you want to remove this item from your cart?"
        confirmButtonText="Remove"
        confirmColor="error"
        cancelButtonText="Cancel"
      />
    </Box>
  );
};

export default CartPreview;

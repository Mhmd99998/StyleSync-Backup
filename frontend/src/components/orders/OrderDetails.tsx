import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Divider,
  CircularProgress,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import OrderService from '../../services/OrderService';
import { OrderDto } from '../../models/Order';
import ConfirmationPopup from '../shared/ConfirmationPopup';
import VariantPreviewModal from '../cart/VariantPreviewModal';

const formatDate = (date: string) => new Date(date).toLocaleDateString();

const OrderDetails: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();

  const [order, setOrder] = useState<OrderDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelPopupOpen, setCancelPopupOpen] = useState(false);
  const [variantPreviewOpen, setVariantPreviewOpen] = useState(false);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return;
      try {
        const data = await OrderService.getOrderById(orderId);
        setOrder(data);
      } catch (err) {
        console.error('Failed to fetch order details', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const handleCancelOrder = async () => {
    setCancelPopupOpen(false);
    console.log('Order canceled:', order?.orderId);
  };

  const handleOpenVariantPreview = (variantId: string) => {
    setSelectedVariantId(variantId);
    setVariantPreviewOpen(true);
  };

  const handleCloseVariantPreview = () => {
    setSelectedVariantId(null);
    setVariantPreviewOpen(false);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!order) {
    return (
      <Box textAlign="center" mt={5}>
        <Typography variant="h5">Order not found.</Typography>
      </Box>
    );
  }

  const purchaseDate = new Date(order.createdAt);
  const estimatedArrival = new Date(purchaseDate);
  estimatedArrival.setDate(estimatedArrival.getDate() + 14);

  return (
    <Box sx={{ maxWidth: '1000px', margin: 'auto', mt: 4, px: 2 }}>
      <Typography variant="h4" gutterBottom>
        Order Details
      </Typography>

      <Box display="flex" justifyContent="space-between" mb={2}>
        <Button variant="outlined" onClick={() => navigate(-1)}>
          Back
        </Button>

        {order.status === 'pending' && (
          <Button variant="contained" color="error" onClick={() => setCancelPopupOpen(true)}>
            Cancel Order
          </Button>
        )}
      </Box>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6">Order ID: {order.orderId}</Typography>
        <Typography variant="body1">
          Status: <strong>{order.status}</strong>
        </Typography>
        <Typography variant="body1">
          Date of Purchase: {formatDate(order.createdAt)}
        </Typography>
        <Typography variant="body1">
          Estimated Arrival: {formatDate(estimatedArrival.toISOString())}
        </Typography>
      </Paper>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h6" gutterBottom>
        Items in Order
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Item</strong></TableCell>
              <TableCell align="right"><strong>Quantity</strong></TableCell>
              <TableCell align="right"><strong>Unit Price</strong></TableCell>
              <TableCell align="right"><strong>Total</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {order.items.map((item) => (
              <TableRow key={item.orderItemId}>
                <TableCell>
                  <Typography
                    variant="body1"
                    sx={{ cursor: 'pointer' }}
                    onClick={() => handleOpenVariantPreview(item.variantId)}
                  >
                    {item.variantName}
                  </Typography>
                </TableCell>
                <TableCell align="right">{item.quantity}</TableCell>
                <TableCell align="right">${item.priceAtPurchase.toFixed(2)}</TableCell>
                <TableCell align="right">
                  ${(item.priceAtPurchase * item.quantity).toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Variant Preview Modal */}
      <VariantPreviewModal
        open={variantPreviewOpen}
        onClose={handleCloseVariantPreview}
        variantId={selectedVariantId}
      />

      {/* Cancel Confirmation Popup */}
      <ConfirmationPopup
        open={cancelPopupOpen}
        onClose={() => setCancelPopupOpen(false)}
        onConfirm={handleCancelOrder}
        title="Cancel Order"
        message="Are you sure you want to cancel this order?"
        confirmButtonText="Yes, Cancel"
        confirmColor="error"
        cancelButtonText="No"
      />
    </Box>
  );
};

export default OrderDetails;

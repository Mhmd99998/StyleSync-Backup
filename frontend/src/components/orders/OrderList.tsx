import React, { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import OrderService from '../../services/OrderService';
import { OrderDto } from '../../models/Order';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { useNavigate } from 'react-router-dom';

const OrdersList: React.FC = () => {
  const userId = useSelector((state: RootState) => state.user.userId);
  const [orders, setOrders] = useState<OrderDto[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await OrderService.getOrdersForUser(userId!);
        setOrders(data);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchOrders();
    }
  }, [userId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getEstimatedArrival = (dateString: string) => {
    const estimated = new Date(dateString);
    estimated.setDate(estimated.getDate() + 14);
    return estimated.toLocaleDateString();
  };

  const pendingShippedOrders = orders.filter(
    (order) => order.status === 'pending' || order.status === 'shipped'
  );
  const completedOrders = orders.filter(
    (order) => order.status === 'delivered' || order.status === 'cancelled'
  );

  const renderOrderTable = (orders: OrderDto[]) => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><strong>Order ID</strong></TableCell>
            <TableCell><strong>Status</strong></TableCell>
            <TableCell><strong>Date of Purchase</strong></TableCell>
            <TableCell><strong>Estimated Arrival</strong></TableCell>
            <TableCell align="right"><strong>Actions</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.orderId}>
              <TableCell>{order.orderId}</TableCell>
              <TableCell>{order.status}</TableCell>
              <TableCell>{formatDate(order.createdAt)}</TableCell>
              <TableCell>{getEstimatedArrival(order.createdAt)}</TableCell>
              <TableCell align="right">
                <Button
                  variant="outlined"
                  color="secondary"
                  size="small"
                  onClick={() => navigate(`/orders/${order.orderId}`)}
                >
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box maxWidth="1000px" mx="auto" mt={4} px={2}>
      <Typography variant="h4" gutterBottom>
        Your Orders
      </Typography>

      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Pending & Shipped</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {pendingShippedOrders.length > 0 ? (
            renderOrderTable(pendingShippedOrders)
          ) : (
            <Typography>No pending or shipped orders.</Typography>
          )}
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Delivered & Cancelled</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {completedOrders.length > 0 ? (
            renderOrderTable(completedOrders)
          ) : (
            <Typography>No delivered or cancelled orders.</Typography>
          )}
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default OrdersList;

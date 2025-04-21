import OrdersList from "../../components/orders/OrderList";
import Navbar from "../../components/shared/Navbar";

const OrderListPage: React.FC = () => {
  return (
    <>
      <Navbar />
      <OrdersList />
    </>
  )
}

export default OrderListPage;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../services/apis';
import toast from 'react-hot-toast';



interface Order {
  _id: string;
  user: {
    name: string;
    email: string;
    phoneNumber: number;
  } | null;
  items: {
    itemType: string;
    item: {
      bundleName: string;
      image: string;
      price: number;
    };
    price: number;
  };
  totalAmount: number;
  orderDate: string;
}

const OrderScreen: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/v1/payment/get-order`);
        console.log(response.data, "---response.data");
        setOrders(response.data);
        setLoading(false);
      } catch (error) {
        toast.error('Error fetching orders');
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      {orders.map((order) => (
        <div key={order._id} style={styles.card}>
          <OrderCard order={order} />
        </div>
      ))}
    </div>
  );
};

const OrderCard = ({ order }) => {
  return (
    <div style={styles.card}>
      <h5 style={{ color: 'white' }}>Order ID: {order._id}</h5>
      <p style={{ color: 'white' }}>User: {order.user ? order.user.name : 'Guest'}</p>
      <p style={{ color: 'white' }}>Total Amount: ₹{order.totalAmount}</p>
      <p style={{ color: 'white' }}>Order Date: {new Date(order.orderDate).toLocaleDateString()}</p>
      <div>
        <h6 style={{ color: 'white' }}>Items:</h6>
        <p style={{ color: 'white' }}>{order.items.itemType}</p>
        <p style={{ color: 'white' }}>{order.items.item.bundleName}</p>
        <p style={{ color: 'white' }}>₹{order.items.price}</p>
      </div>
    </div>
  );
};

const styles = {
  card: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '16px',
    flexDirection: 'row',  

    margin: '16px 0',
    cursor: 'pointer',
  },
};

export default OrderScreen;
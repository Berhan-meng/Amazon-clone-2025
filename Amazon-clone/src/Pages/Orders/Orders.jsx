import { useContext, useEffect, useState } from "react";
import Layout from "../../assets/Components/Layout/Layout";
import { db } from "../../Utility/firebase";
import { DataContext } from "../../assets/Components/DataProvider/DataProvider";
import ProductCard from "../../assets/Components/Product/ProductCard";
import styles from "./orders.module.css";

export default function Orders() {
  const [{ user }, dispatch] = useContext(DataContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe;

    if (user && user.uid) {
      // Fetch from the main orders collection where userId matches
      unsubscribe = db
        .collection("orders")
        .where("userId", "==", user.uid)
        .orderBy("created", "desc")
        .onSnapshot(
          (snapshot) => {
            const ordersData = snapshot.docs.map((doc) => ({
              id: doc.id,
              data: doc.data(),
            }));
            setOrders(ordersData);
            setLoading(false);
          },
          (error) => {
            console.error("Error fetching orders:", error);
            setLoading(false);
          }
        );
    } else {
      setOrders([]);
      setLoading(false);
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user]);

  if (loading) {
    return (
      <Layout>
        <section className={styles.container}>
          <div className={styles.orders_container}>
            <h2>Your Orders</h2>
            <div style={{ padding: "20px" }}>Loading your orders...</div>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className={styles.container}>
        <div className={styles.orders_container}>
          <h2>Your Orders</h2>
          {orders.length === 0 ? (
            <div style={{ padding: "20px" }}>You don't have any orders yet</div>
          ) : (
            <div>
              {orders.map((eachOrder, i) => (
                <div key={eachOrder.id} style={{ marginBottom: "30px" }}>
                  <hr />
                  <div style={{ marginBottom: "15px" }}>
                    <p>
                      <strong>Order ID:</strong> {eachOrder.id}
                    </p>
                    <p>
                      <strong>Order Date:</strong>{" "}
                      {new Date(eachOrder.data.created).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>Status:</strong>{" "}
                      {eachOrder.data.status || "preparing"}
                    </p>
                    <p>
                      <strong>Total:</strong>{" "}
                      {eachOrder.data.amountFormatted ||
                        `$${(eachOrder.data.amount / 100).toFixed(2)}`}
                    </p>
                  </div>

                  <div style={{ marginLeft: "20px" }}>
                    <h4>Items in this order:</h4>
                    {eachOrder.data.basket &&
                    eachOrder.data.basket.length > 0 ? (
                      eachOrder.data.basket.map((orderItem, index) => (
                        <ProductCard
                          key={`${orderItem.product?.id || index}_${index}`}
                          orderId={eachOrder.id}
                          product={orderItem.product}
                          flex={true}
                          renderAdd={false}
                          renderDesc={false}
                        />
                      ))
                    ) : (
                      <p>No items found in this order</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}

import { useContext, useState } from "react";
import { DataContext } from "../../assets/Components/DataProvider/DataProvider.jsx";
import ProductCard from "../../assets/Components/Product/ProductCard.jsx";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { formatMoney } from "../../Utility/Money.js";
import { Type } from "../../Utility/action.type.js";
import { instance } from "../../Api/axios.js";
import { ClipLoader } from "react-spinners";
import { db } from "../../Utility/firebase.js";
import { useNavigate } from "react-router-dom";
import Layout from "../../assets/Components/Layout/Layout.jsx";
import { toast } from "react-toastify";
import styles from "./payment.module.css";

export default function Payment() {
  const [{ user, basket }, dispatch] = useContext(DataContext);
  const [cardError, setCardError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  // Check if basket exists and is not empty
  if (!basket || basket.length === 0) {
    return (
      <Layout>
        <div className={styles.container}>
          <p>Your basket is empty</p>
          <button onClick={() => navigate("/")}>Continue Shopping</button>
        </div>
      </Layout>
    );
  }

  // Calculate totals with null checks
  const totalItem =
    basket?.reduce((amount, item) => {
      return (item?.amount || 0) + amount;
    }, 0) || 0;

  const total =
    basket?.reduce((amount, cartItem) => {
      return amount + (cartItem?.product?.price || 0) * (cartItem?.amount || 0);
    }, 0) || 0;

  const handleChange = (e) => {
    e?.error?.message ? setCardError(e.error.message) : setCardError("");
  };

  const handlePayment = async (e) => {
    e.preventDefault();

    // Validation
    if (!stripe || !elements) {
      console.error("Stripe not loaded");
      return;
    }

    if (!user || !user.uid) {
      console.error("User not authenticated");
      navigate("/login");
      return;
    }

    if (total <= 0) {
      setCardError("Invalid order amount");
      return;
    }

    try {
      setProcessing(true);
      setCardError("");

      // 1. Get clientSecret from backend
      const response = await instance({
        method: "POST",
        url: `/payment/create?total=${Math.round(total * 100)}`,
      });

      const clientSecret = response.data?.clientSecret;

      if (!clientSecret) {
        throw new Error("No client secret received");
      }

      // 2. Confirm payment with Stripe
      const { paymentIntent, error: confirmError } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement),
          },
        });

      if (confirmError) {
        setCardError(confirmError.message);
        setProcessing(false);
        return;
      }

      if (paymentIntent.status !== "succeeded") {
        throw new Error(`Payment status: ${paymentIntent.status}`);
      }

      console.log("Payment successful:", paymentIntent.id);

      // 3. Create order data
      const orderData = {
        userId: user.uid,
        userEmail: user.email,
        basket: basket,
        amount: paymentIntent.amount,
        amountFormatted: formatMoney(total),
        created: paymentIntent.created * 1000, // Convert to milliseconds
        status: "preparing",
        estimatedDelivery:
          paymentIntent.created * 1000 + 5 * 24 * 60 * 60 * 1000, // +5 days
        timeline: {
          ordered: Date.now(),
          preparing: Date.now(),
          shipped: null,
          delivered: null,
        },
        paymentId: paymentIntent.id,
        paymentMethod: "card",
        address: {
          email: user.email,
          city: "Dere Birhan",
          country: "Ethiopia",
        },
      };
      // 4. Save order to Firestore in a batch write (more efficient)
      const batch = db.batch();
      const orderRef = db.collection("orders").doc(paymentIntent.id);
      const userOrderRef = db
        .collection("users")
        .doc(user.uid)
        .collection("orders")
        .doc(paymentIntent.id);

      // Save full order data to main orders collection
      batch.set(orderRef, orderData);
      batch.set(userOrderRef, {
        orderId: paymentIntent.id,
        created: orderData.created,
        amount: orderData.amount,
        amountFormatted: orderData.amountFormatted,
        status: orderData.status,
        basket: basket,
        address: orderData.address,
      });

      await batch.commit();
      toast.success("Payment successful! Your order has been placed.");

      // 5. Empty basket
      dispatch({ type: Type.EMPTY_BASKET });

      // 6. Navigate to orders page
      navigate("/orders", {
        state: {
          message: "Your order has been placed successfully!",
          orderId: paymentIntent.id,
        },
      });
    } catch (err) {
      console.error("Payment error:", err);
      setCardError(err.message || "Payment failed. Please try again.");
      setProcessing(false);
    }
  };

  return (
    <Layout>
      <div className={styles.payment_header}>
        Checkout ({totalItem} {totalItem === 1 ? "item" : "items"})
      </div>

      <section className={styles.payment}>
        {/* Address Section */}
        <div className={styles.flex}>
          <h3>Delivery Address</h3>
          <div>
            <div>{user?.email || "No email available"}</div>
            <div>Dere Birhan</div>
            <div>Ethiopia</div>
          </div>
        </div>
        <hr />

        {/* Products Section */}
        <div className={styles.flex}>
          <h3>Review Items and Delivery</h3>
          <div>
            {basket.map((item, i) => (
              <ProductCard
                product={item?.product}
                key={`${item?.product?.id || i}_${i}`}
                renderDesc={false}
                flex={true}
                renderAdd={false}
                tracking={true}
              />
            ))}
          </div>
        </div>
        <hr />

        {/* Payment Section */}
        <div className={styles.flex}>
          <h3>Payment Method</h3>
          <div className={styles.payment_card_container}>
            <div className={styles.payment_details}>
              <form onSubmit={handlePayment}>
                {cardError && (
                  <div className={styles.error}>
                    <small>{cardError}</small>
                  </div>
                )}

                <div className={styles.card_element}>
                  <CardElement
                    onChange={handleChange}
                    options={{
                      style: {
                        base: {
                          fontSize: "16px",
                          color: "#424770",
                          "::placeholder": {
                            color: "#aab7c4",
                          },
                        },
                        invalid: {
                          color: "#9e2146",
                        },
                      },
                    }}
                  />
                </div>

                <div className={styles.payment_price}>
                  <div>
                    <span>Order Total: {formatMoney(total)}</span>
                    {/* <small>Shipping: Calculated at checkout</small> */}
                  </div>
                  <button
                    type="submit"
                    disabled={!stripe || processing || total <= 0}
                    className={processing ? styles.processing : ""}
                  >
                    {processing ? (
                      <div className={styles.loading}>
                        <ClipLoader color="#ffffff" size={20} />
                        <span>Processing...</span>
                      </div>
                    ) : (
                      `Pay ${formatMoney(total)}`
                    )}
                  </button>
                </div>

                <div className={styles.disclaimer}>
                  <small>Your payment is secured with Stripe.</small>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

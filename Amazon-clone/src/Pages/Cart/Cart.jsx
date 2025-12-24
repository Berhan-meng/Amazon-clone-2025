import React, { useContext } from "react";
import { DataContext } from "../../assets/Components/DataProvider/DataProvider";
import ProductCard from "../../assets/Components/Product/ProductCard.jsx";
import { formatMoney } from "../../Utility/Money.js";
import { Type } from "../../Utility/action.type.js";
import styles from "./Cart.module.css";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import DeleteIcon from "@mui/icons-material/Delete";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../../assets/Components/Layout/Layout.jsx";

export default function Cart() {
  const [{ basket, user }, dispatch] = useContext(DataContext);
  const navigate = useNavigate();

  // Calculate total with null checks
  const total =
    basket?.reduce((amount, cartItem) => {
      return amount + (cartItem?.product?.price || 0) * (cartItem?.amount || 0);
    }, 0) || 0;

  // Calculate total items
  const totalItems =
    basket?.reduce((total, item) => {
      return total + (item?.amount || 0);
    }, 0) || 0;

  const increment = (item) => {
    dispatch({
      type: Type.ADD_TO_BASKET,
      item,
    });
  };

  const decrement = (item) => {
    dispatch({
      type: Type.REMOVE_FROM_BASKET,
      product: item.product,
    });
  };

  const removeItem = (product) => {
    dispatch({
      type: Type.REMOVE_FROM_BASKET,
      product: product,
    });
  };

  const handleCheckout = () => {
    if (!user) {
      navigate("/login", { state: { from: "/cart" } });
      return;
    }
    navigate("/payment");
  };

  const continueShopping = () => {
    navigate("/");
  };

  if (!basket || basket.length === 0) {
    return (
      <Layout>
        <div className={styles.empty_cart_container}>
          <div className={styles.empty_cart}>
            <h2>Your Shopping Cart</h2>
            <p>Your cart is empty</p>
            <button
              onClick={continueShopping}
              className={styles.continue_shopping_btn}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className={styles.container}>
        <div className={styles.cart_container}>
          <div className={styles.cart_header}>
            <h1>Shopping Cart</h1>
            <span className={styles.item_count}>
              ({totalItems} {totalItems === 1 ? "item" : "items"})
            </span>
          </div>

          <div className={styles.cart_items}>
            {basket.map((cartItem, i) => (
              <div
                key={`${cartItem.product?.id || i}_${i}`}
                className={styles.cart_item}
              >
                <div className={styles.product_container}>
                  <ProductCard
                    product={cartItem.product}
                    renderDesc={false}
                    flex={true}
                    renderAdd={false}
                    enableHover={false}
                    tracking={false}
                  />
                </div>

                <div className={styles.item_actions}>
                  <div className={styles.quantity_controls}>
                    <button
                      className={styles.quantity_btn}
                      onClick={() => increment(cartItem)}
                      aria-label="Increase quantity"
                    >
                      <ArrowDropUpIcon />
                    </button>
                    <span className={styles.quantity}>{cartItem.amount}</span>
                    <button
                      className={styles.quantity_btn}
                      onClick={() => decrement(cartItem)}
                      aria-label="Decrease quantity"
                    >
                      <ArrowDropDownIcon />
                    </button>
                  </div>

                  {/* <div className={styles.item_total}>
                    <span>
                      {formatMoney(cartItem.product.price * cartItem.amount)}
                    </span>
                  </div> */}

                  <button
                    className={styles.remove_btn}
                    onClick={() => removeItem(cartItem.product)}
                    aria-label="Remove item"
                  >
                    <small>Delete</small>
                    <DeleteIcon>Delete</DeleteIcon>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.summary_container}>
          <div className={styles.summary}>
            <h3>Order Summary</h3>

            <div className={styles.summary_row}>
              <span>Subtotal ({totalItems} items)</span>
              <span>{formatMoney(total)}</span>
            </div>

            <div className={styles.summary_row}>
              <span>Shipping</span>
              <span className={styles.free_shipping}>FREE</span>
            </div>

            <div className={styles.summary_row}>
              <span>Estimated Tax</span>
              <span>{formatMoney(total * 0.1)}</span>
            </div>

            <div className={styles.summary_divider}></div>

            <div className={`${styles.summary_row} ${styles.total_row}`}>
              <span>
                <strong>Order Total</strong>
              </span>
              <span>
                <strong>{formatMoney(total * 1.1)}</strong>
              </span>
            </div>

            <div className={styles.gift_option}>
              <input type="checkbox" id="gift" />
              <label htmlFor="gift">This order contains a gift</label>
            </div>

            <button
              onClick={handleCheckout}
              className={styles.checkout_btn}
              disabled={totalItems === 0}
            >
              Proceed to Checkout
            </button>

            <div className={styles.secure_checkout}>
              <span>🔒 Secure checkout</span>
              <small>Your payment information is encrypted</small>
            </div>

            <button
              onClick={continueShopping}
              className={styles.continue_shopping}
            >
              ← Continue Shopping
            </button>
          </div>
        </div>
      </section>
    </Layout>
  );
}

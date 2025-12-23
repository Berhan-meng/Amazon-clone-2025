import React, { useContext } from "react";
import { DataContext } from "../../assets/Components/DataProvider/DataProvider";
import ProductCard from "../../assets/Components//Product/ProductCard.jsx";
import { formatMoney } from "../../Utility/Money.js";
import { Type } from "../../Utility/action.type.js";
import styles from "./Cart.module.css";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Link } from "react-router-dom";
import Layout from "../../assets/Components/Layout/Layout.jsx";

export default function Cart() {
  const [{ basket }, dispatch] = useContext(DataContext);
  console.log(basket);
  const total = basket.reduce((amount, cartItem) => {
    return amount + cartItem.product.price * cartItem.amount;
  }, 0);

  const increament = (item) => {
    dispatch({
      type: Type.ADD_TO_BASKET,
      item,
    });
  };

  const decreament = (item) => {
    dispatch({
      type: Type.REMOVE_FROM_BASKET,
      product: item.product,
    });
  };
  return (
    <Layout>
      <section className={styles.container}>
        <div className={styles.cart_container}>
          <h2>Hello</h2>
          <h3>Your Shipping Basket</h3>
          <hr />
          {basket?.length == 0 ? (
            <p>No Items in your Cart</p>
          ) : (
            basket?.map((cartItem, i) => {
              return (
                <section>
                  <div className={styles.product__container}>
                    <ProductCard
                      product={cartItem.product}
                      key={i}
                      renderDesc={false}
                      flex={true}
                      renderAdd={false}
                      enableHover={false}
                      tracking={false}
                    />
                  </div>
                  <div className={styles.btn_container}>
                    <button
                      className={styles.btn}
                      onClick={() => increament(cartItem)}
                    >
                      <ArrowDropUpIcon size={10} />
                    </button>
                    <span>{cartItem.amount}</span>
                    <button
                      className={styles.btn}
                      onClick={() => decreament(cartItem)}
                    >
                      <ArrowDropDownIcon size={10} />
                    </button>
                  </div>
                </section>
              );
            })
          )}
        </div>
        {basket?.length !== 0 && (
          <div className={styles.subtotal}>
            <div>
              <p>Subtotal({basket?.length} items)</p>
              {formatMoney(total)}
            </div>
            <span>
              <input type="checkbox" />
              <small>This Order Contains a gift</small>
            </span>
            <Link to="/payment"> Continue to Checkout</Link>
          </div>
        )}
      </section>
    </Layout>
  );
}

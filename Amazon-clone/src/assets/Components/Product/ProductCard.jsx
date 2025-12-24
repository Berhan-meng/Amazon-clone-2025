import Rating from "@mui/material/Rating";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { DataContext } from "../DataProvider/DataProvider";
import { formatMoney } from "../../../Utility/Money";
import { AddToCart } from "../../../Utility/AddToCart.js";
import styles from "./ProductCard.module.css";
import Spinnner from "../../../Pages/Spinner";

export default function ProductCard({
  product,
  renderDesc,
  renderAdd,
  flex,
  enableHover,
  // showTracking,
  // orderId,
}) {
  const { image, title, id, rating, price, category, description } = product;
  const [state, dispatch] = useContext(DataContext);
  const { addCartItem } = AddToCart();
  console.log(state);
  if (!product) {
    return <Spinnner />;
  }
  return (
    <div
      className={`${styles.productCard} 
      ${flex ? styles.product__flexed : ""} 
      ${enableHover ? styles.hoverable : ""}`}
    >
      <Link to={`/products/${id}`}>
        <img src={image} alt={title} className={styles.productCard__img} />
      </Link>

      <div className={styles.productCard__info}>
        <h3 className={styles.productCard__title}>{title}</h3>
        <div className={styles.productCard__rating}>
          <Rating value={rating.rate} precision={0.1} size="small" />
          <span className={styles.productCard__ratingCount}>
            ({rating.count})
          </span>
        </div>
        <p className={styles.productCard__price}> {formatMoney(price)}</p>
        {renderDesc && <p style={{ textAlign: "justify" }}>{description}</p>}
        <p className={styles.productCard__category}>{category}</p>
        {renderAdd && (
          <button
            className={styles.productCard__btn}
            onClick={() => addCartItem(product)}
          >
            Add to Cart
          </button>
        )}
      </div>
      {/* {showTracking && orderId && (
        <div className={styles.productActions}>
          <Link to={`/tracking/${orderId}`}>
            <button className={styles.track_package_button}>
              Track package
            </button>
          </Link>
        </div>
      )} */}
    </div>
  );
}

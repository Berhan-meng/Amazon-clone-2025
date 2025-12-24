import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "./ProductCard";
import styles from "./Product.module.css";
import { producturl } from "../../../Api/endPoint";
import Spinnner from "../../../Pages/Spinner";

export default function Product() {
  const [product, setProduct] = useState([]);

  useEffect(() => {
    axios
      .get(`${producturl}/products`)
      .then((res) => setProduct(res.data))
      .catch((err) => console.log(err));
  }, []);
  if (!product) {
    return <Spinnner />;
  }

  return (
    <section className={styles.productContainer}>
      {product?.map((singleItem) => (
        <ProductCard
          key={singleItem.id}
          product={singleItem}
          renderDesc={false}
          renderAdd={true}
          enableHover={true}
          select={true}
        />
      ))}
    </section>
  );
}

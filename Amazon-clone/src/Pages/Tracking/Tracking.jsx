// import { useParams } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { db } from "../../Utility/firebase";
// import styles from "./tracking.module.css";
// import Spinner from "../Spinner";

// export default function Tracking() {
//   const { orderId } = useParams();
//   const [order, setOrder] = useState(null);

//   useEffect(() => {
//     if (!orderId) return;

//     db.collection("orders")
//       .doc(orderId)
//       .get()
//       .then((doc) => {
//         if (doc.exists) {
//           setOrder(doc.data());
//         }
//       });
//   }, [orderId]);

//   if (!order) return <Spinner />;

//   return (
//     <div className={styles.tracking}>
//       <h2>Order Tracking</h2>
//       <p>
//         Arriving on{" "}
//         <strong>
//           {order?.estimatedDelivery
//             ? new Date(
//                 order.estimatedDelivery.toDate
//                   ? order.estimatedDelivery.toDate()
//                   : order.estimatedDelivery
//               ).toDateString()
//             : "Unknown"}
//         </strong>
//       </p>

//       <div className={styles.progress}>
//         <div className={`${styles.step} ${styles.active}`}>Preparing</div>

//         <div
//           className={`${styles.step} ${
//             order?.status && order.status !== "preparing" ? styles.active : ""
//           }`}
//         >
//           Shipped
//         </div>

//         <div
//           className={`${styles.step} ${
//             order?.status === "delivered" ? styles.active : ""
//           }`}
//         >
//           Delivered
//         </div>
//       </div>
//     </div>
//   );
// }

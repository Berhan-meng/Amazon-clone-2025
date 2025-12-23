// import { useParams } from "react-router-dom";
// import { useEffect, useState, useContext } from "react";
// import { DataContext } from "../../assets/Components/DataProvider/DataProvider";
// import { db } from "../../Utility/firebase";
// import styles from "./Tracking.module.css";
// import Spinnner from "../Spinner";

// export default function Tracking() {
//   const { orderId } = useParams();
//   const [{ user }] = useContext(DataContext);
//   const [order, setOrder] = useState(null);

//   useEffect(() => {
//     if (!user) return;

//     db.collection("users")
//       .doc(user.uid)
//       .collection("orders")
//       .doc(orderId)
//       .get()
//       .then((doc) => {
//         if (doc.exists) {
//           setOrder(doc.data());
//         }
//       });
//   }, [user, orderId]);

//   if (!order || !order.status) {
//     return <Spinnner />;
//   }

//   return (
//     <div className={styles.tracking}>
//       <h2>Order Tracking</h2>

//       <p>
//         Arriving on{" "}
//         <strong>
//           {order?.estimatedDelivery?.seconds
//             ? new Date(order.estimatedDelivery.seconds * 1000).toDateString()
//             : "Calculating delivery date..."}
//         </strong>
//       </p>

//       <div className={styles.progress}>
//         <div className={`${styles.step} ${styles.active}`}>Preparing</div>
//         <div
//           className={`${styles.step} ${
//             order.status !== "preparing" ? styles.active : ""
//           }`}
//         >
//           Shipped
//         </div>
//         <div
//           className={`${styles.step} ${
//             order.status === "delivered" ? styles.active : ""
//           }`}
//         >
//           Delivered
//         </div>
//       </div>
//     </div>
//   );
// }

import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { db } from "../../Utility/firebase";
import styles from "./Tracking.module.css";
import Spinner from "../Spinner";

export default function Tracking() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (!orderId) return;

    db.collection("orders")
      .doc(orderId)
      .get()
      .then((doc) => {
        if (doc.exists) {
          setOrder(doc.data());
        }
      });
  }, [orderId]);

  if (!order) return <Spinner />;

  return (
    <div className={styles.tracking}>
      <h2>Order Tracking</h2>
      <p>
        Arriving on{" "}
        <strong>
          {order?.estimatedDelivery
            ? new Date(
                order.estimatedDelivery.toDate
                  ? order.estimatedDelivery.toDate()
                  : order.estimatedDelivery
              ).toDateString()
            : "Unknown"}
        </strong>
      </p>

      <div className={styles.progress}>
        <div className={`${styles.step} ${styles.active}`}>Preparing</div>

        <div
          className={`${styles.step} ${
            order?.status && order.status !== "preparing" ? styles.active : ""
          }`}
        >
          Shipped
        </div>

        <div
          className={`${styles.step} ${
            order?.status === "delivered" ? styles.active : ""
          }`}
        >
          Delivered
        </div>
      </div>
    </div>
  );
}

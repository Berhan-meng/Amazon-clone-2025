import { HashRouter, Routes, Route } from "react-router-dom";
import Landing from "./Pages/Landing/Landing";
import Cart from "./Pages/Cart/Cart";
import Payment from "./Pages/Payment/Payment";
import ProductDetail from "./Pages/ProductDetail/ProductDetail";
import Results from "./Pages/Results/Results";
import Orders from "./Pages/Orders/Orders";
import Auth from "./Pages/Auth/Auth";
import ProtectedRoute from "./assets/Components/protectedRoute/protectedRoute";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Tracking from "./Pages/Tracking/Tracking.jsx";
const stripePromise = loadStripe(
  "pk_test_51SbkYcCerv0GlD1KpmLFmszWWEaGH0N64IMzZw787ZeATqcVfS9Bmh4FQaUd56CCj0MHsNV2k3E8tH4KLSzJznO800ytP0P176"
);

export default function Routing() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
        <Route
          path="/orders"
          element={
            <ProtectedRoute
              msg={`you must login to see your orders`}
              redirect={"/orders"}
            >
              <Elements stripe={stripePromise}>
                <Orders />
              </Elements>
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment"
          element={
            <ProtectedRoute msg={`you must login to pay`} redirect={"/payment"}>
              <Elements stripe={stripePromise}>
                <Payment />
              </Elements>
            </ProtectedRoute>
          }
        />
        <Route path="/productdetail" element={<ProductDetail />} />
        <Route path="products/category/:categoryName" element={<Results />} />
        <Route path="products/:productId" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/tracking/:orderId" element={<Tracking />} />
      </Routes>
    </HashRouter>
  );
}

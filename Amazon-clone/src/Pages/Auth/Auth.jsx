// 423523234;
import { auth } from "../../Utility/firebase";
import { useState, useContext } from "react";
import styles from "./auth.module.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { DataContext } from "../../assets/Components/DataProvider/DataProvider";
import { Type } from "../../Utility/action.type";
import { SyncLoader } from "react-spinners";
import Layout from "../../assets/Components/Layout/Layout";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [generalError, setGeneralError] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState({ signIn: false, signUp: false });
  const navigate = useNavigate();
  const [{ user }, dispatch] = useContext(DataContext);

  const navStateData = useLocation();
  console.log(navStateData)

  // console.log(email);
  // console.log(password);

  async function handleSubmit(e) {
    e.preventDefault();

    if (e.target.name === "signIn") {
      setLoading({ ...loading, signIn: true });
      signInWithEmailAndPassword(auth, email, password)
        .then((userInfo) => {
          dispatch({
            type: Type.SET_USER,
            user: userInfo.user,
          });
          setLoading({ ...loading, signIn: false });
          navigate(navStateData?.state?.redirect || "/");
        })
        .catch((err) => {
          setGeneralError(err.message);
          setLoading({ ...loading, signIn: false });
        });
    } else {
      setLoading({ ...loading, signUp: true });
      createUserWithEmailAndPassword(auth, email, password)
        .then((userInfo) => {
          dispatch({
            type: Type.SET_USER,
            user: userInfo.user,
          });
          setLoading({ ...loading, signUp: false });
          navigate(navStateData?.state?.redirect || "/");
        })
        .catch((err) => {
          setGeneralError(err.message);
          setLoading({ ...loading, signUp: false });
        });
    }
  }

  return (
    // <Layout>
    <div className={styles.signin__page}>
      <div className={styles.signin__container}>
        {/* Left promo / help column */}
        {/* <aside className={`${styles.signin__promo} ${styles.aria__hidden}`}>
            <h2>Welcome to Amazon</h2>
            <p>
              Sign in to continue shopping, view orders, and manage your
              account.
            </p>
            <ul>
              <li>Fast checkout</li>
              <li>Track your orders</li>
              <li>Manage addresses & payments</li>
            </ul>
          </aside> */}

        {/* Sign-in card */}
        <main
          className={styles.signin__card}
          role="main"
          aria-labelledby="signin-title"
        >
          <h2 className={styles.welcome}>Welcome to</h2>
          <Link to="/">
            <img
              src="https://pngimg.com/uploads/amazon/amazon_PNG11.png"
              alt="amazon logo"
              className={styles.header__logo}
            />
          </Link>
          <form className={styles.signin__form} noValidate>
            <h1 id={styles.signin__title}>Sign-in</h1>
            {navStateData?.state?.msg && (
              <small
                style={{
                  padding: "5px",
                  textAlign: "center",
                  color: "red",
                  fontWeight: "bold",
                }}
              >
                {navStateData.state.msg}
              </small>
            )}

            <label className={styles.field} htmlFor="email">
              <span className={styles.field__label}>Email</span>
              <input
                id="email"
                type="text"
                inputMode="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="username"
              />
            </label>

            <label className={styles.field} htmlFor="password">
              <span className={styles.field__label}>Password</span>
              <div className={styles.password__row}>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className={styles.toggle__password}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((s) => !s)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </label>
            <div className={`${styles.form__row} ${styles.small}`}>
              <label className={styles.remember}>
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />{" "}
                Keep me signed in
              </label>
              <a className={styles.help__link} href="/help/forgot-password">
                Forgot your password?
              </a>
            </div>

            <div className={styles.form__actions}>
              <button
                className={styles.btn__primary}
                type="submit"
                onClick={handleSubmit}
                name="signIn"
              >
                {loading.signIn ? (
                  <SyncLoader color="#fff" size={8} />
                ) : (
                  "Sign in"
                )}
              </button>
            </div>

            <div className={`${styles.small} ${styles.muted} ${styles.center}`}>
              or
            </div>

            <div className={styles.create__account}>
              <a
                className={styles.btn__outline}
                href="/register"
                name="signUp"
                onClick={handleSubmit}
              >
                {loading.signUp ? (
                  <SyncLoader color="#000" size={10} />
                ) : (
                  "Create your Amazon account"
                )}
              </a>
            </div>
            {generalError && (
              <p className={styles.signin_error}>{generalError}</p>
            )}

            <div
              className={`${styles.signin__footer} ${styles.small} ${styles.muted}`}
            >
              By continuing, you agree to our{" "}
              <a href="/terms">Conditions of Use</a> and{" "}
              <a href="/privacy">Privacy Notice</a>.
            </div>
          </form>
        </main>
      </div>
    </div>
    // </Layout>
  );
}

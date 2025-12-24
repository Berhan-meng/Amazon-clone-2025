import Lowerheader from "./Lowerheader/Lowerheader.jsx";
import { BiCart } from "react-icons/bi";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { DataContext } from "../DataProvider/DataProvider.jsx";
import styles from "./header.module.css";
import { auth } from "../../../Utility/firebase.js";
import { GoSearch } from "react-icons/go";
import { CiLocationOn } from "react-icons/ci";

export default function Header() {
  const [{ user, basket }, dispatch] = useContext(DataContext);
  console.log(basket);
  const totalItem = basket?.reduce((amount, item) => {
    return item.amount + amount;
  }, 0);

  return (
    <>
      <header className={styles.header}>
        {/* LEFT SECTION */}
        <div className={styles.header__left}>
          {/* Logo */}
          <Link to="/">
            <img
              src="https://pngimg.com/uploads/amazon/amazon_PNG11.png"
              alt="amazon logo"
              className={styles.header__logo}
            />
          </Link>

          {/* Location */}
          <div className={styles.header__location}>
            <span className={styles.header__locationIcon}>
              <CiLocationOn />
            </span>
            <div className={styles.delivered__to}>
              <span className={styles.header__smallText}>Deliver to</span>
              <span className={styles.header__boldText}>Ethiopia</span>
            </div>
          </div>
        </div>

        {/* SEARCH BAR */}
        <div className={styles.header__search}>
          <select className={styles.header__searchSelect}>
            <option value="">All</option>
          </select>

          <input
            type="search"
            placeholder="Search products"
            className={styles.header__searchInput}
          />

          <button className={styles.header__searchBtn}>
            <GoSearch />
          </button>
        </div>

        {/* RIGHT SECTION */}
        <div className={styles.header__right}>
          {/* Language */}
          <div className={styles.header__lang}>
            <img
              src="https://pngimg.com/uploads/flags/flags_PNG14592.png"
              alt="USA Flag"
              className={styles.header__flag}
            />
            <select className={styles.header__langSelect}>
              <option>EN</option>
            </select>
          </div>

          {/* Account */}
          <Link className={styles.header__link} to={!user && "/auth"}>
            <div>
              {user ? (
                <>
                  {/* <p className={styles.header__smallText}>
                    Hello,{" "}
                    {user?.displayName || user?.email?.split("@")[0] || "User"}
                  </p> */}
                  <p className={styles.header__smallText}>
                    Hello,{" "}
                    {typeof user?.email === "string"
                      ? user.email.split("m")[0]
                      : "User"}
                  </p>
                  <span
                    className={styles.header__boldText}
                    onClick={() => auth.signOut()}
                  >
                    Sign Out
                  </span>
                </>
              ) : (
                <>
                  <p className={styles.header__smallText}>Hello, Sign in</p>
                  <p className={styles.header__boldText}>Account & Lists</p>
                </>
              )}
            </div>
          </Link>

          {/* Orders */}
          <Link className={styles.header__link} to="/orders">
            <p className={styles.header__smallText}>Returns</p>
            <span className={styles.header__boldText}>& Orders</span>
          </Link>

          {/* Cart */}
          <Link className={styles.header__cart} to="/cart">
            <BiCart className={styles.header__cartIcon} size={35} />
            <span className={styles.header__cartCount}>{totalItem}</span>
          </Link>
        </div>
      </header>
      <Lowerheader />
    </>
  );
}

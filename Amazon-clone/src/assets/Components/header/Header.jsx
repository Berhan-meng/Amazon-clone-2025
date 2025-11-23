import React from "react";
import "./Header.css";
import { BiCart } from "react-icons/bi";


export default function Header() {
  return (
    <header className="header">
      {/* LEFT SECTION */}
      <div className="header__left">
        {/* Logo */}
        <a href="/">
          <img
            src="https://pngimg.com/uploads/amazon/amazon_PNG11.png"
            alt="amazon logo"
            className="header__logo"
          />
        </a>

        {/* Location */}
        <div className="header__location">
          <span className="header__locationIcon">
            <img src="../../../../public/location-2952.png" alt="" />
          </span>
          <div>
            <p className="header__smallText">Deliver to</p>
            <span className="header__boldText">Ethiopia</span>
          </div>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="header__search">
        <select className="header__searchSelect">
          <option value="">All</option>
        </select>

        <input
          type="search"
          placeholder="Search products"
          className="header__searchInput"
        />

        <button className="header__searchBtn">🔍</button>
      </div>

      {/* RIGHT SECTION */}
      <div className="header__right">
        {/* Language */}
        <div className="header__lang">
          <img
            src="https://pngimg.com/uploads/flags/flags_PNG14592.png"
            alt="USA Flag"
            className="header__flag"
          />
          <select className="header__langSelect">
            <option>EN</option>
          </select>
        </div>

        {/* Account */}
        <a className="header__link" href="">
          <p className="header__smallText">Hello, Sign in</p>
          <span className="header__boldText">Account & Lists</span>
        </a>

        {/* Orders */}
        <a className="header__link" href="">
          <p className="header__smallText">Returns</p>
          <span className="header__boldText">& Orders</span>
        </a>

        {/* Cart */}
        <a className="header__cart" href="/cart">
          <BiCart className="header__cartIcon" size={35} />
          <span className="header__cartCount">0</span>
        </a>
      </div>
    </header>
  );
}

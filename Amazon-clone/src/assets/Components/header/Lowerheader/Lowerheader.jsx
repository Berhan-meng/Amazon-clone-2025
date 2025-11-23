import { AiOutlineMenu } from "react-icons/ai";
import "./lowerheader.css";

export default function Lowerheader() {
  return (
    <div className="lowerHeader">
      {/* Left menu */}
      <div className="lowerHeader__menu">
        <AiOutlineMenu size={22} />
        <p>All</p>
      </div>

      {/* Right list */}
      <ul className="lowerHeader__list">
        <li>Today's Deals</li>
        <li>Customer Service</li>
        <li>Registry</li>
        <li>Gift Cards</li>
        <li>Sell</li>
      </ul>
    </div>
  );
}

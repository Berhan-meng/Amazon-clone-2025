// import numeral from "numeral";

// export const formatMoney = (price) => {
//   const forattedAmount = numeral(price).format("$0,0.00");
//   return forattedAmount;
// };

export const formatMoney = (price = 0) => {
  return `$${Number(price).toFixed(2)}`;
};

const itemFromApiToUI = ({id, title, condition, shipping, price, currency_id, thumbnail: picture, seller_address}) => {
  const calcInteger = price => Math.floor(price);
  const calcDecimal = price => +(price % 1).toFixed(2).substring(2);
  return {
    id,
    title,
    condition,
    picture,
    price: {
      amount: calcInteger(price),
      decimals: calcDecimal(price),
      currency: currency_id
    },
    state: seller_address.state.name,
    free_shipping: shipping.free_shipping
  };
};

export default itemFromApiToUI;



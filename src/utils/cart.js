export const addItemToCart = (prevCart, product) => {
  const existingItem = prevCart.find(
    (item) => item.id === product.id && item.type === product.type
  );

  if (existingItem) {
    return prevCart.map((item) =>
      item.id === product.id && item.type === product.type
        ? { ...item, quantity: (item.quantity || 1) + 1 }
        : item
    );
  }

  return [...prevCart, { ...product, quantity: 1 }];
};

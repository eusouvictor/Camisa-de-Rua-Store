import React, { useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import ModalAuth from "./components/ModalAuth";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Events from "./pages/Events";
import Settings from "./pages/Settings";
import LandingPage from "./pages/Landing"; // Nova importação

function App() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setIsAuthOpen(false);
    navigate("/home");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Mensagem enviada!");
  };

  const handleExploreClick = () => {
    if (user) {
      navigate("/home");
    } else {
      setIsAuthOpen(true);
    }
  };

  // Funções do carrinho
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const updateCart = (newCart) => {
    setCart(newCart);
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-white font-sans">
      <Routes>
        {/* Rota da Landing Page (pública) */}
        <Route
          path="/"
          element={
            <LandingPage
              isAuthOpen={isAuthOpen}
              setIsAuthOpen={setIsAuthOpen}
              user={user}
              handleExploreClick={handleExploreClick}
              handleSubmit={handleSubmit}
              handleLoginSuccess={handleLoginSuccess}
            />
          }
        />

        {/* Rotas protegidas */}
        <Route
          path="/home"
          element={
            user ? (
              <Home addToCart={addToCart} cart={cart} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        <Route
          path="/cart"
          element={
            user ? (
              <Cart
                cart={cart}
                updateCart={updateCart}
                removeFromCart={removeFromCart}
              />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        <Route
          path="/events"
          element={
            user ? (
              <Events addToCart={addToCart} cart={cart} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        <Route
          path="/settings"
          element={
            user ? (
              <Settings user={user} setUser={setUser} cart={cart} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        {/* Redirecionamento para raiz */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;

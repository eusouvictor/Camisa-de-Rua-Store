import React, { useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import ModalAuth from "./components/ModalAuth";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Events from "./pages/Events";
import Settings from "./pages/Settings";
import LandingPage from "./pages/Landing";
import Checkout from "./components/Checkout";
import AdminHome from "./pages/AdminHome";
import AdminPanel from "./components/AdminPanel";
import { addItemToCart } from "./utils/cart";

function App() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  // Adicione isso dentro do componente App, logo no começo (antes do return)
  React.useEffect(() => {
    // Tenta recuperar o usuário do localStorage ao abrir o site
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setIsAuthOpen(false);
    // Redirecionamento inteligente baseado no cargo
    if (userData.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/home");
    }
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

  // --- Lógica do Carrinho ---
  const addToCart = (product) => {
    setCart((prevCart) => {
      return addItemToCart(prevCart, product);
    });
  };

  const updateCart = (newCart) => {
    setCart(newCart);
  };

  const removeFromCart = (productId, type) => {
    setCart((prevCart) =>
      prevCart.filter((item) => !(item.id === productId && item.type === type))
    );
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

        {/* Rotas protegidas (Cliente) */}
        <Route
          path="/home"
          element={
            user ? <Home addToCart={addToCart} cart={cart} /> : <Navigate to="/" replace />
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
          path="/checkout"
          element={
            user ? <Checkout updateCart={updateCart} /> : <Navigate to="/" replace />
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

        {/* Rotas de Admin (Protegidas por Role) */}
        <Route
          path="/admin"
          element={
            user && user.role === "admin" ? (
              <AdminPanel user={user} setUser={setUser} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

         <Route
          path="/admin/home"
          element={
            user && user.role === "admin" ? (
              <AdminHome user={user} setUser={setUser} />
            ) : (
               <Navigate to="/" replace />
            )
          }
        />

        {/* Redirecionamento para raiz se a rota não existir */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;

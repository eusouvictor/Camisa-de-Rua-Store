import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  House,
  ShoppingCart,
  Ticket,
  Bolt,
  Trash2,
  Plus,
  Minus,
  Menu,
  X,
  CreditCard,
  Truck,
  ShieldCheck
} from "lucide-react";

const Cart = ({ cart, updateCart, removeFromCart }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [menuMobileAberto, setMenuMobileAberto] = useState(false);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (!userData) {
      navigate("/");
      return;
    }
    setUser(userData);
    setCartItems(cart);
  }, [navigate, cart]);

  const formatarPreco = (preco) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(preco);
  };

  // Contador de itens no carrinho
  const totalItemsNoCarrinho = cart.reduce((total, item) => {
    return total + (item.quantity || 1);
  }, 0);

  const handleQuantityChange = (id, type, newQuantity) => {
    if (newQuantity < 1) return;

    const updatedCart = cartItems.map((item) =>
      item.id === id && item.type === type
        ? { ...item, quantity: newQuantity }
        : item
    );
    setCartItems(updatedCart);
    updateCart(updatedCart);
  };

  const handleRemoveItem = (id, type) => {
    const updatedCart = cartItems.filter(
      (item) => !(item.id === id && item.type === type)
    );
    setCartItems(updatedCart);
    removeFromCart(id, type);
  };

  const calcularTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + item.price * (item.quantity || 1);
    }, 0);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert("Seu carrinho está vazio!");
      return;
    }
    // Redireciona para a página de checkout com os dados
    navigate("/checkout", { state: { cartItems, total: calcularTotal() } });
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    navigate("/");
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black font-advent">
      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 bg-gray-900/95 backdrop-blur-lg border-b border-verde-neon/20 text-white py-4 px-4 w-full z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between w-full">
          <div className="flex items-center">
            <img
              src="/images/cdrlogo.svg"
              alt="Camisa de Rua Logo"
              className="h-12 w-auto object-contain transition-transform duration-300 hover:scale-105"
            />
          </div>

          <div className="hidden lg:flex items-center">
            <nav className="flex items-center space-x-8">
              <span className="text-verde-neon font-semibold text-lg">Olá, {user.nome}</span>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-4">
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-verde-neon to-verde-rua hover:from-verde-rua hover:to-verde-neon text-gray-900 font-bold py-2 px-6 rounded-full transition-all duration-500 transform hover:scale-105 hover:shadow-lg hover:shadow-verde-neon/25"
              >
                SAIR
              </button>
            </div>

            <div className="sm:hidden">
              <button
                onClick={() => setMenuMobileAberto(!menuMobileAberto)}
                className="p-2 bg-verde-neon/20 rounded-lg hover:bg-verde-neon/30 transition-all duration-300"
              >
                {menuMobileAberto ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {menuMobileAberto && (
          <div className="sm:hidden bg-gray-800/95 backdrop-blur-lg border-t border-verde-neon/20 mt-4 py-4 rounded-b-2xl">
            <div className="flex flex-col space-y-4 px-4">
              <span className="text-verde-neon text-center font-semibold">Olá, {user.nome}</span>
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-verde-neon to-verde-rua text-gray-900 font-bold py-3 rounded-full transition-all duration-300"
              >
                SAIR
              </button>
            </div>
          </div>
        )}
      </header>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex flex-col sm:flex-row pt-20">
        {/* MENU LATERAL - DESKTOP */}
        <aside className="hidden sm:flex ml-4 w-16 bg-gray-800/50 backdrop-blur-lg flex-col items-center py-6 fixed top-32 h-80 bottom-8 rounded-2xl z-40 border border-verde-neon/20">
          <Link 
            to="/home" 
            className="p-3 bg-gray-700/50 hover:bg-verde-neon rounded-xl mb-8 transition-all duration-300 hover:scale-110 group border border-gray-600"
          >
            <House className="text-gray-300 group-hover:text-gray-900 w-6 h-6" />
          </Link>
          <Link 
            to="/events" 
            className="p-3 bg-gray-700/50 hover:bg-verde-neon rounded-xl mb-8 transition-all duration-300 hover:scale-110 group border border-gray-600"
          >
            <Ticket className="text-gray-300 group-hover:text-gray-900 w-6 h-6" />
          </Link>
          <Link 
            to="/cart" 
            className="p-3 bg-gradient-to-br from-verde-neon to-verde-rua rounded-xl mb-8 transition-all duration-300 hover:scale-110 hover:shadow-lg relative"
          >
            <ShoppingCart className="text-gray-900 w-6 h-6" />
            {totalItemsNoCarrinho > 0 && (
              <span className="absolute -top-2 -right-2 bg-verde-rua text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold shadow-lg">
                {totalItemsNoCarrinho}
              </span>
            )}
          </Link>
          <Link 
            to="/settings" 
            className="p-3 bg-gray-700/50 hover:bg-verde-neon rounded-xl mt-auto transition-all duration-300 hover:scale-110 group border border-gray-600"
          >
            <Bolt className="text-gray-300 group-hover:text-gray-900 w-6 h-6" />
          </Link>
        </aside>

        {/* MENU INFERIOR - MOBILE */}
        <nav className="sm:hidden fixed bottom-4 left-4 right-4 bg-gray-800/90 backdrop-blur-lg border border-verde-neon/20 rounded-2xl z-40 shadow-2xl">
          <div className="flex justify-around items-center py-3">
            <Link 
              to="/home" 
              className="p-3 bg-gray-700/50 hover:bg-verde-neon rounded-xl transition-all duration-300 hover:scale-110 group border border-gray-600"
            >
              <House className="text-gray-300 group-hover:text-gray-900 w-5 h-5" />
            </Link>
            <Link 
              to="/events" 
              className="p-3 bg-gray-700/50 hover:bg-verde-neon rounded-xl transition-all duration-300 hover:scale-110 group border border-gray-600"
            >
              <Ticket className="text-gray-300 group-hover:text-gray-900 w-5 h-5" />
            </Link>
            <Link 
              to="/cart" 
              className="p-3 bg-gradient-to-br from-verde-neon to-verde-rua rounded-xl transition-all duration-300 hover:scale-110 relative"
            >
              <ShoppingCart className="text-gray-900 w-5 h-5" />
              {totalItemsNoCarrinho > 0 && (
                <span className="absolute -top-2 -right-2 bg-verde-rua text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-lg">
                  {totalItemsNoCarrinho}
                </span>
              )}
            </Link>
            <Link 
              to="/settings" 
              className="p-3 bg-gray-700/50 hover:bg-verde-neon rounded-xl transition-all duration-300 hover:scale-110 group border border-gray-600"
            >
              <Bolt className="text-gray-300 group-hover:text-gray-900 w-5 h-5" />
            </Link>
          </div>
        </nav>

        {/* CONTEÚDO PRINCIPAL */}
        <main className="flex-1 sm:ml-20 pb-20 sm:pb-0 p-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center space-x-3 mb-6">
              <ShoppingCart className="text-verde-neon w-8 h-8" />
              <h1 className="text-3xl font-black text-white">Meu Carrinho</h1>
            </div>

            {cartItems.length === 0 ? (
              <div className="text-center py-16">
                <div className="bg-gray-800/50 backdrop-blur-lg rounded-3xl p-12 max-w-md mx-auto border border-verde-neon/20">
                  <div className="w-20 h-20 bg-gradient-to-br from-verde-neon to-verde-rua rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <ShoppingCart className="text-gray-900 w-10 h-10" />
                  </div>
                  <p className="text-2xl font-bold text-verde-neon mb-4">Seu carrinho está vazio</p>
                  <p className="text-gray-300 mb-8">Adicione alguns produtos ou eventos para continuar</p>
                  <Link
                    to="/home"
                    className="bg-gradient-to-r from-verde-neon to-verde-rua hover:from-verde-rua hover:to-verde-neon text-gray-900 font-bold py-4 px-8 rounded-2xl transition-all duration-500 transform hover:scale-105 hover:shadow-lg hover:shadow-verde-neon/25 inline-block"
                  >
                    Continuar Comprando
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* LISTA DE ITENS */}
                <div className="lg:col-span-2 space-y-4">
                  {cartItems.map((item) => (
                    <div
                      key={`${item.type}-${item.id}`}
                      className="group bg-gray-800/50 backdrop-blur-lg border border-verde-neon/20 rounded-3xl p-6 hover:scale-105 hover:shadow-2xl hover:shadow-verde-neon/20 hover:border-verde-neon/40 transition-all duration-500"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-verde-rua to-verde-escuro rounded-2xl flex items-center justify-center">
                            <span className="text-white text-lg font-bold">
                              {item.type === "evento" ? "🎫" : "👕"}
                            </span>
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-white text-lg mb-2">{item.name}</h3>
                            {item.type === "evento" ? (
                              <div className="space-y-1">
                                <p className="text-gray-300 text-sm flex items-center space-x-2">
                                  <span>📅</span>
                                  <span>{item.data}</span>
                                </p>
                                <p className="text-gray-300 text-sm flex items-center space-x-2">
                                  <span>📍</span>
                                  <span className="line-clamp-1">{item.local}</span>
                                </p>
                                <p className="text-verde-neon font-semibold text-sm">INGRESSO</p>
                              </div>
                            ) : (
                              <p className="text-gray-300 text-sm capitalize">
                                {item.category}
                              </p>
                            )}
                            <p className="text-xl font-black text-verde-neon mt-2">
                              {formatarPreco(item.price)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4">
                          {/* CONTROLE DE QUANTIDADE */}
                          <div className="flex items-center border border-verde-neon/30 rounded-2xl bg-gray-700/50">
                            <button
                              onClick={() =>
                                handleQuantityChange(
                                  item.id,
                                  item.type,
                                  (item.quantity || 1) - 1
                                )
                              }
                              className="p-2 hover:bg-verde-neon/20 transition-all duration-300 text-verde-neon"
                            >
                              <Minus size={18} />
                            </button>
                            <span className="px-4 py-2 text-white font-bold min-w-12 text-center">
                              {item.quantity || 1}
                            </span>
                            <button
                              onClick={() =>
                                handleQuantityChange(
                                  item.id,
                                  item.type,
                                  (item.quantity || 1) + 1
                                )
                              }
                              className="p-2 hover:bg-verde-neon/20 transition-all duration-300 text-verde-neon"
                            >
                              <Plus size={18} />
                            </button>
                          </div>

                          {/* SUBTOTAL */}
                          <div className="text-right min-w-28">
                            <p className="font-black text-verde-neon text-lg">
                              {formatarPreco(item.price * (item.quantity || 1))}
                            </p>
                          </div>

                          {/* BOTÃO REMOVER */}
                          <button
                            onClick={() => handleRemoveItem(item.id, item.type)}
                            className="p-3 text-red-400 hover:bg-red-500/20 rounded-2xl transition-all duration-300 hover:scale-110 border border-red-400/30"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* RESUMO DO PEDIDO */}
                <div className="lg:col-span-1">
                  <div className="bg-gray-800/50 backdrop-blur-lg border border-verde-neon/20 rounded-3xl p-6 sticky top-24">
                    <h2 className="text-2xl font-black text-white mb-6 flex items-center space-x-2">
                      <CreditCard className="text-verde-neon w-6 h-6" />
                      <span>Resumo do Pedido</span>
                    </h2>

                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between items-center py-3 border-b border-gray-700/50">
                        <span className="text-gray-300">Subtotal</span>
                        <span className="text-white font-bold">{formatarPreco(calcularTotal())}</span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-gray-700/50">
                        <span className="text-gray-300 flex items-center space-x-2">
                          <Truck className="w-4 h-4" />
                          <span>Frete</span>
                        </span>
                        <span className="text-verde-neon font-bold">Grátis</span>
                      </div>
                      <div className="flex justify-between items-center py-4 border-t border-verde-neon/30">
                        <span className="text-xl font-black text-white">Total</span>
                        <span className="text-2xl font-black text-verde-neon">{formatarPreco(calcularTotal())}</span>
                      </div>
                    </div>

                    <button
                      onClick={handleCheckout}
                      className="w-full bg-gradient-to-r from-verde-neon to-verde-rua hover:from-verde-rua hover:to-verde-neon text-gray-900 font-bold py-4 rounded-2xl transition-all duration-500 transform hover:scale-105 hover:shadow-lg hover:shadow-verde-neon/25 mb-4"
                    >
                      Finalizar Compra
                    </button>

                    <div className="flex items-center justify-center space-x-2 text-gray-400 mb-4">
                      <ShieldCheck className="w-4 h-4" />
                      <span className="text-sm">Compra 100% segura</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <Link
                        to="/home"
                        className="border-2 border-verde-neon/50 text-verde-neon py-3 rounded-xl hover:bg-verde-neon hover:text-gray-900 transition-all duration-300 font-bold text-center block hover:scale-105"
                      >
                        Produtos
                      </Link>
                      <Link
                        to="/events"
                        className="border-2 border-verde-neon/50 text-verde-neon py-3 rounded-xl hover:bg-verde-neon hover:text-gray-900 transition-all duration-300 font-bold text-center block hover:scale-105"
                      >
                        Eventos
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Cart;
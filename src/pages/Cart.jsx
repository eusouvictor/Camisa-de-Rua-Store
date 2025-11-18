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
} from "lucide-react";

const Cart = ({ cart, updateCart, removeFromCart }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);

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
    alert("Compra finalizada com sucesso!");
    setCartItems([]);
    updateCart([]);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white font-advent">
      {/* HEADER */}
      <header className="bg-verde-rua text-white py-4 px-4 z-30">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <img
              src="/images/Vector.png"
              alt="Camisa de Rua Logo"
              className="h-12 w-19 object-cover ml-40"
            />
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-4">
              <span className="text-verde-neon">Olá, {user.nome}</span>
              <button
                onClick={handleLogout}
                className="border-2 border-verde-neon text-verde-neon font-bold py-2 px-6 rounded-full hover:bg-verde-neon hover:text-verde-rua transition-colors"
              >
                SAIR
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="min-h-screen bg-white flex">
        {/* MENU LATERAL */}
        <aside className="ml-2 w-12 bg-azul-gelo flex flex-col items-center py-3 fixed top-32 h-80 bottom-8 rounded-xl z-40 mt-4">
          <Link to="/home" className="p-3">
            <div className="w-6 h-6 bg-azul-gelo rounded">
              <House />
            </div>
          </Link>
          <Link to="/events" className="p-3">
            <div className="w-6 h-6 bg-azul-gelo rounded">
              <Ticket />
            </div>
          </Link>
          <Link to="/cart" className="p-3 bg-verde-neon rounded relative">
            <div className="w-6 h-6 rounded">
              <ShoppingCart className="text-verde-rua" />
            </div>
            {totalItemsNoCarrinho > 0 && (
              <span className="absolute -top-1 -right-1 bg-white text-verde-rua text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                {totalItemsNoCarrinho}
              </span>
            )}
          </Link>
          <Link to="/settings" className="p-3 mt-32">
            <div className="w-6 h-6 bg-azul-gelo rounded">
              <Bolt />
            </div>
          </Link>
        </aside>

        {/* CONTEÚDO PRINCIPAL */}
        <main className="flex-1 ml-16 p-6">
          <h1 className="text-3xl font-bold mb-6">Meu Carrinho</h1>

          {cartItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600 mb-4">
                Seu carrinho está vazio
              </p>
              <Link
                to="/home"
                className="bg-verde-rua text-white py-3 px-6 rounded-lg hover:bg-verde-escuro transition-colors font-semibold"
              >
                Continuar Comprando
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* LISTA DE ITENS */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg border border-gray-200">
                  {cartItems.map((item) => (
                    <div
                      key={`${item.type}-${item.id}`}
                      className="border-b border-gray-200 last:border-b-0 p-6"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 bg-verde-rua rounded-lg flex items-center justify-center">
                            <span className="text-white text-xs">
                              {item.type === "evento" ? "🎫" : "👕"}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-semibold">{item.name}</h3>
                            <p className="text-gray-600 text-sm">
                              {item.type === "evento" ? (
                                <div>
                                  <p>📅 {item.data}</p>
                                  <p>📍 {item.local}</p>
                                  <p className="text-verde-rua font-semibold">
                                    INGRESSO
                                  </p>
                                </div>
                              ) : (
                                <span className="capitalize">
                                  {item.category}
                                </span>
                              )}
                            </p>
                            <p className="text-lg font-bold text-verde-rua">
                              {formatarPreco(item.price)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4">
                          {/* CONTROLE DE QUANTIDADE */}
                          <div className="flex items-center border border-gray-300 rounded-lg">
                            <button
                              onClick={() =>
                                handleQuantityChange(
                                  item.id,
                                  item.type,
                                  (item.quantity || 1) - 1
                                )
                              }
                              className="p-2 hover:bg-gray-100 transition-colors"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="px-4 py-2">
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
                              className="p-2 hover:bg-gray-100 transition-colors"
                            >
                              <Plus size={16} />
                            </button>
                          </div>

                          {/* SUBTOTAL */}
                          <div className="text-right min-w-24">
                            <p className="font-semibold">
                              {formatarPreco(item.price * (item.quantity || 1))}
                            </p>
                          </div>

                          {/* BOTÃO REMOVER */}
                          <button
                            onClick={() => handleRemoveItem(item.id, item.type)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* RESUMO DO PEDIDO */}
              <div className="lg:col-span-1">
                <div className="bg-gray-50 rounded-lg border border-gray-200 p-6 sticky top-24">
                  <h2 className="text-xl font-bold mb-4">Resumo do Pedido</h2>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>{formatarPreco(calcularTotal())}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Frete</span>
                      <span className="text-verde-rua">Grátis</span>
                    </div>
                    <div className="border-t border-gray-300 pt-3 flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>{formatarPreco(calcularTotal())}</span>
                    </div>
                  </div>

                  <button
                    onClick={handleCheckout}
                    className="w-full bg-verde-rua text-white py-3 rounded-lg hover:bg-verde-escuro transition-colors font-semibold mb-4"
                  >
                    Finalizar Compra
                  </button>

                  <div className="flex space-x-2">
                    <Link
                      to="/home"
                      className="flex-1 border border-verde-rua text-verde-rua py-3 rounded-lg hover:bg-verde-rua hover:text-white transition-colors font-semibold text-center block"
                    >
                      Produtos
                    </Link>
                    <Link
                      to="/events"
                      className="flex-1 border border-verde-rua text-verde-rua py-3 rounded-lg hover:bg-verde-rua hover:text-white transition-colors font-semibold text-center block"
                    >
                      Eventos
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Cart;

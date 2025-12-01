import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { House, ShoppingCart, Ticket, Bolt, Trash2, Plus, Minus, Menu, X, CreditCard, Truck, ShieldCheck } from "lucide-react";

const Cart = ({ cart, updateCart, removeFromCart }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [menuMobileAberto, setMenuMobileAberto] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) { navigate("/"); return; }
    setUser(JSON.parse(storedUser));
  }, [navigate]);

  const handleQuantityChange = (id, type, newQuantity) => {
    if (newQuantity < 1) return;
    const updatedCart = cart.map((item) =>
      item.id === id && item.type === type ? { ...item, quantity: newQuantity } : item
    );
    updateCart(updatedCart);
  };

  const handleRemoveItem = (id, type) => {
    removeFromCart(id, type);
  };

  // CÁLCULO SEGURO DO TOTAL
  const calcularTotal = () => {
    return cart.reduce((total, item) => {
      const preco = Number(item.price || item.preco || 0); // Garante que é numero
      return total + preco * (item.quantity || 1);
    }, 0);
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    navigate("/checkout", { state: { cartItems: cart, total: calcularTotal() } });
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    navigate("/");
  };

  const formatarPreco = (p) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(p || 0);
  const totalItems = cart.reduce((t, i) => t + (i.quantity || 1), 0);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black font-advent pb-24 sm:pb-0">
      <header className="fixed top-0 left-0 right-0 bg-gray-900/95 backdrop-blur-lg border-b border-verde-neon/20 text-white py-4 px-6 w-full z-50 flex justify-between items-center">
        <div className="flex items-center gap-4">
            <div className="sm:hidden"><button onClick={() => setMenuMobileAberto(!menuMobileAberto)}><Menu className="text-white" /></button></div>
            <img src="/images/cdrlogo.svg" alt="Logo" className="h-10 w-auto" />
        </div>
        <div className="flex items-center gap-4">
            <span className="hidden sm:inline text-verde-neon font-bold">Olá, {user.nome}</span>
            <button onClick={handleLogout} className="text-red-400 font-bold text-sm">SAIR</button>
        </div>
      </header>

      {menuMobileAberto && (
        <div className="fixed inset-0 z-40 bg-gray-900/95 pt-20 px-6 sm:hidden">
            <button onClick={() => setMenuMobileAberto(false)} className="absolute top-4 right-4 text-white"><X /></button>
            <nav className="flex flex-col gap-6 text-white text-xl font-bold text-center">
                <Link to="/home">Home</Link>
                <Link to="/events">Eventos</Link>
                <Link to="/cart" className="text-verde-neon">Carrinho</Link>
            </nav>
        </div>
      )}

      <div className="pt-20 flex">
        <aside className="hidden sm:flex w-20 fixed left-4 top-24 bottom-4 bg-gray-800/50 border border-verde-neon/20 rounded-2xl flex-col items-center py-8 gap-8 z-40">
          <Link to="/home" className="p-3 text-gray-400 hover:text-verde-neon rounded-xl"><House /></Link>
          <Link to="/events" className="p-3 text-gray-400 hover:text-verde-neon rounded-xl"><Ticket /></Link>
          <Link to="/cart" className="p-3 bg-verde-neon text-gray-900 rounded-xl shadow-lg relative">
            <ShoppingCart />
            {totalItems > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full">{totalItems}</span>}
          </Link>
          <Link to="/settings" className="p-3 text-gray-400 hover:text-verde-neon rounded-xl mt-auto"><Bolt /></Link>
        </aside>

        <main className="flex-1 sm:ml-28 p-4 sm:p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-black text-white mb-8 flex items-center gap-3"><ShoppingCart className="text-verde-neon"/> Meu Carrinho</h1>
            
            {cart.length === 0 ? (
               <div className="text-center py-20 bg-gray-800/50 rounded-3xl border border-verde-neon/20">
                  <ShoppingCart size={64} className="mx-auto text-gray-600 mb-4"/>
                  <p className="text-xl text-white font-bold mb-4">Seu carrinho está vazio</p>
                  <Link to="/home" className="bg-verde-neon text-gray-900 px-6 py-3 rounded-xl font-bold">Ir as Compras</Link>
               </div>
            ) : (
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-4">
                     {cart.map((item) => (
                        <div key={`${item.type}-${item.id}`} className="bg-gray-800/50 p-4 rounded-2xl border border-verde-neon/20 flex gap-4 items-center">
                           <img src={item.imageUrl || "https://placehold.co/100"} alt={item.name} className="w-20 h-20 rounded-xl object-cover bg-gray-700"/>
                           <div className="flex-1">
                              <h3 className="text-white font-bold text-lg">{item.name || item.nome}</h3>
                              <p className="text-gray-400 text-sm capitalize">{item.category || item.categoria || "Produto"}</p>
                              <p className="text-verde-neon font-black text-xl mt-1">{formatarPreco(item.price || item.preco)}</p>
                           </div>
                           <div className="flex flex-col items-end gap-2">
                              <button onClick={() => handleRemoveItem(item.id, item.type)} className="text-red-400 p-2 hover:bg-red-500/10 rounded-lg"><Trash2 size={20}/></button>
                              <div className="flex items-center bg-gray-700 rounded-lg">
                                 <button onClick={() => handleQuantityChange(item.id, item.type, (item.quantity||1)-1)} className="p-2 text-verde-neon"><Minus size={16}/></button>
                                 <span className="text-white font-bold w-6 text-center">{item.quantity||1}</span>
                                 <button onClick={() => handleQuantityChange(item.id, item.type, (item.quantity||1)+1)} className="p-2 text-verde-neon"><Plus size={16}/></button>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
                  
                  <div className="bg-gray-800/50 p-6 rounded-3xl border border-verde-neon/20 h-fit sticky top-24">
                     <h2 className="text-xl font-black text-white mb-6 flex items-center gap-2"><CreditCard className="text-verde-neon"/> Resumo</h2>
                     <div className="space-y-3 mb-6">
                        <div className="flex justify-between text-gray-300"><span>Subtotal</span> <span>{formatarPreco(calcularTotal())}</span></div>
                        <div className="flex justify-between text-gray-300"><span>Frete</span> <span className="text-verde-neon">A calcular</span></div>
                        <div className="flex justify-between text-white text-xl font-black pt-4 border-t border-gray-700"><span>Total</span> <span>{formatarPreco(calcularTotal())}</span></div>
                     </div>
                     <button onClick={handleCheckout} className="w-full bg-gradient-to-r from-verde-neon to-verde-rua text-gray-900 font-bold py-4 rounded-xl hover:shadow-lg hover:scale-105 transition-all mb-4">Finalizar Compra</button>
                     <div className="flex justify-center gap-2 text-gray-500 text-xs"><ShieldCheck size={14}/> Compra 100% Segura</div>
                  </div>
               </div>
            )}
          </div>
        </main>
      </div>
      
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-verde-neon/20 p-4 flex justify-around z-50">
        <Link to="/home" className="text-gray-400"><House /></Link>
        <Link to="/events" className="text-gray-400"><Ticket /></Link>
        <Link to="/cart" className="text-verde-neon"><ShoppingCart /></Link>
        <Link to="/settings" className="text-gray-400"><Bolt /></Link>
      </nav>
    </div>
  );
};

export default Cart;
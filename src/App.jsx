import { useState, useMemo } from 'react';
import './App.css';
import productsData from './data/products.json';
import { 
  ShoppingCart, Search, Wrench, X, Plus, Minus, Trash2, Send,
  Settings, Disc, Circle, CircleDashed, Nut, Droplet, 
  Tag, Info, Hexagon, Component, Layers
} from 'lucide-react';

// Helper component for category icons
const CategoryIcon = ({ category, size = 48, className = "" }) => {
  const c = category?.toLowerCase() || '';
  let IconComp = Component;

  if (c.includes('máquina') || c.includes('maquina')) IconComp = Settings;
  else if (c.includes('calota')) IconComp = CircleDashed;
  else if (c.includes('anel')) IconComp = Circle;
  else if (c.includes('borracharia')) IconComp = Droplet;
  else if (c.includes('contrapeso')) IconComp = Layers;
  else if (c.includes('parafuso')) IconComp = Nut;
  else if (c.includes('porca')) IconComp = Hexagon;
  else if (c.includes('valvula') || c.includes('válvula')) IconComp = Disc;
  else if (c.includes('emblema')) IconComp = Tag;

  return <IconComp size={size} className={className} />;
};

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Extract unique categories
  const categories = ['Todos', ...new Set(productsData.map(p => p.category))];

  // Filter products
  const filteredProducts = useMemo(() => {
    return productsData.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = activeCategory === 'Todos' || product.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, activeCategory]);

  // Cart functions
  const addToCart = (product, e) => {
    if (e) e.stopPropagation();
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const cartItemsCount = cart.reduce((count, item) => count + item.quantity, 0);

  // Format currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
  };

  // Send to WhatsApp
  const sendToWhatsApp = () => {
    if (cart.length === 0) return;
    
    let message = `*Olá! Gostaria de fazer o pedido dos seguintes itens da VR Car:*%0A%0A`;
    
    cart.forEach((item, index) => {
      message += `${index + 1}. ${item.name} (Qtd: ${item.quantity}) - ${formatPrice(item.price * item.quantity)}%0A`;
    });
    
    message += `%0A*Valor Total Aproximado: ${formatPrice(cartTotal)}*%0A%0AAguardo retorno para finalizar o pedido, obrigado!`;
    
    // VR Car's WhatsApp number
    const phoneNumber = "5575992537557"; 
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header glass-panel">
        <div className="logo-container">
          <div className="logo-icon neon-text">
            <Wrench size={32} />
          </div>
          <h1 className="logo-text">VR<span>Car</span></h1>
        </div>
        
        <button className="cart-button neon-border" onClick={() => setIsCartOpen(true)}>
          <ShoppingCart size={20} />
          <span className="cart-text-btn">Carrinho</span>
          {cartItemsCount > 0 && <span className="cart-badge">{cartItemsCount}</span>}
        </button>
      </header>

      {/* Main Content */}
      <main className="main-content">
        
        {/* Controls */}
        <section className="controls-bar glass-panel">
          <div className="search-wrapper">
            <Search className="search-icon" size={20} />
            <input 
              type="text" 
              className="search-input" 
              placeholder="Buscar produtos, ferramentas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="category-filters">
            {categories.map(cat => (
              <button 
                key={cat}
                className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* Product Grid */}
        <section className="product-grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <div 
                key={product.id} 
                className="product-card glass-panel"
                onClick={() => setSelectedProduct(product)}
              >
                <div className="product-category-badge">{product.category}</div>
                
                <div className="product-icon-container">
                   <CategoryIcon category={product.category} size={64} className="neon-icon-glow" />
                </div>
                
                <div className="product-content">
                  <h3 className="product-title">{product.name}</h3>
                  <p className="product-desc line-clamp">{product.description}</p>
                  
                  <div className="product-footer">
                    <div className="product-price">
                      <span>R$</span>{product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                    <button 
                      className="add-to-cart-btn" 
                      onClick={(e) => addToCart(product, e)}
                      title="Adicionar ao Carrinho"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <Search size={48} className="neon-icon-glow mb-4" />
              <h3>Nenhum produto encontrado.</h3>
              <p>Tente ajustar sua busca ou selecionar outra categoria.</p>
            </div>
          )}
        </section>
      </main>

      {/* Product Details Modal */}
      {selectedProduct && (
        <div className="modal-overlay open" onClick={() => setSelectedProduct(null)}>
          <div className="modal-content glass-panel" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedProduct(null)}>
              <X size={24} />
            </button>
            
            <div className="modal-header-icon">
               <CategoryIcon category={selectedProduct.category} size={80} className="neon-icon-glow" />
            </div>
            
            <div className="modal-body">
              <div className="modal-badge">{selectedProduct.category}</div>
              <h2 className="modal-title">{selectedProduct.name}</h2>
              <div className="modal-price">{formatPrice(selectedProduct.price)}</div>
              
              <div className="modal-desc-box">
                <p>{selectedProduct.description}</p>
              </div>

              {selectedProduct.specs && selectedProduct.specs.length > 0 && (
                <div className="modal-specs">
                  <h4><Info size={16} /> Especificações</h4>
                  <ul>
                    {selectedProduct.specs.map((spec, i) => (
                      <li key={i}>{spec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            <div className="modal-footer">
               <button 
                 className="btn-primary"
                 onClick={() => {
                   addToCart(selectedProduct);
                   setSelectedProduct(null);
                   setIsCartOpen(true);
                 }}
               >
                 <ShoppingCart size={20} /> Adicionar ao Carrinho
               </button>
            </div>
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      <div className={`cart-overlay ${isCartOpen ? 'open' : ''}`} onClick={() => setIsCartOpen(false)}>
        <div className="cart-modal glass-panel" onClick={e => e.stopPropagation()}>
          
          <div className="cart-header">
            <h2><ShoppingCart /> Seu Carrinho</h2>
            <button className="close-btn" onClick={() => setIsCartOpen(false)}>
              <X size={24} />
            </button>
          </div>
          
          <div className="cart-body">
            {cart.length === 0 ? (
              <div className="empty-cart">
                <ShoppingCart size={48} style={{ opacity: 0.2, margin: '0 auto 1rem' }} />
                <p>Nenhum item adicionado ao carrinho.</p>
              </div>
            ) : (
              cart.map(item => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-icon">
                    <CategoryIcon category={item.category} size={32} />
                  </div>
                  <div className="cart-item-details">
                    <div className="cart-item-title">{item.name}</div>
                    <div className="cart-item-price">{formatPrice(item.price)}</div>
                    
                    <div className="cart-item-actions">
                      <button className="qty-btn" onClick={() => updateQuantity(item.id, -1)}>
                        <Minus size={14} />
                      </button>
                      <span>{item.quantity}</span>
                      <button className="qty-btn" onClick={() => updateQuantity(item.id, 1)}>
                        <Plus size={14} />
                      </button>
                      
                      <button className="remove-btn" onClick={() => removeFromCart(item.id)} title="Remover">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {cart.length > 0 && (
            <div className="cart-footer">
              <div className="cart-total">
                <span>Total Aproximado:</span>
                <span className="neon-text">{formatPrice(cartTotal)}</span>
              </div>
              
              <button className="whatsapp-btn" onClick={sendToWhatsApp}>
                <Send size={20} />
                Solicitar via WhatsApp
              </button>
            </div>
          )}
          
        </div>
      </div>
      
    </div>
  );
}

export default App;

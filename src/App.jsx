import { useState, useMemo, useEffect } from 'react';
import './App.css';
import productsData from './data/products.json';
import { 
  ShoppingCart, Search, Wrench, X, Plus, Minus, Trash2, Send,
  Settings, Disc, Circle, CircleDashed, Nut, Droplet, 
  Tag, Info, Hexagon, Component, Layers, ChevronDown, ChevronUp,
  MessageCircle, HelpCircle, ArrowRight, Truck, ClipboardList, CheckCircle2,
  Mail, Phone, MapPin
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
  const [toast, setToast] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);

  const toastMessages = [
    "Ótima escolha! Que tal adicionar mais produtos para ter descontos?",
    "Excelente item! Adicione mais produtos e garanta uma oferta especial.",
    "Muito bem! Peça mais itens para termos mais flexibilidade no orçamento.",
    "Produto adicionado! Fale conosco no WhatsApp para negociar preços especiais."
  ];

  const faqs = [
    {
      q: "TEM LOJA FÍSICA?",
      a: "Sim! Nossa loja física e centro de distribuição fica em Feira de Santana - BA, com atendimento presencial e retirada de mercadorias após a confirmação do pedido."
    },
    {
      q: "ENTREGAM PARA OUTROS ESTADOS?",
      a: "Sim, realizamos envios para todo o Brasil através de transportadoras parceiras e Correios. O frete é calculado de acordo com a cubagem e peso dos produtos."
    },
    {
      q: "TEM PRONTA ENTREGA?",
      a: "Sim, a grande maioria dos nossos produtos está disponível para pronta entrega imediata."
    },
    {
      q: "COMO FAÇO O PAGAMENTO?",
      a: "Aceitamos Pix, transferências bancárias, cartões de crédito e faturamento para empresas parceiras mediante análise de cadastro."
    },
    {
      q: "OS PRODUTOS TÊM GARANTIA?",
      a: "Sim, todos os nossos equipamentos e acessórios contam com garantia legal contra defeitos de fabricação."
    }
  ];

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToastNotification = () => {
    const randomIndex = Math.floor(Math.random() * toastMessages.length);
    const message = toastMessages[randomIndex];
    setToast({ id: Date.now(), message });
  };

  const relatedProducts = useMemo(() => {
    if (!selectedProduct) return [];
    return productsData
      .filter(p => p.category === selectedProduct.category && p.id !== selectedProduct.id)
      .slice(0, 3);
  }, [selectedProduct]);

  // Extract unique categories
  const categories = ['Todos', ...new Set(productsData.map(p => p.category))];

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    const filtered = productsData.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = activeCategory === 'Todos' || product.category === activeCategory;
      return matchesSearch && matchesCategory;
    });

    return [...filtered].sort((a, b) => {
      const catA = a.category || '';
      const catB = b.category || '';
      if (catA !== catB) {
        return catA.localeCompare(catB);
      }
      return a.name.localeCompare(b.name);
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
    showToastNotification();
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

  const cartItemsCount = cart.reduce((count, item) => count + item.quantity, 0);

  // Send to WhatsApp
  const sendToWhatsApp = () => {
    if (cart.length === 0) return;
    
    let message = `*Olá! Gostaria de fazer o orçamento/pedido dos seguintes itens da VR Car:*%0A%0A`;
    
    cart.forEach((item, index) => {
      message += `${index + 1}. ${item.name} (Qtd: ${item.quantity})%0A`;
    });
    
    message += `%0AAguardo retorno para obter o orçamento e finalizar o pedido, obrigado!`;
    
    const phoneNumber = "5575998517257"; 
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  const quickWhatsAppMessage = (text) => {
    const phoneNumber = "5575998517257";
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <div className="logo-container">
          <div className="logo-icon">
            <Wrench size={26} />
          </div>
          <h1 className="logo-text">VR <span>ACESSÓRIOS</span></h1>
        </div>

        <div className="nav-links-desktop">
          <a href="#inicio">Início</a>
          <a href="#como-funciona">Como Funciona</a>
          <a href="#catalogo">Catálogo</a>
        </div>
        
        <button className="cart-button desktop-cart-btn" onClick={() => setIsCartOpen(true)}>
          <ShoppingCart size={20} />
          <span className="cart-text-btn">Meu Pedido</span>
          {cartItemsCount > 0 && <span className="cart-badge">{cartItemsCount}</span>}
        </button>
      </header>

      {/* Hero Section */}
      <section className="hero-section" id="inicio">
        <div className="hero-content">
          <div className="hero-tag">EQUIPAMENTOS & ACESSÓRIOS</div>
          <h2 className="hero-title">
            LINHA PREMIUM <br />
            PARA O SEU <span>CARRO</span>
          </h2>
          <p className="hero-subtitle">
            O catálogo completo de acessórios para rodas esportivas e material para alinhamento e balanceamento profissional.
          </p>
          <div className="hero-buttons">
            <a href="#catalogo" className="btn-hero-primary">
              VER CATÁLOGO <ArrowRight size={18} />
            </a>
            <button 
              onClick={() => quickWhatsAppMessage("Olá! Vim do catálogo e gostaria de falar com um atendente.")} 
              className="btn-hero-secondary"
            >
              <MessageCircle size={18} /> PEDIR NO WHATSAPP
            </button>
          </div>
          
          <div className="hero-bullets">
            <div className="bullet-item">
              <span className="bullet-dot"></span> Pronta entrega rápida
            </div>
            <div className="bullet-item">
              <span className="bullet-dot"></span> Equipamentos com garantia
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="visual-circle"></div>
          <div className="visual-image-placeholder">
            <Wrench size={100} className="visual-icon" />
            <div className="visual-badge-premium">PREMIUM QUALITY</div>
          </div>
        </div>
      </section>

      {/* Como Funciona Section */}
      <section className="how-it-works" id="como-funciona">
        <div className="section-header">
          <h2 className="section-title">COMO <span>FUNCIONA</span></h2>
          <p className="section-subtitle">
            Processo simplificado para você equipar seu veículo ou oficina com rapidez e segurança.
          </p>
        </div>

        <div className="steps-grid">
          <div className="step-card">
            <div className="step-num">01</div>
            <div className="step-icon-container">
              <Search size={24} />
            </div>
            <h3 className="step-title">ESCOLHA OS ITENS</h3>
            <p className="step-desc">
              Navegue pelo nosso catálogo abaixo e adicione os itens desejados ao seu pedido.
            </p>
          </div>

          <div className="step-card">
            <div className="step-num">02</div>
            <div className="step-icon-container">
              <MessageCircle size={24} />
            </div>
            <h3 className="step-title">ENVIE NO WHATSAPP</h3>
            <p className="step-desc">
              Finalize enviando a lista diretamente para nosso atendimento no WhatsApp com um clique.
            </p>
          </div>

          <div className="step-card">
            <div className="step-num">03</div>
            <div className="step-icon-container">
              <ClipboardList size={24} />
            </div>
            <h3 className="step-title">RECEBA O ORÇAMENTO</h3>
            <p className="step-desc">
              Nossa equipe comercial te responderá com os melhores valores e opções de frete.
            </p>
          </div>

          <div className="step-card">
            <div className="step-num">04</div>
            <div className="step-icon-container">
              <Truck size={24} />
            </div>
            <h3 className="step-title">ENVIO OU RETIRADA</h3>
            <p className="step-desc">
              Seu pedido é separado e despachado ou fica pronto para retirada imediata.
            </p>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="cta-banner">
          <div className="cta-banner-text">
            <h4>PRONTO PARA COMEÇAR?</h4>
            <p>Temos tudo o que você precisa para rodas e borracharia em um só lugar.</p>
          </div>
          <a href="#catalogo" className="btn-cta">
            VER NOSSO CATÁLOGO COMPLETO
          </a>
        </div>
      </section>

      {/* Catalog Section */}
      <section className="catalog-section" id="catalogo">
        <div className="section-header">
          <h2 className="section-title">CATÁLOGO <span>COMPLETO</span></h2>
          <p className="section-subtitle">
            Encontre os melhores componentes. Use os filtros abaixo para facilitar sua busca.
          </p>
        </div>
        
        {/* Controls */}
        <div className="controls-bar">
          <div className="search-wrapper">
            <Search className="search-icon" size={20} />
            <input 
              type="text" 
              className="search-input" 
              placeholder="Buscar produtos, ferramentas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button className="clear-search-btn" onClick={() => setSearchTerm('')}>
                <X size={16} />
              </button>
            )}
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
        </div>

        {/* Product Grid */}
        <div className="product-grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <div 
                key={product.id} 
                className="product-card"
                onClick={() => setSelectedProduct(product)}
              >
                <div className="product-category-badge">{product.category}</div>
                
                <div className="product-icon-container">
                   <CategoryIcon category={product.category} size={56} className="product-category-icon" />
                </div>
                
                <div className="product-content">
                  <h3 className="product-title">{product.name}</h3>
                  <p className="product-desc line-clamp">{product.description}</p>
                  
                  <div className="product-footer">
                    <span className="product-price-placeholder">Sob Consulta</span>
                    <button 
                      className="add-to-cart-btn" 
                      onClick={(e) => addToCart(product, e)}
                      title="Adicionar ao Carrinho"
                    >
                      <Plus size={18} /> Adicionar
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <Search size={48} className="empty-state-icon" />
              <h3>NENHUM ITEM ENCONTRADO</h3>
              <p>Tente alterar seus filtros ou busque por outro termo.</p>
              <button 
                className="btn-clear-filters"
                onClick={() => {
                  setSearchTerm('');
                  setActiveCategory('Todos');
                }}
              >
                LIMPAR TODOS OS FILTROS
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-top">
          <div className="footer-brand-col">
            <div className="footer-logo">
              <Wrench size={24} />
              <span>VR ACESSÓRIOS</span>
            </div>
            <p className="footer-brand-desc">
              Especialistas em acessórios para rodas esportivas, anéis centralizadores, calotas, ferramentas e equipamentos para borracharia e alinhamento em geral.
            </p>
            <div className="social-links">
              <a href="#" className="social-icon">f</a>
              <a href="#" className="social-icon">i</a>
              <a href="#" className="social-icon">w</a>
            </div>
          </div>

          <div className="footer-links-col">
            <h4>NAVEGAÇÃO</h4>
            <ul>
              <li><a href="#inicio">Início</a></li>
              <li><a href="#como-funciona">Como Funciona</a></li>
              <li><a href="#catalogo">Catálogo</a></li>
            </ul>
          </div>

          <div className="footer-contact-col">
            <h4>CONTATO</h4>
            <ul>
              <li>
                <Phone size={16} /> (75) 99851-7257
              </li>
              <li>
                <MapPin size={16} /> Feira de Santana - BA
              </li>
              <li>
                <Mail size={16} /> contato@vracessorios.com.br
              </li>
            </ul>
          </div>

          <div className="footer-newsletter-col">
            <h4>NEWSLETTER</h4>
            <p>Receba novidades e promoções exclusivas direto no seu e-mail.</p>
            <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Seu melhor e-mail" required />
              <button type="submit">INSCREVER-SE</button>
            </form>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2026 VR Acessórios. Todos os direitos reservados. Feito com excelência.</p>
        </div>
      </footer>

      {/* Product Details Modal */}
      {selectedProduct && (
        <div className="modal-overlay open" onClick={() => setSelectedProduct(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedProduct(null)}>
              <X size={24} />
            </button>
            
            <div className="modal-header-icon">
               <CategoryIcon category={selectedProduct.category} size={72} className="modal-category-icon" />
            </div>
            
            <div className="modal-body">
              <div className="modal-badge">{selectedProduct.category}</div>
              <h2 className="modal-title">{selectedProduct.name}</h2>
              
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

              {/* Related Products */}
              {relatedProducts.length > 0 && (
                <div className="modal-related">
                  <h4>Quem viu este item também se interessou por:</h4>
                  <div className="related-grid">
                    {relatedProducts.map(p => (
                      <div 
                        key={p.id} 
                        className="related-item"
                        onClick={() => setSelectedProduct(p)}
                      >
                        <CategoryIcon category={p.category} size={24} className="related-icon" />
                        <div className="related-info">
                          <span className="related-name">{p.name}</span>
                        </div>
                      </div>
                    ))}
                  </div>
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
                 <ShoppingCart size={20} /> Adicionar ao Pedido
               </button>
            </div>
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      <div className={`cart-overlay ${isCartOpen ? 'open' : ''}`} onClick={() => setIsCartOpen(false)}>
        <div className="cart-modal" onClick={e => e.stopPropagation()}>
          
          <div className="cart-header">
            <h2><ShoppingCart /> Meu Pedido</h2>
            <button className="close-btn" onClick={() => setIsCartOpen(false)}>
              <X size={24} />
            </button>
          </div>
          
          <div className="cart-body">
            {cart.length === 0 ? (
              <div className="empty-cart">
                <ShoppingCart size={48} className="empty-cart-icon" />
                <p>Nenhum item adicionado ao pedido.</p>
              </div>
            ) : (
              cart.map(item => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-icon">
                    <CategoryIcon category={item.category} size={28} />
                  </div>
                  <div className="cart-item-details">
                    <div className="cart-item-title">{item.name}</div>
                    <div className="cart-item-category">{item.category}</div>
                    
                    <div className="cart-item-actions">
                      <button className="qty-btn" onClick={() => updateQuantity(item.id, -1)}>
                        <Minus size={12} />
                      </button>
                      <span className="qty-text">{item.quantity}</span>
                      <button className="qty-btn" onClick={() => updateQuantity(item.id, 1)}>
                        <Plus size={12} />
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
              <button className="whatsapp-btn" onClick={sendToWhatsApp}>
                <Send size={18} />
                Enviar Pedido no WhatsApp
              </button>
            </div>
          )}
          
        </div>
      </div>

      {/* Mobile Floating Cart Button */}
      {cartItemsCount > 0 && (
        <button className="cart-button-fab" onClick={() => setIsCartOpen(true)} aria-label="Carrinho">
          <ShoppingCart size={24} />
          <span className="cart-badge">{cartItemsCount}</span>
        </button>
      )}

      {/* Floating WhatsApp Action Button */}
      <button 
        className="whatsapp-floating-btn" 
        onClick={() => quickWhatsAppMessage("Olá! Gostaria de tirar algumas dúvidas sobre os produtos do catálogo.")}
        aria-label="Falar no WhatsApp"
      >
        <MessageCircle size={28} />
      </button>

      {/* Toast Notification */}
      {toast && (
        <div className="toast-notification" key={toast.id}>
          <div className="toast-content">
            <span className="toast-message">{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

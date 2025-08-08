import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import products from '../../assets/products.json';
import { CgMenuMotion } from "react-icons/cg";
import { VscRefresh } from "react-icons/vsc";
import { GrFormNext } from "react-icons/gr";
import { HiOutlineX } from "react-icons/hi";
import { FaQrcode, FaPercent, FaRegHeart } from "react-icons/fa6";

// Asosiy Home komponenti
function Home() {
  const [productsState, setProductsState] = useState(products);
  const [modalOpen, setModalOpen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [discountSearch, setDiscountSearch] = useState('');
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const modalRef = useRef(null);
  const navigate = useNavigate();

  // Faqat chegirmali mahsulotlar va 11000 so'mdan arzon mahsulotlarni filtr qilish
  const filteredDiscountedProducts = productsState.filter(product =>
    (product.discount_log?.some(d => d.status === "active") || (product.price && product.price < 11000)) &&
    product.product_name?.toLowerCase().includes(discountSearch.toLowerCase())
  );

  // Mahsulotlar holatini konsolga chiqarish
  useEffect(() => {
    console.log('Mahsulotlar:', productsState);
  }, [productsState]);

  // Modal ochilganda scrollni boshqarish
  useEffect(() => {
    if (selectedProduct && modalRef.current) {
      document.body.style.overflow = "hidden";
      modalRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedProduct]);

  // Manzil qidirish funksiyasi
  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearch(value);
    if (value.length > 2) {
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(value)}`);
        const data = await res.json();
        setSuggestions(data);
      } catch (error) {
        console.error('Search error:', error);
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };

  // Mahsulot qidirish funksiyasi
  const handleProductSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    if (value.length > 0) {
      const filtered = productsState.filter(product =>
        product.product_name?.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  // Mahsulotni bosganda ishlaydigan funksiya
  const handleProductClick = (product) => {
    if (product._id === "7") {
      setShowDiscountModal(true);
    } else {
      setSelectedProduct(product);
    }
  };

  // Chegirmali mahsulotni bosganda
  const handleDiscountProductClick = (product) => {
    setShowDiscountModal(false);
    setTimeout(() => setSelectedProduct(product), 300);
  };

  // Mahsulot modalini yopish
  const handleCloseProductModal = () => {
    setSelectedProduct(null);
  };

  // Chegirma modalini yopish
  const handleCloseDiscountModal = () => {
    setShowDiscountModal(false);
  };

  // Login modalini ochish
  const handleLoginClick = () => {
    setMenuOpen(false);
    setLoginModalOpen(true);
    setLoginEmail('');
    setLoginPassword('');
    setLoginError('');
  };

  // Loginni tekshirish
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (loginEmail === 'jbekmurodov377@gmail.com' && loginPassword === 'maktab009') {
      navigate('/admin-panel');
    } else {
      setLoginError('Noto‘g‘ri email yoki parol');
    }
  };

  // Mahsulotlar massivi bo'sh yoki array emas bo'lsa
  if (!Array.isArray(productsState) || productsState.length === 0) {
    return <div>Hech qanday mahsulot topilmadi</div>;
  }

  // Chilla modal state
  const [showChillaModal, setShowChillaModal] = useState(false);
  // Chilla products for modal
  const chillaProducts = productsState.filter(product => product._id >= "1" && product._id <= "6");
  // Chilla slider scroll state
  const chillaSliderRef = useRef(null);
  const [chillaScrolledToEnd, setChillaScrolledToEnd] = useState(false);

  // Scroll handler for Chilla slider
  const handleChillaScroll = () => {
    const el = chillaSliderRef.current;
    if (!el) return;
    // Check if scrolled to end (allowing 2px tolerance)
    setChillaScrolledToEnd(el.scrollLeft + el.offsetWidth >= el.scrollWidth - 2);
  };

  useEffect(() => {
    fetch('http://localhost:8080/api/v1/basic/product/public')
      .then(res => res.json())
      .then(data => setProductsState(data))
      .catch(err => console.error('Mahsulotlarni olishda xatolik:', err));
  }, []);

  return (
    <div className="home">
      {/* Sarlavha va menyular */}
      <div className="header">
        <div className="menu_icon" onClick={() => setMenuOpen(true)}>
          <CgMenuMotion />
        </div>
        <span className="location" onClick={() => setModalOpen(true)} style={{ cursor: 'pointer' }}>
          Namuna 3-tor ko'chasi, 3
        </span>
      </div>

      {/* Qidiruv paneli */}
      <input
        type="search"
        placeholder="Do'kondan topish"
        className="search-bar"
        value={search}
        onChange={handleProductSearch}
        autoComplete="off"
      />

      {/* Qidiruv takliflari */}
      {search.length > 0 && (
        <div className="search-suggestions">
          {suggestions.length === 0 ? (
            <div style={{ padding: 12, color: "#888" }}>Hech narsa topilmadi</div>
          ) : (
            suggestions.map(product => (
              <div
                key={product._id || product.place_id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: 10,
                  borderBottom: "1px solid #f0f0f0"
                }}
                onClick={() => product.product_name && handleProductClick(product)}
              >
                <img
                  src={product.image_log?.find(img => img.isMain)?.image_url || product.image_url || "/default-image.jpg"}
                  alt={product.product_name || product.display_name}
                  style={{ width: 40, height: 40, borderRadius: 8, objectFit: "cover" }}
                />
                <span>{product.product_name || product.display_name}</span>
              </div>
            ))
          )}
        </div>
      )}

      {/* Menyu ochiladigan oynasi */}
      {menuOpen && (
        <div className="menu-drawer-overlay" onClick={() => setMenuOpen(false)}>
          <div className="menu-drawer" onClick={e => e.stopPropagation()}>
            <div style={{ background: '#19b394', color: '#fff', padding: '18px 16px', fontWeight: 600, fontSize: '18px' }}
                 onClick={handleLoginClick}>
              Avtorizatsiya
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ padding: '16px', borderBottom: '1px solid #eee' }}>To‘lov usullari</li>
              <li style={{ padding: '16px', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/6/6e/Korzinka_logo.png"
                  alt="Korzinka Plus"
                  style={{ width: 24, height: 24 }}
                />
                <span style={{ color: '#e6002d', fontWeight: 600 }}>Korzinka Plus</span>
              </li>
              <li style={{ padding: '16px', borderBottom: '1px solid #eee' }}>
                Tilni o‘zgartirish <span style={{ color: '#888', marginLeft: 8 }}>O‘zbek</span>
              </li>
              <li style={{ padding: '16px', borderBottom: '1px solid #eee' }}>OQ Aloqa</li>
              <li style={{ padding: '16px' }}>Axborot</li>
            </ul>
          </div>
        </div>
      )}

      {/* Login modal oynasi */}
      {loginModalOpen && (
        <div className="modal-overlay" onClick={() => setLoginModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px', padding: '20px' }}>
            <button
              className="modal-close-btn"
              onClick={() => setLoginModalOpen(false)}
              style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <span style={{ fontSize: 22, fontWeight: 600 }}><HiOutlineX /></span>
            </button>
            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Avtorizatsiya</h2>
            <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <input
                type="email"
                placeholder="Email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                style={{ padding: '10px', fontSize: '16px', borderRadius: '8px', border: '1px solid #ccc' }}
                required
              />
              <input
                type="password"
                placeholder="Parol"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                style={{ padding: '10px', fontSize: '16px', borderRadius: '8px', border: '1px solid #ccc' }}
                required
              />
              {loginError && (
                <span style={{ color: 'red', textAlign: 'center', fontSize: '14px' }}>{loginError}</span>
              )}
              <button
                type="submit"
                style={{
                  padding: '10px',
                  background: '#19b394',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  cursor: 'pointer'
                }}
              >
                Kirish
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Manzil modal oynasi */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <input
              type="text"
              value={search}
              onChange={handleSearch}
              placeholder="Manzilni kiriting"
              className="modal-search-input"
              autoFocus
            />
            <div style={{ display: 'flex', alignItems: 'center', marginTop: '18px', gap: '8px', marginBottom: '12px' }}>
              <span style={{ fontSize: '22px' }}>📍</span>
              <span style={{ fontSize: '17px' }}>Xaritadan tanlash</span>
            </div>
            <ul className="suggestions-list">
              {suggestions.map((s, i) => (
                <li key={i} style={{ padding: '10px 0', borderBottom: '1px solid #eee', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '18px', color: '#888' }}>🧭</span>
                    <div>
                      <div style={{ fontSize: '16px', fontWeight: 500 }}>{s.display_name}</div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Kategoriya ikonkalari */}
      <div className="category-icons">
        <button className="icon-btn" onClick={() => setShowDiscountModal(true)}>
          <strong className="percent"><FaPercent /></strong>
          <span>Chegirma</span>
        </button>
        <button className="icon-btn">
          <strong className="favorite"><FaRegHeart /></strong>
          <span>Saralangan</span>
        </button>
        <button className="icon-btn">
          <strong className="refresh"><VscRefresh /></strong>
          <span>Avvalgi xarid</span>
        </button>
        <button className="icon-btn">
          <strong className="QR"><FaQrcode /></strong>
          <span>QR kod</span>
        </button>
      </div>

      {/* Reklama bannerlari */}
      <div className="promotions">
        <div className="promotion">
          <span>Birinchi uchtaga 90 000 so'm chegirma</span>
        </div>
        <div className="promotion">
          <span>JLo konsertiga chiptalarni yutib oling!</span>
        </div>
        <div className="promotion">
          <span>Buyurtmalarimiz ko'pligimiz sababli kechikishimiz mumkin</span>
        </div>
      </div>

      {/* Chilla bo'limi */}
      <div className="product-section">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 className="section-title-chilla" style={{ margin: 0 }}>Chilla</h2>
          {!chillaScrolledToEnd && (
            <button
              className="slider-header-all-btn"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, border: 'none', borderRadius: '16px', color: '#19b394', backgroundColor: 'rgba(21, 167, 13, 0.25)', cursor: 'pointer', fontSize: 13, margin: '20px 20px 0px 0px', padding: '6px' }}
              onClick={() => setShowChillaModal(true)}
            >
              Hammasi <GrFormNext />
            </button>
          )}
        </div>
        <div
          className="product-slider"
          ref={chillaSliderRef}
          style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: 8, scrollSnapType: 'x mandatory' }}
          onScroll={handleChillaScroll}
        >
          {chillaProducts.slice(0, 6).map((product) => {
            const discount = product.discount_log?.find(d => d.status === "active");
            const originalPrice = product.price || 0;
            const discountedPrice = discount
              ? (originalPrice - (originalPrice * discount.percent / 100)).toFixed(2)
              : null;
            return (
              <div
                key={product._id}
                className="product-card"
                onClick={() => handleProductClick(product)}
                style={{ cursor: "pointer", minWidth: 130, maxWidth: 130, scrollSnapAlign: 'start' }}
              >
                <img
                  src={product.image_log?.find(img => img.isMain)?.image_url || product.image_url || "/default-image.jpg"}
                  alt={product.product_name || "Mahsulot rasmi"}
                  className="product-image"
                />
                {discount && <span className="discount-badge">{discount.percent}%</span>}
                <div className="product-details">
                  {discountedPrice ? (
                    <>
                      <span className="price discounted-price">{discountedPrice} so'm</span>
                      <span className="price original-price">{originalPrice} so'm</span>
                    </>
                  ) : (
                    <span className="nnprice">{originalPrice} so'm</span>
                  )}
                  <h3 className="product-name">{product.product_name || "Noma'lum mahsulot"}</h3>
                  <p className="weight">Og'irligi: {product.unit_description || "Noma'lum"}</p>
                  <button className="add-to-cart">Savata</button>
                </div>
              </div>
            );
          })}
        </div>
        {chillaScrolledToEnd && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 12 }}>
            <button
              className="slider-header-all-btn"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, border: 'none', borderRadius: '16px', color: '#19b394', backgroundColor: 'rgba(21, 167, 13, 0.25)', cursor: 'pointer', fontSize: 13, padding: '6px' }}
              onClick={() => setShowChillaModal(true)}
            >
              Hammasi <GrFormNext />
            </button>
          </div>
        )}
      </div>

      {/* Chilla modal */}
      {showChillaModal && (
        <div className="modal-overlay" onClick={() => setShowChillaModal(false)}>
          <div className="modal-content product-modal" ref={modalRef} onClick={e => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setShowChillaModal(false)}>
              <span style={{ fontSize: 22, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><HiOutlineX /></span>
            </button>
            <h2 style={{ marginBottom: 16, textAlign: 'center' }}>Chilla mahsulotlari</h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 16,
              padding: 8,
              maxHeight: 400,
              marginTop: 8
            }}>
              {chillaProducts.map(product => {
                const discount = product.discount_log?.find(d => d.status === "active");
                const originalPrice = product.price || 0;
                const discountedPrice = discount
                  ? (originalPrice - (originalPrice * discount.percent / 100)).toFixed(2)
                  : null;
                return (
                  <div
                    key={product._id}
                    className="product-card"
                    onClick={() => handleProductClick(product)}
                    style={{ cursor: "pointer", minWidth: 120, maxWidth: 160 }}
                  >
                    <img
                      src={product.image_log?.find(img => img.isMain)?.image_url || product.image_url || "/default-image.jpg"}
                      alt={product.product_name || "Mahsulot rasmi"}
                      className="product-image"
                    />
                    {discount && <span className="discount-badge">{discount.percent}%</span>}
                    <div className="product-details">
                      {discountedPrice ? (
                        <>
                          <span className="price discounted-price">{discountedPrice} so'm</span>
                          <span className="price original-price">{originalPrice} so'm</span>
                        </>
                      ) : (
                        <span className="price">{originalPrice} so'm</span>
                      )}
                      <h3 className="product-name">{product.product_name || "Noma'lum mahsulot"}</h3>
                      <p className="weight">Og'irligi: {product.unit_description || "Noma'lum"}</p>
                      <button className="add-to-cart">Savata</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Aktual takliflar bo'limi */}
      <div className="image-gallery-section">
        <h2 className="section-title">Aktual takliflar</h2>
        <div className="universal-gallery" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="row" style={{ width: '100%', display: 'flex', gap: '10px' }}>
            {productsState
              .filter(item => ["7", "8"].includes(item._id))
              .map(item => (
                <div key={item._id} style={{ textAlign: 'center' }}>
                  <img
                    src={item.image_log?.find(img => img.isMain)?.image_url || item.image_url || "/default-image.jpg"}
                    alt={item.product_name}
                    onClick={() => handleProductClick(item)}
                    style={{
                      width: 'calc(165px + ((100vw - 360px) * 0.5))',
                      height: 'calc(100px + ((100vw - 360px) * 0.42857))',
                      borderRadius: '10px',
                      objectFit: 'cover',
                      cursor: "pointer",
                    }}
                  />
                </div>
              ))}
          </div>
          <div className="row" style={{ width: '100%', display: 'flex', gap: '10px' }}>
            {productsState
              .filter(item => ["9", "10", "11"].includes(item._id))
              .map(item => (
                <div key={item._id} style={{ textAlign: 'center' }}>
                  <img
                    src={item.image_log?.find(img => img.isMain)?.image_url || item.image_url || "/default-image.jpg"}
                    alt={item.product_name}
                    onClick={() => handleProductClick(item)}
                    style={{
                      width: 'calc(106.5px + ((100vw - 360px) * 0.33571))',
                      height: 'calc(106.5px + ((100vw - 360px) * 0.33571))',
                      borderRadius: '10px',
                      objectFit: 'cover',
                      cursor: "pointer",
                    }}
                  />
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Sabzavot va mevalar bo'limi */}
      <div className="Tabiy-mahsulotlar section-title">
        <h2 className="section-title">Sabzavot va mevalar</h2>
        <div className="sabzavot-gallery" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
          {productsState
            .filter(item => (item._id === "12" || item._id === "13") && item.product_name !== "Чай зеленый")
            .map(item => (
              <div key={item._id}>
                <img
                  src={item.image_log?.find(img => img.isMain)?.image_url || item.image_url || "/default-image.jpg"}
                  alt={item.product_name}
                  style={{
                    width: 'calc(165px + ((100vw - 360px) * 0.5))',
                    height: 'calc(100px + ((100vw - 360px) * 0.42857))',
                    borderRadius: '10px',
                    cursor: "pointer",
                    objectFit: 'cover',
                    display: 'block',
                  }}
                  onClick={() => handleProductClick(item)}
                />
              </div>
            ))}
        </div>
      </div>

      {/* Haftaning super narxi bo'limi */}
      <div className="eng-aron-mahsulotlar">
        <h2 className="section-title">Haftaning super narxi</h2>
        <div className="super-price-slider">
          {productsState
            .filter(product => Number(product._id) >= 14 && Number(product._id) <= 19)
            .map(product => {
              const discount = product.discount_log?.find(d => d.status === "active");
              const originalPrice = product.price || 0;
              const discountedPrice = discount
                ? (originalPrice - (originalPrice * discount.percent / 100)).toFixed(2)
                : null;

              return (
                <div
                  key={product._id}
                  className="product-card"
                  onClick={() => handleProductClick(product)}
                  style={{ cursor: "pointer" }}
                >
                  <img
                    src={product.image_log?.find(img => img.isMain)?.image_url || product.image_url || "/default-image.jpg"}
                    alt={product.product_name || "Mahsulot rasmi"}
                    className="product-image"
                  />
                  <div className="product-details">
                    <span className="price">{discountedPrice || originalPrice} so'm</span>
                    <h3 className="product-name">{product.product_name || "Noma'lum mahsulot"}</h3>
                    <p className="weight">Og'irligi: {product.unit_description || "Noma'lum"}</p>
                    <button className="add-to-cart">Savata</button>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Tayyor ovqat bo'limi */}
      <div className="tayyor-mahsulotlar">
        <h2 className="section-title">Tayyor ovqat</h2>
        <div
          className="tayyor-mahsulot-card"
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}
        >
          {productsState
            .filter(product => product._id === "20")
            .map(product => (
              <div
                key={product._id}
                className="tayyor-mahsulot-card"
                style={{ textAlign: 'center', cursor: "pointer" }}
                onClick={() => handleProductClick(product)}
              >
                <img
                  src={product.image_log?.find(img => img.isMain)?.image_url || product.image_url || "/default-image.jpg"}
                  alt={product.product_name || "Mahsulot rasmi"}
                  style={{ width: '100%', objectFit: 'cover', borderRadius: '15px' }}
                />
              </div>
            ))}
        </div>
      </div>

      {/* Sut mahsulotlari bo'limi */}
      <div className="sut-mahsulotlari">
        <h2 className="section-title">Sut mahsulotlari</h2>
        <div
          className="sut-gallery"
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
        >
          <div
            className="sut-gallery-row"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', width: '100%' }}
          >
            {productsState
              .filter(item => ["21", "22", "23"].includes(item._id))
              .map(item => (
                <div
                  key={item._id}
                  style={{ cursor: "pointer" }}
                  onClick={() => handleProductClick(item)}
                >
                  <img
                    src={item.image_log?.find(img => img.isMain)?.image_url || item.image_url || "/default-image.jpg"}
                    alt={item.product_name || "Sut mahsuloti"}
                    style={{
                      width: 'calc(106.5px + ((100vw - 360px) * 0.33571))',
                      height: 'calc(106.5px + ((100vw - 360px) * 0.33571))',
                      borderRadius: '10px',
                      objectFit: 'cover',
                      cursor: "pointer",
                    }}
                  />
                </div>
              ))}
          </div>
          <div
            className="sut-gallery-item"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', width: '100%' }}
          >
            {productsState
              .filter(item => ["24", "25", "26"].includes(item._id))
              .map(item => (
                <div
                  key={item._id}
                  style={{ cursor: "pointer" }}
                  onClick={() => handleProductClick(item)}
                >
                  <img
                    src={item.image_log?.find(img => img.isMain)?.image_url || item.image_url || "/default-image.jpg"}
                    alt={item.product_name || "Sut mahsuloti"}
                    style={{
                      width: 'calc(106.5px + ((100vw - 360px) * 0.33571))',
                      height: 'calc(106.5px + ((100vw - 360px) * 0.33571))',
                      borderRadius: '10px',
                      objectFit: 'cover',
                      cursor: "pointer",
                    }}
                  />
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Sizga yoqadi bo'limi */}
      <div className="Sizga-yoqadi">
        <h2 className="section-title">Sizga yoqadi</h2>
        <div className="sizga-yoqadi-slider" style={{ zIndex: 1 }}>
          {productsState
            .filter(product => Number(product._id) >= 27 && Number(product._id) <= 31)
            .map(product => (
              <div
                key={product._id}
                className="product-card"
                onClick={() => handleProductClick(product)}
                style={{ cursor: "pointer" }}
              >
                <img
                  src={product.image_log?.find(img => img.isMain)?.image_url || product.image_url || "/default-image.jpg"}
                  alt={product.product_name || "Mahsulot rasmi"}
                  className="product-image"
                />
                <div className="product-details">
                  <span className="price">{product.price} so'm</span>
                  <h3 className="product-name">{product.product_name || "Noma'lum mahsulot"}</h3>
                  <p className="weight">Og'irligi: {product.unit_description || "Noma'lum"}</p>
                  <button className="add-to-cart">Savata</button>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Go'sht va parrandalar bo'limi */}
      <div className="goshtlar">
        <h2 className="section-title">Go'sht va parrandalar</h2>
        <div
          className="gosht-gallery"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}
        >
          {productsState
            .filter(item => (item._id === "32" || item._id === "33") && item.product_name !== "Чай зеленый")
            .map(item => (
              <div key={item._id}>
                <img
                  src={item.image_log?.find(img => img.isMain)?.image_url || item.image_url || "/default-image.jpg"}
                  alt={item.product_name}
                  style={{ borderRadius: '10px', cursor: "pointer" }}
                  onClick={() => handleProductClick(item)}
                />
                <div style={{ textAlign: 'center', marginTop: '8px' }}>{item.product_name}</div>
              </div>
            ))}
        </div>
      </div>

      {/* Dengiz mahsulotlari bo'limi */}
      <div className="dengiz-mahsulotlari">
        <h2 className="section-title">Dengiz mahsulotlari</h2>
        <div className="gosht-gallery" style={{ display: 'flex' }}>
          <div
            className="gosht-row"
            style={{ display: 'flex', gap: '10px', width: '100%', justifyContent: 'space-between' }}
          >
            {productsState
              .filter(item => ["34", "35", "36"].includes(item._id))
              .map(item => (
                <div
                  key={item._id}
                  style={{ textAlign: 'center', cursor: "pointer" }}
                  onClick={() => handleProductClick(item)}
                >
                  <img
                    src={item.image_log?.find(img => img.isMain)?.image_url || item.image_url || "/default-image.jpg"}
                    alt={item.product_name || "Go'sht mahsuloti"}
                    style={{
                      width: 'calc(106.5px + ((100vw - 360px) * 0.33571))',
                      height: 'calc(106.5px + ((100vw - 360px) * 0.33571))',
                      borderRadius: '10px',
                      objectFit: 'cover',
                      cursor: "pointer",
                    }}
                  />
                  <div style={{ marginTop: '8px' }}>{item.product_name}</div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Suv va ichimliklar bo'limi */}
      <div className="ichimliklar">
        <h2 className="section-title">Suv va ichimliklar</h2>
        <div
          className="universal-gallery"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
          }}
        >
          <div className="image-gallery" style={{ width: '100%' }}>
            <div
              className="row"
              style={{
                display: 'flex',
                width: '100%',
                justifyContent: 'space-between',
                gap: '10px',
              }}
            >
              {productsState
                .filter(item => item._id === "37" || item._id === "38")
                .map(item => (
                  <div key={item._id} style={{ flex: '0 1 auto' }}>
                    <img
                      src={item.image_log?.find(img => img.isMain)?.image_url || item.image_url || "/default-image.jpg"}
                      alt={item.product_name || "Mahsulot rasmi"}
                      style={{
                        width: 'calc(165px + ((100vw - 360px) * 0.5))',
                        height: 'calc(100px + ((100vw - 360px) * 0.42857))',
                        borderRadius: '10px',
                        objectFit: 'cover',
                        cursor: 'pointer',
                      }}
                      onClick={() => handleProductClick(item)}
                    />
                  </div>
                ))}
            </div>
            <div
              className="row"
              style={{
                display: 'flex',
                width: '100%',
                justifyContent: 'space-between',
                gap: '10px',
              }}
            >
              {productsState
                .filter(item => ["39", "40", "41"].includes(item._id))
                .map(item => (
                  <div key={item._id} style={{ flex: '0 1 auto' }}>
                    <img
                      src={item.image_log?.find(img => img.isMain)?.image_url || item.image_url || "/default-image.jpg"}
                      alt={item.product_name || "Mahsulot rasmi"}
                      style={{
                        width: 'calc(106.5px + ((100vw - 360px) * 0.33571))',
                        height: 'calc(106.5px + ((100vw - 360px) * 0.33571))',
                        borderRadius: '10px',
                        objectFit: 'cover',
                        cursor: 'pointer',
                      }}
                      onClick={() => handleProductClick(item)}
                    />
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Shirinlik sevuvchilar bo'limi */}
      <div className="shirinlik-sevuvchilar">
        <h2 className="section-title">Shirinlik sevuvchilar</h2>
        <div className="sizga-yoqadi-slider">
          {productsState
            .filter(product => Number(product._id) >= 42 && Number(product._id) <= 47)
            .map(product => (
              <div
                key={product._id}
                className="product-card"
                onClick={() => handleProductClick(product)}
                style={{ cursor: "pointer" }}
              >
                <img
                  src={product.image_log?.find(img => img.isMain)?.image_url || product.image_url || "/default-image.jpg"}
                  alt={product.product_name || "Mahsulot rasmi"}
                  className="product-image"
                />
                <div className="product-details">
                  <span className="price">{product.price} so'm</span>
                  <h3 className="product-name">{product.product_name || "Noma'lum mahsulot"}</h3>
                  <p className="weight">Og'irligi: {product.unit_description || "Noma'lum"}</p>
                  <button className="add-to-cart">Savata</button>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Shirinliklar bo'limi */}
      <div className="shirinliklar">
        <h2 className="section-title">Shirinliklar</h2>
        <div
          className="shirinlik-gallery"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px',
            width: '100%',
          }}
        >
          <div
            className="shirinlik-row"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '10px',
              width: '100%',
            }}
          >
            {productsState
              .filter(item => ["48", "49", "50"].includes(item._id))
              .map(item => (
                <div key={item._id} style={{ flex: '0 1 auto' }}>
                  <img
                    src={item.image_log?.find(img => img.isMain)?.image_url || item.image_url || "/default-image.jpg"}
                    alt={item.product_name || "Shirinlik mahsuloti"}
                    style={{ borderRadius: '10px', objectFit: 'cover', cursor: 'pointer' }}
                    onClick={() => handleProductClick(item)}
                  />
                </div>
              ))}
          </div>
          <div
            className="shirinlik-row"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '10px',
              width: '100%',
            }}
          >
            {productsState
              .filter(item => ["51", "52", "53"].includes(item._id))
              .map(item => (
                <div key={item._id} style={{ flex: '0 1 auto' }}>
                  <img
                    src={item.image_log?.find(img => img.isMain)?.image_url || item.image_url || "/default-image.jpg"}
                    alt={item.product_name || "Shirinlik mahsuloti"}
                    style={{ borderRadius: '10px', objectFit: 'cover', cursor: 'pointer' }}
                    onClick={() => handleProductClick(item)}
                  />
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Oziq-ovqat mollari bo'limi */}
      <div className="Oziq-ovqat">
        <h2 className="section-title">Oziq-ovqat mollari</h2>
        <div
          className="shirinlik-gallery"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            gap: '10px',
          }}
        >
          <div
            className="shirinlik-row"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: '10px',
              width: '100%',
            }}
          >
            {productsState
              .filter(item => ["54", "55", "56"].includes(item._id))
              .map(item => (
                <div key={item._id}>
                  <img
                    src={item.image_log?.find(img => img.isMain)?.image_url || item.image_url || "/default-image.jpg"}
                    alt={item.product_name || "Shirinlik mahsuloti"}
                    style={{ borderRadius: '10px', objectFit: 'cover', cursor: 'pointer' }}
                    onClick={() => handleProductClick(item)}
                  />
                </div>
              ))}
          </div>
          <div
            className="shirinlik-row"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: '10px',
              width: '100%',
            }}
          >
            {productsState
              .filter(item => ["57", "58", "59"].includes(item._id))
              .map(item => (
                <div key={item._id}>
                  <img
                    src={item.image_log?.find(img => img.isMain)?.image_url || item.image_url || "/default-image.jpg"}
                    alt={item.product_name || "Shirinlik mahsuloti"}
                    style={{ borderRadius: '10px', objectFit: 'cover', cursor: 'pointer' }}
                    onClick={() => handleProductClick(item)}
                  />
                </div>
              ))}
          </div>
          <div
            className="shirinlik-row"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: '10px',
              width: '100%',
            }}
          >
            {productsState
              .filter(item => ["60", "61", "62"].includes(item._id))
              .map(item => (
                <div key={item._id}>
                  <img
                    src={item.image_log?.find(img => img.isMain)?.image_url || item.image_url || "/default-image.jpg"}
                    alt={item.product_name || "Shirinlik mahsuloti"}
                    style={{ borderRadius: '10px', objectFit: 'cover', cursor: 'pointer' }}
                    onClick={() => handleProductClick(item)}
                  />
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Non mahsulotlari bo'limi */}
      <div className="Oziq-ovqat">
        <h2 className="section-title">Non mahsulotlari</h2>
        <div
          className="shirinlik-gallery"
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '8px',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
          }}
        >
          <div
            className="shirinlik-row"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '10px',
              width: '100%',
            }}
          >
            {productsState
              .filter(item => ["63", "64", "65"].includes(item._id))
              .map(item => (
                <div key={item._id} style={{ flex: '0 1 auto' }}>
                  <img
                    src={item.image_log?.find(img => img.isMain)?.image_url || item.image_url || "/default-image.jpg"}
                    alt={item.product_name || "Shirinlik mahsuloti"}
                    style={{ borderRadius: '10px', objectFit: 'cover', cursor: 'pointer' }}
                    onClick={() => handleProductClick(item)}
                  />
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Muzlatilgan mahsulotlar va muzqaymoq bo'limi */}
      <div className="goshtlar">
        <h2 className="section-title">Muzlatilgan mahsulotlar va muzqaymoq</h2>
        <div
          className="gosht-gallery"
          style={{
            display: 'flex',
            gap: '10px',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            margin: '0 auto',
          }}
        >
          {productsState
            .filter(item => (item._id === "66" || item._id === "67") && item.product_name !== "Чай зеленый")
            .map(item => (
              <div key={item._id} style={{ flex: '0 1 auto' }}>
                <img
                  src={item.image_log?.find(img => img.isMain)?.image_url || item.image_url || "/default-image.jpg"}
                  alt={item.product_name || "Muzlatilgan mahsulot"}
                  style={{ borderRadius: '10px', objectFit: 'cover', cursor: 'pointer' }}
                  onClick={() => handleProductClick(item)}
                />
              </div>
            ))}
        </div>
      </div>

      {/* Turli xil konservalar bo'limi */}
      <div className="goshtlar">
        <h2 className="section-title">Turli xil konservalar</h2>
        <div
          className="gosht-gallery"
          style={{
            display: 'flex',
            gap: '10px',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            margin: '0 auto',
          }}
        >
          {productsState
            .filter(item => (item._id === "68" || item._id === "69") && item.product_name !== "Чай зеленый")
            .map(item => (
              <div key={item._id} style={{ flex: '0 1 auto' }}>
                <img
                  src={item.image_log?.find(img => img.isMain)?.image_url || item.image_url || "/default-image.jpg"}
                  alt={item.product_name || "Konserva mahsuloti"}
                  style={{ borderRadius: '10px', objectFit: 'cover', cursor: 'pointer' }}
                  onClick={() => handleProductClick(item)}
                />
              </div>
            ))}
        </div>
      </div>

      {/* Bolalar uchun bo'limi */}
      <div className="ichimliklar">
        <h2 className="section-title">Bolalar uchun</h2>
        <div
          className="universal-gallery"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            margin: '0 auto',
          }}
        >
          <div
            className="image-gallery"
            style={{
              width: '100%',
            }}
          >
            <div
              className="row"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '10px',
                width: '100%',
              }}
            >
              {productsState
                .filter(item => item._id === "70" || item._id === "71")
                .map(item => (
                  <div key={item._id} style={{ flex: '0 1 auto' }}>
                    <img
                      src={item.image_log?.find(img => img.isMain)?.image_url || item.image_url || "/default-image.jpg"}
                      alt={item.product_name || "Mahsulot rasmi"}
                      style={{
                        width: 'calc(165px + ((100vw - 360px) * 0.5))',
                        height: 'calc(100px + ((100vw - 360px) * 0.42857))',
                        borderRadius: '10px',
                        objectFit: 'cover',
                        cursor: 'pointer',
                      }}
                      onClick={() => handleProductClick(item)}
                    />
                  </div>
                ))}
            </div>
            <div
              className="row"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '10px',
                width: '100%',
              }}
            >
              {productsState
                .filter(item => ["72", "73", "74"].includes(item._id))
                .map(item => (
                  <div key={item._id} style={{ flex: '0 1 auto' }}>
                    <img
                      src={item.image_log?.find(img => img.isMain)?.image_url || item.image_url || "/default-image.jpg"}
                      alt={item.product_name || "Mahsulot rasmi"}
                      style={{
                        width: 'calc(106.5px + ((100vw - 360px) * 0.33571))',
                        height: 'calc(106.5px + ((100vw - 360px) * 0.33571))',
                        borderRadius: '10px',
                        objectFit: 'cover',
                        cursor: 'pointer',
                      }}
                      onClick={() => handleProductClick(item)}
                    />
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Uy hayvonlari uchun bo'limi */}
      <div className="goshtlar">
        <h2 className="section-title">Uy hayvonlari uchun</h2>
        <div
          className="gosht-gallery"
          style={{
            display: 'flex',
            gap: '10px',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            margin: '0 auto',
          }}
        >
          {productsState
            .filter(item => (item._id === "75" || item._id === "76") && item.product_name !== "Чай зеленый")
            .map(item => (
              <div key={item._id} style={{ flex: '0 1 auto' }}>
                <img
                  src={item.image_log?.find(img => img.isMain)?.image_url || item.image_url || "/default-image.jpg"}
                  alt={item.product_name || "Uy hayvonlari mahsuloti"}
                  style={{ borderRadius: '10px', objectFit: 'cover', cursor: 'pointer' }}
                  onClick={() => handleProductClick(item)}
                />
              </div>
            ))}
        </div>
      </div>

      {/* Gigiyena va parvarish bo'limi */}
      <div className="ichimliklar">
        <h2 className="section-title">Gigiyena va parvarish</h2>
        <div
          className="universal-gigiyena"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            margin: '0 auto',
            gap: '10px',
          }}
        >
          <div
            className="gigiyena"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '10px',
              width: '100%',
            }}
          >
            {productsState
              .filter(item => ["77", "78"].includes(item._id))
              .map(item => (
                <div key={item._id} style={{ flex: '0 1 auto' }}>
                  <img
                    src={item.image_log?.find(img => img.isMain)?.image_url || item.image_url || "/default-image.jpg"}
                    alt={item.product_name || "Gigiyena mahsuloti"}
                    style={{ borderRadius: '16px', objectFit: 'cover', cursor: 'pointer' }}
                    onClick={() => handleProductClick(item)}
                  />
                </div>
              ))}
          </div>
          <div
            className="row"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '10px',
              width: '100%',
            }}
          >
            {productsState
              .filter(item => ["79", "80", "81"].includes(item._id))
              .map(item => (
                <div key={item._id} style={{ flex: '0 1 auto' }}>
                  <img
                    src={item.image_log?.find(img => img.isMain)?.image_url || item.image_url || "/default-image.jpg"}
                    alt={item.product_name || "Gigiyena mahsuloti"}
                    style={{
                      width: 'calc(106.5px + ((100vw - 360px) * 0.33571))',
                      height: 'calc(106.5px + ((100vw - 360px) * 0.33571))',
                      borderRadius: '16px',
                      objectFit: 'cover',
                      cursor: 'pointer',
                    }}
                  />
                </div>
              ))}
          </div>
          <div
            className="gigiyena"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '10px',
              width: '100%',
            }}
          >
            {productsState
              .filter(item => ["82", "83"].includes(item._id))
              .map(item => (
                <div key={item._id} style={{ flex: '0 1 auto' }}>
                  <img
                    src={item.image_log?.find(img => img.isMain)?.image_url || item.image_url || "/default-image.jpg"}
                    alt={item.product_name || "Gigiyena mahsuloti"}
                    style={{ borderRadius: '16px', objectFit: 'cover', cursor: 'pointer' }}
                    onClick={() => handleProductClick(item)}
                  />
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Chinniyu chiroq bo'limi */}
      <div className="Oziq-ovqat">
        <h2 className="section-title">Chinniyu chiroq</h2>
        <div
          className="shirinlik-gallery"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            margin: '0 auto',
          }}
        >
          <div
            className="shirinlik-row"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '10px',
              width: '100%',
            }}
          >
            {productsState
              .filter(item => ["84", "85", "86"].includes(item._id))
              .map(item => (
                <div key={item._id} style={{ flex: '0 1 auto' }}>
                  <img
                    src={item.image_log?.find(img => img.isMain)?.image_url || item.image_url || "/default-image.jpg"}
                    alt={item.product_name || "Chinniyu chiroq mahsuloti"}
                    style={{ borderRadius: '10px', objectFit: 'cover', cursor: 'pointer' }}
                    onClick={() => handleProductClick(item)}
                  />
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Ro'zg'or uchun bo'limi */}
      <div className="shirinlikar">
        <h2 className="section-title">Ro'zg'or uchun</h2>
        <div
          className="shirinlik-gallery"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            margin: '0 auto',
          }}
        >
          <div
            className="shirinlik-row"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '10px',
              width: '100%',
              borderRadius: '10px',
            }}
          >
            {productsState
              .filter(item => ["87", "88", "89"].includes(item._id))
              .map(item => (
                <div key={item._id} style={{ flex: '0 1 auto' }}>
                  <img
                    src={item.image_log?.find(img => img.isMain)?.image_url || item.image_url || "/default-image.jpg"}
                    alt={item.product_name || "Ro'zg'or mahsuloti"}
                    style={{ borderRadius: '10px', objectFit: 'cover', cursor: 'pointer' }}
                    onClick={() => handleProductClick(item)}
                  />
                </div>
              ))}
          </div>
          <div
            className="shirinlik-row"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '10px',
              width: '100%',
            }}
          >
            {productsState
              .filter(item => ["90", "91", "92"].includes(item._id))
              .map(item => (
                <div key={item._id} style={{ flex: '0 1 auto' }}>
                  <img
                    src={item.image_log?.find(img => img.isMain)?.image_url || item.image_url || "/default-image.jpg"}
                    alt={item.product_name || "Ro'zg'or mahsuloti"}
                    style={{ borderRadius: '10px', objectFit: 'cover', cursor: 'pointer' }}
                    onClick={() => handleProductClick(item)}
                  />
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Mahsulot modal oynasi */}
      {selectedProduct && (
        <div className="modal-overlay" onClick={handleCloseProductModal}>
          <div
            className="modal-content product-modal"
            ref={modalRef}
            onClick={e => e.stopPropagation()}
            style={
              selectedProduct._id === "7"
                ? {
                    maxWidth: '100vw',
                    width: '100vw',
                    minWidth: 0,
                    left: 0,
                    right: 0,
                    margin: 0,
                    borderRadius: 0,
                    padding: '8px',
                    boxSizing: 'border-box',
                    ...(window.innerWidth <= 360 ? { minHeight: '100vh', height: '100vh' } : {})
                  }
                : {}
            }
          >
            {/* Tanlangan mahsulot */}
            <div className="modal-img-wrap">
              <img
                src={selectedProduct.image_log?.find(img => img.isMain)?.image_url || selectedProduct.image_url || "/default-image.jpg"}
                alt={selectedProduct.product_name}
                className="modal-product-img"
              />
              <button
                className={`modal-like-btn ${selectedProduct.isFavorite ? " liked" : "" }`}
                style={{ background: 'none', border: 'none', cursor: 'pointer', marginTop: '16px'  }}
                onClick={() => {
                  setSelectedProduct({ ...selectedProduct, isFavorite: !selectedProduct.isFavorite });
                }}
              >
                <span role="img" aria-label="like" style={{ fontSize: 26, marginLeft: '19px', marginTop:'16px', background: 'none' }}><FaRegHeart /></span>
              </button>
              <button className="modal-close-btn" onClick={handleCloseProductModal}>
                <span style={{ fontSize: 28, fontWeight: 600 }}><HiOutlineX /></span>
              </button>
            </div>
            <div className="modal-product-body">
              {selectedProduct.discount_log?.find(d => d.status === "active") && (
                <div className="modal-discount-badge">
                  -{selectedProduct.discount_log.find(d => d.status === "active").percent}%
                </div>
              )}
              <div className="modal-product-title">
                <span className="modal-product-name">{selectedProduct.product_name}</span>
                {selectedProduct.unit_description && (
                  <span className="modal-product-weight">{selectedProduct.unit_description}</span>
                )}
              </div>
              <div className="modal-product_desc">{selectedProduct.product_description}</div>
              {/* Batafsil (details) collapsible section */}
              <div style={{ margin: '12px 0' }}>
                <button
                  onClick={() => setShowDetails(prev => !prev)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#228b22',
                    fontSize: 16,
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                    gap: 6,
                    fontWeight: 600
                  }}
                >
                  Batafsil
                  <span style={{
                    display: 'inline-block',
                    transform: showDetails ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s',
                    fontSize: 18
                  }}>
                    ▼
                  </span>
                </button>
                {showDetails && (
                  <div style={{ marginTop: 8 }}>
                    {selectedProduct.product_ingredients && (
                      <div className="modal-product-info">
                        <strong>Tarkibi:</strong> {selectedProduct.product_ingredients}
                      </div>
                    )}
                    {selectedProduct.nutritional_value && (
                      <div className="modal-product-info" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        <strong>Energiya:</strong>
                        <ul className="nutritional-value-list" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <li>Kkal: {selectedProduct.nutritional_value.kkal}</li>
                          <li>Yog': {selectedProduct.nutritional_value.fat}g</li>
                          <li>Oqsil: {selectedProduct.nutritional_value.protein}g</li>
                          <li>Uglevod: {selectedProduct.nutritional_value.uglevod}g</li>
                        </ul>
                      </div>
                    )}
                    {selectedProduct.strg_conditions && (
                      <div className="modal-product-info">
                        <strong>Saqlash:</strong> {selectedProduct.strg_conditions}
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="modal-product-details">
                <div className="modal-product-price">
                  {selectedProduct.discount_log?.find(d => d.status === "active") ? (
                    <>
                      <span className="modal-product-price-new">
                        {(selectedProduct.price - (selectedProduct.price * selectedProduct.discount_log.find(d => d.status === "active").percent / 100)).toFixed(2)} so'm
                      </span>
                      <span className="modal-product-price-old">{selectedProduct.price} so'm</span>
                    </>
                  ) : (
                    <span className="modal-product-price-new">{selectedProduct.price} so'm</span>
                  )}
                </div>
              </div>
              <button className="modal-add-to-cart-btn">Savatchaga qo'shish</button>
              {/* O'xshash mahsulotlar bo'limi */}
              <div className="similar-products">
                <h3 style={{ fontSize: 18, marginTop: 18 }}>O‘xshash mahsulotlar</h3>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: 8,
                    placeItems: 'center',
                    maxWidth: '100%',
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: 0,
                    margin: 0,
                    overflow: 'hidden',
                  }}
                >
                  {productsState
                    .filter(p =>
                      p._id !== selectedProduct._id &&
                      p.product_name &&
                      selectedProduct.product_name &&
                      p.product_name.toLowerCase().includes(
                        selectedProduct.product_name.split(" ")[0].toLowerCase()
                      )
                    )
                    .slice(0, 8)
                    .map(p => {
                      const discount = p.discount_log?.find(d => d.status === "active");
                      const originalPrice = p.price || 0;
                      const discountedPrice = discount
                        ? (originalPrice - (originalPrice * discount.percent / 100)).toFixed(2)
                        : null;

                      return (
                        <div
                          key={p._id}
                          className="product-card"
                          onClick={() => handleProductClick(p)}
                          style={{
                            cursor: "pointer",
                            display: "inline-block",
                            width: 'calc(100px + ((100vw - 360px) * 0.37))',
                            minWidth: 'calc(100px + ((100vw - 360px) * 0.37))',
                            height: 'auto',
                            maxHeight: '300px',
                            boxSizing: 'border-box',
                            overflow: 'hidden',
                          }}
                        >
                          <img
                            src={p.image_log?.find(img => img.isMain)?.image_url || p.image_url || "/default-image.jpg"}
                            alt={p.product_name}
                            className="product-image"
                            style={{
                              width: '100%',
                              height: 'calc(130px + ((100vw - 360px) * 0.35))',
                              borderRadius: '10px 10px 0 0',
                              objectFit: 'cover',
                              display: 'block',
                            }}
                          />
                          {discount && (
                            <span className="discount-badge">{discount.percent}%</span>
                          )}
                          <div className="product-details">
                            {discountedPrice ? (
                              <>
                                <span className="price discounted-price">{discountedPrice} so'm</span>
                                <span className="price original-price">{originalPrice} so'm</span>
                              </>
                            ) : (
                              <span className="price">{originalPrice} so'm</span>
                            )}
                            <h3 className="product-name">{p.product_name || "Noma'lum mahsulot"}</h3>
                            <p className="weight">Og'irligi: {p.unit_description || "Noma'lum"}</p>
                            <button className="add-to-cart">Savata</button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chegirma modal oynasi */}
      {showDiscountModal && (
        <div className="modal-overlay discount-modal-overlay" onClick={handleCloseDiscountModal} style={{ height: '100%' }}>
          <div
            className="modal-content discount-modal"
            onClick={e => e.stopPropagation()}
            style={{ maxHeight: '100%', overflowY: 'auto', scrollBehavior: 'smooth' }}
          >
            <button className="modal-close-btn" onClick={handleCloseDiscountModal}>
              <span>×</span>
            </button>
            <div
              className="discount-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 16,
                placeItems: 'center',
              }}
            >
              <div
                className="discount-header"
                style={{
                  gridColumn: '1 / -1',
                  position: 'static',
                  top: 'unset',
                  background: 'unset',
                  zIndex: 'unset',
                  paddingBottom: 8,
                  marginBottom: 8,
                }}
              >
                <div className="discount-buttons">
                  {[
                    "Haftaning super narxi",
                    "Ertalab uchun eng yaxshisi",
                    "Mazali taomlar uchun",
                    "Shirinlik sevuvchilar",
                    "Kichkintoylar uchun eng yaxshisi",
                    "Yana 2 ta ▼"
                  ].map((text, index) => (
                    <button key={index} className="discount-button">{text}</button>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Mahsulot qidirish"
                  className="discount-search"
                  value={discountSearch}
                  onChange={e => setDiscountSearch(e.target.value)}
                />
                <div className="discount-title">Chegirmali va arzon mahsulotlar</div>
              </div>
              {filteredDiscountedProducts.map((product, idx) => {
                const discount = product.discount_log?.find(d => d.status === "active");
                const originalPrice = product.price || 0;
                const discountedPrice = discount
                  ? (originalPrice - (originalPrice * discount.percent / 100)).toFixed(0)
                  : null;
                return (
                  <div
                    key={product._id}
                    className="product-card"
                    style={{ marginBottom: 16 }}
                    onClick={() => handleDiscountProductClick(product)}
                  >
                    <img
                      src={product.image_log?.find(img => img.isMain)?.image_url || product.image_url || "/default-image.jpg"}
                      alt={product.product_name}
                      className="discount-product-img"
                    />
                    <div className="product-details">
                      {discountedPrice ? (
                        <>
                          <span className="price discounted-price" style={{ fontSize: '14px' }}>{discountedPrice} so'm</span>
                          <span className="price original-price" style={{ fontSize: '12px' }}>{originalPrice} so'm</span>
                        </>
                      ) : (
                        <span className="price" style={{ fontSize: '14px' }}>{originalPrice} so'm</span>
                      )}
                      <h3 className="product-name">{product.product_name}</h3>
                      <p className="weight">Og'irligi: {product.unit_description || "Noma'lum"}</p>
                      <button className="add-to-cart">Savatchaga</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
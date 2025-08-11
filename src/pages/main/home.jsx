import React, { useState, useEffect, useRef } from 'react';
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';
import '../../assets/style.css';
// import products from '../../assets/products.json';
import { CgMenuMotion } from "react-icons/cg";
import { VscRefresh } from "react-icons/vsc";
import { GrFormNext } from "react-icons/gr";
import { HiOutlineX } from "react-icons/hi";
import { FaQrcode, FaPercent, FaRegHeart } from "react-icons/fa6";
import aktualImg1 from '../../assets/aktual_1.png';
import soglomImg from '../../assets/aktual_2.png'; // siz joylashtirgan rasm nomi
import yangiliklarImg from '../../assets/yangiliklar.png'; // siz joylashtirgan rasm nomi
import arzon from '../../assets/arzon.png'; // siz joylashtirgan rasm nomi
import karzinka_yoz from '../../assets/karzinka_yoz.png'; // siz joylashtirgan rasm nomi

// Asosiy Home komponenti
function Home() {
  // Barcha hooklar faqat komponent boshida
  const [productsState, setProductsState] = useState([]);
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
  const [showChillaModal, setShowChillaModal] = useState(false);
  const [chillaScrolledToEnd, setChillaScrolledToEnd] = useState(false);
  const [showAktualSlider, setShowAktualSlider] = useState(false);
  const [aktualActiveSub, setAktualActiveSub] = useState(''); // subkategoriya tanlash uchun
  const [aktualModalHide, setAktualModalHide] = useState(false);
  const modalRef = useRef(null);
  const chillaSliderRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const telegramId = "7575741991"; // Your Telegram ID
    const encodedAuth = btoa(`${telegramId}:`); // Encode Telegram ID for Basic Auth
    const api = axios.create({
      baseURL: "http://localhost:8080/api/v1/basic/product/get",
      headers: {
        Authorization: `Basic ${encodedAuth}`,
        "Content-Type": "application/json",
      },
    });

    // Function to fetch products
    const fetchProducts = async () => {
      try {
        const response = await api.get("");
        // Handle different possible response structures
        const products = Array.isArray(response.data.products)
          ? response.data.products
          : Array.isArray(response.data)
          ? response.data
          : [];
        
        // Ensure products have the required structure
        const formattedProducts = products.map(product => ({
          _id: product._id || "",
          product_name: product.product_name || "Noma'lum mahsulot",
          price: product.price || 0,
          unit_description: product.unit_description || "Noma'lum",
          image_log: product.image_log || [{ isMain: true, image_url: "/default-image.jpg" }],
          product_description: product.product_description || "",
          product_ingredients: product.product_ingredients || "",
          nutritional_value: product.nutritional_value || { kkal: 0, fat: 0, protein: 0, uglevod: 0 },
          strg_conditions: product.strg_conditions || "",
          discount_log: product.discount_log || [],
          category: product.category || { category: "" },
          subcategory: product.subcategory || { subcategory: "" },
          isFavorite: product.isFavorite || false,
        }));

        setProductsState(formattedProducts);
      } catch (error) {
        console.error("Mahsulotlarni olishda xatolik:", error);
        setProductsState([]); // Set empty array on error to prevent crashes
      }
    };

    fetchProducts();
  }, []);

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
      // modalRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      // window.scrollTo({ top: 0, behavior: 'smooth' });
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
  

  // Mahsulotlar massivi bo'sh yoki array emas bo'lsa
  if (!Array.isArray(productsState) || productsState.length === 0) {
    return <div>Hech qanday mahsulot topilmadi</div>;
  }

  // Chilla modal state
  // Chilla products for modal
  const chillaProducts = productsState.filter(product => product.category?.category === "Chilla");
  // Chilla slider scroll state
  // const [chillaScrolledToEnd, setChillaScrolledToEnd] = useState(false);

  // Scroll handler for Chilla slider
  const handleChillaScroll = () => {
    const el = chillaSliderRef.current;
    if (!el) return;
    // Check if scrolled to end (allowing 2px tolerance)
    setChillaScrolledToEnd(el.scrollLeft + el.offsetWidth >= el.scrollWidth - 2);
  };

  // Suv va ichimliklar bo‘limi
  const suvIchimliklar = productsState.filter(
    p => p.category?.category === "Suv va ichimliklar"
  );

  // Shirinliklar bo‘limi
  const shirinliklar = productsState.filter(
    p => p.category?.category === "Shirinliklar"
  );

  // Chinniyu chiroq bo‘limi
  const chinniyuChiroq = productsState.filter(
    p => p.category?.category === "Chinniyu chiroq"
  );

  // Kir yuvish uchun subkategoriyasi
  const kirYuvish = chinniyuChiroq.filter(
    p => p.subcategory?.subcategory === "Kir yuvish uchun"
  );

  const CATEGORY_LIST = [
    "Aktual takliflar",
    "Sabzavot va mevalar",
    "Haftaning super narxi",
    "Tayyor ovqat",
    "Sut mahsulotlari",
    "Sizga yoqadi",
    "Go'sht va parrandalar",
    "Dengiz mahsulotlari",
    "Suv va ichimliklar",
    "Shirinlik sevuvchilar",
    "Shirinliklar",
    "Oziq-ovqat mollari",
    "Non mahsulotlari",
    "Muzlatilgan mahsulotlar va muzqaymoq",
    "Turli xil konservalar",
    "Bolalar uchun",
    "Uy hayvonlari uchun",
    "Gigiyena va parvarish",
    "Chinniyu chiroq",
    "Ro'zg'or uchun"
  ];

  // Sliderda ko‘rsatiladigan rasm massivini tuzing
  const aktualSliderImages = ['/src/assets/aktual_1.png',
    // boshqa rasm yo‘llarini ham qo‘shing
  ];

  // Subkategoriya nomlarini API-dan mahsulotlar orqali olish
  const aktualSubcategories = Array.from(
    new Set(
      productsState
        .filter(p => p.category?.category === "Aktual takliflar")
        .map(p => p.subcategory?.subcategory)
        .filter(Boolean)
    )
  );

  // Modalda ko‘rsatiladigan mahsulotlar (subkategoriya bo‘yicha filter)
  const aktualModalProducts = productsState.filter(
    p =>
      p.category?.category === "Aktual takliflar" &&
      (aktualActiveSub ? p.subcategory?.subcategory === aktualActiveSub : true)
  );

  // Modalni yopish funksiyasi (animatsiya bilan)
  const closeAktualModal = () => {
    setAktualModalHide(true);
    setTimeout(() => {
      setShowAktualSlider(false);
      setAktualModalHide(false);
    }, 2000); // 2 sekund
  };

  // Narxni olish uchun universal funksiya
  const getProductPrice = (product) => product.selling_price ?? product.price ?? 0;

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
            const originalPrice = getProductPrice(product);
            const discount = product.discount_log?.find(d => d.status === "active");
            const discountedPrice = discount
              ? (originalPrice - (originalPrice * discount.percent / 100)).toFixed(0)
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
                const originalPrice = getProductPrice(product);
                const discount = product.discount_log?.find(d => d.status === "active");
                const discountedPrice = discount
                  ? (originalPrice - (originalPrice * discount.percent / 100)).toFixed(0)
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


      {/* UNIVERSAL CATEGORY RENDERING */}
      {CATEGORY_LIST.map((categoryName, idx) => {
        if (categoryName === "Aktual takliflar") {
          return (
            <div key={categoryName} className="product-section">
              <h2 className="section-title">{categoryName}</h2>
              {/* TOP QISM: 2 ta rasm */}
              <div className='container'>
              <div className="aktual-top-row" style={{ display: 'flex', gap: 16, }}>
                <div
                  className="aktual-card"
                  style={{ cursor: 'pointer', width: '100%' }}
                  onClick={() => setShowAktualSlider(true)}
                >
                  <img
                    src={aktualImg1}
                    alt="Aktual takliflar"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '16px' }}
                  />
                  </div>
                <div
                  className="aktual-card"
                  style={{ cursor: 'pointer', width: '100%' }}
                  onClick={() => setShowAktualSlider(true)}
                >
                  <img
                    src={soglomImg}
                    alt="Sog'lom turmush"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '16px' }}
                  />
                </div>
              </div>
              {/* BOTTOM QISM: 3 ta rasm (hozircha bitta, qolganini siz qo‘shasiz) */}
              <div className="aktual-bottom-row" style={{ display: 'flex', gap: 16 }}>
                    
                  
                <div
                  className="aktual-card"
                    style={{ width: '100%', height: '130px', objectFit: 'cover', borderRadius: '16px', background : '#f0f0f0' }}
                  onClick={() => setShowAktualSlider(true)}
                  >
                  <img
                    src={yangiliklarImg}
                    alt="Sog'lom turmush"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '16px' }}
                    />
                    </div>
                <div
                  className="aktual-card"
                  style={{ cursor: 'pointer', width: '100%' }}
                  onClick={() => setShowAktualSlider(true)}
                  >
                  <img
                    src={arzon}
                    alt="Sog'lom turmush"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '16px' }}
                    />
                    </div>
                <div
                  className="aktual-card"
                  style={{ cursor: 'pointer', width: '100%' }}
                  onClick={() => setShowAktualSlider(true)}
                  >
                  <img
                    src={karzinka_yoz}
                    alt="Sog'lom turmush"
                    style={{ width: '100%', height: '130px', objectFit: 'cover', borderRadius: '16px' }}
                    />
                    </div>
                </div>
              </div>
              </div>
          );
        }

        return (
          <div key={categoryName} className="product-section">
            <h2 className="section-title">{categoryName}</h2>
            {["Chilla", "Haftaning super narxi", "Sizga yoqadi", "Shirinlik sevuvchilar"].includes(categoryName) ? (
              <div className="slider-section" style={{ display: 'flex', flexDirection: 'row', gap: '10px', overflowX: 'auto', alignItems: 'center', justifyContent: 'flex-start', width: '100%' }}>
                {productsState
                  .filter(product => product.category?.category === categoryName)
                  .map(product => (
                    <div key={product._id} className="product-card" style={{ cursor: 'pointer', minWidth: 130, maxWidth: 180 }} onClick={() => handleProductClick(product)}>
                      <img
                        src={product.image_log?.find(img => img.isMain)?.image_url || product.image_url || "/default-image.jpg"}
                        alt={product.product_name || "Mahsulot rasmi"}
                        className="product-image"
                        style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '10px' }}
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
            ) : (
              <div className="only-image-row" style={{ display: 'flex', flexDirection: 'row', gap: '10px', overflowX: 'auto', alignItems: 'center', justifyContent: 'flex-start', width: '100%' }}>
                {productsState
                  .filter(product => product.category?.category === categoryName)
                  .map(product => (
                    <div key={product._id} style={{ cursor: 'pointer', minWidth: 130, maxWidth: 180 }} onClick={() => handleProductClick(product)}>
                      <img
                        src={product.image_log?.find(img => img.isMain)?.image_url || product.image_url || "/default-image.jpg"}
                        alt={product.product_name || "Mahsulot rasmi"}
                        className="product-image"
                        style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '10px' }}
                      />
                    </div>
                  ))}
              </div>
            )}
          </div>
        );
      })}

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
                        ? (originalPrice - (originalPrice * discount.percent / 100)).toFixed(0)
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
      )},

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
                background: '#d40808ff',
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
                const originalPrice = getProductPrice(product);
                const discount = product.discount_log?.find(d => d.status === "active");
                const discountedPrice = discount
                  ? (originalPrice - (originalPrice * discount.percent / 100)).toFixed(0)
                  : null;
                return (
                  <div
                    key={product._id}
                    className="product-card"
                    style={{ marginBottom: 16, }}
                    onClick={() => handleDiscountProductClick(product)}
                  >
                    <img
                      src={product.image_log?.find(img => img.isMain)?.image_url || product.image_url || "/default-image.jpg"}
                      alt={product.product_name}
                      className="discount-product-img"
                    />
                    <div className="product-details">
                      {discountedPrice ? (
                        <div className='narx'>
                          <span className="price discounted-price" style={{ fontSize: '14px' }}>{discountedPrice} so'm</span>
                          <span className="price original-price" style={{ fontSize: '12px' }}>{originalPrice} so'm</span>
                        </div>
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

      {/* Modal va slider */}
      {showAktualSlider && (
        <div
          className={`modal-overlay${aktualModalHide ? ' hide' : ''}`}
          onClick={closeAktualModal}
        >
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '100%', padding: 0 }}>
            {/* Header */}
            <div className='aktual-header' style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-around',
              padding: '10px',
              borderBottom: '1px solid #f0f0f0',
              background: '#d61515ff',
            }}>

              <button
                className="aktual-close-btn"
                onClick={closeAktualModal}
                style={{ background: 'none', border: 'none', fontSize: 22 }}
              >
                ←
              </button>

              <div style={{ flexGrow: 1, textAlign: 'center' }}>
                <span style={{ fontWeight: 700, fontSize: 18 }}>Korzinka Katalogi</span>
              </div>

              <button style={{ background: 'none', border: 'none', fontSize: 22 }}>
                <span role="img" aria-label="search">🔍</span>
              </button>

            </div>
            {/* Subkategoriya buttonlari */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px',
              padding: '12px 16px',
              background: '#fff',
              borderBottom: '1px solid #f0f0f0'
            }}>
              <button
                className={`subcat-btn${aktualActiveSub === '' ? ' active' : ''}`}
                style={{
                  padding: '8px 16px',
                  borderRadius: '18px',
                  border: 'none',
                  background: aktualActiveSub === '' ? '#f5f5f5' : '#fff',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
                onClick={() => setAktualActiveSub('')}
              >
                Hammasi
              </button>
              {aktualSubcategories.map(sub => (
                <button
                  key={sub}
                  className={`subcat-btn${aktualActiveSub === sub ? ' active' : ''}`}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '18px',
                    border: 'none',
                    background: aktualActiveSub === sub ? '#f5f5f5' : '#fff',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                  onClick={() => setAktualActiveSub(sub)}
                >
                  {sub}
                </button>
              ))}
            </div>
            {/* Mahsulotlar grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 16,
              padding: 16,
              background: '#fff'
            }}>
              {aktualModalProducts.length === 0 ? (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#888', padding: 24 }}>
                  Mahsulot topilmadi
                </div>
              ) : (
                aktualModalProducts.map(product => {
                  const originalPrice = getProductPrice(product);
                  const discount = product.discount_log?.find(d => d.status === "active");
                  const discountedPrice = discount
                    ? (originalPrice - (originalPrice * discount.percent / 100)).toFixed(0)
                    : null;
                  return (
                    <div
                      key={product._id}
                      className="product-card"
                      style={{ marginBottom: 16, cursor: 'pointer' }}
                      onClick={() => {
                        setAktualModalHide(true);
                        setTimeout(() => {
                          setShowAktualSlider(false);
                          setAktualModalHide(false);
                          handleProductClick(product);
                        }, 200);
                      }}
                    >
                      <img
                        src={product.image_log?.find(img => img.isMain)?.image_url || product.image_url || "/default-image.jpg"}
                        alt={product.product_name}
                        className="discount-product-img"
                        style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '10px' }}
                      />
                      <div className="product-details">
                        {discountedPrice ? (
                          <>
                            <span className="price discounted-price" style={{ fontSize: '14px', color: '#e6002d', fontWeight: 700 }}>{discountedPrice} so'm</span>
                            <span className="price original-price" style={{ fontSize: '12px', textDecoration: 'line-through', color: '#888' }}>{originalPrice} so'm</span>
                          </>
                        ) : (
                          <span className="price" style={{ fontSize: '14px' }}>{originalPrice} so'm</span>
                        )}
                        <h3 className="product-name" style={{ fontSize: 13, margin: '4px 0' }}>{product.product_name}</h3>
                        <p className="weight" style={{ fontSize: 12, color: '#888' }}>{product.unit_description || ""}</p>
                        <button className="add-to-cart" style={{
                          width: '89%',
                          padding: '6px 0',
                          borderRadius: '5px',
                          border: 'none',
                          background: 'white',
                          fontWeight: 600,
                          marginTop: 6,
                          cursor: 'pointer'
                        }}>Savat
                        ga</button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
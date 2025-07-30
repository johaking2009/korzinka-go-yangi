import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../assets/style.css';
import products from '../../assets/products.json';
import { CgMenuMotion } from "react-icons/cg";

// import gallery from '../../assets/gallery.json';

function Home() {
  const [productsState, setProductsState] = useState(products);
  const [modalOpen, setModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null); // MODAL uchun

  useEffect(() => {
    console.log('Mahsulotlar:', productsState);
  }, [productsState]);

  // Nominatim API orqali qidiruv
  const handleSearch = (e) => {
    setSearch(e.target.value);
    if (e.target.value.length > 2) {
      fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(e.target.value)}`)
        .then(res => res.json())
        .then(data => setSuggestions(data));
    } else {
      setSuggestions([]);
    }
  };

  // Qidiruv inputi uchun handler
  const handleProductSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    if (value.length > 0) {
      const filtered = products.filter(product =>
        product.product_name?.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  // Mahsulot bosilganda modal ochish
  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  // Modalni yopish
  const handleCloseProductModal = () => {
    setSelectedProduct(null);
  };

  useEffect(() => {
    if (selectedProduct) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    // Tozalash
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedProduct]);

  if (!Array.isArray(productsState) || productsState.length === 0) {
    return <div>Hech qanday mahsulot topilmadi</div>;
  }

  return (
    <div className="home">
      {/* Header with Location and Search */}
      <div className="header">
        <div className='menu_icon' onClick={() => setMenuOpen(true)}><CgMenuMotion /></div>
        <span className="location" onClick={() => setModalOpen(true)} style={{ cursor: 'pointer' }}>
          Namuna 3-tor ko'chasi, 3
        </span>
      </div>
      <input
        type="text"
        placeholder="Do'kondan topish"
        className="search-bar"
        value={search}
        onChange={handleProductSearch}
        autoComplete="off"
      />
      {/* Qidiruv natijalari */}
      {search.length > 0 && (
        <div className="search-suggestions" style={{ background: "#fff", borderRadius: 8, boxShadow: "0 2px 8px #eee", margin: "0 10px", position: "absolute", zIndex: 10, width: "calc(100% - 20px)" }}>
          {suggestions.length === 0 ? (
            <div style={{ padding: 12, color: "#888" }}>Hech narsa topilmadi</div>
          ) : (
            suggestions.map(product => (
              <div key={product._id} style={{ display: "flex", alignItems: "center", gap: 10, padding: 10, borderBottom: "1px solid #f0f0f0" }}>
                <img src={product.image_log?.find((img)=> img.isMain)?.image_url || product.image_url || "/default-image.jpg"}
                  alt={product.product_name}
                  style={{ width: 40, height: 40, borderRadius: 8, objectFit: "cover" }}
                />
                <span>{product.product_name}</span>
              </div>
            ))
          )}
        </div>
      )}

      {/* MENU DRAWER */}
      {menuOpen && (
        <div className="menu-drawer-overlay" onClick={() => setMenuOpen(false)}>
          <div className="menu-drawer" onClick={e => e.stopPropagation()}>
            <div style={{ background: '#19b394', color: '#fff', padding: '18px 16px', fontWeight: 600, fontSize: '18px' }}>
              Avtorizatsiya
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ padding: '16px', borderBottom: '1px solid #eee' }}>To‘lov usullari</li>
              <li style={{ padding: '16px', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <img src="https://upload.wikimedia.org/wikipedia/commons/6/6e/Korzinka_logo.png" alt="Korzinka Plus" style={{ width: 24, height: 24 }} />
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

      {/* MODAL */}
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

      {/* Category Icons */}
      <div className="category-icons">
        <button className="icon-btn"><strong>%</strong> <span>Chegirmalar</span></button>
        <button className="icon-btn"><strong>❤️</strong> <span>Saralangan</span></button>
        <button className="icon-btn"><strong>↻</strong> <span>Avvalgi xaridlar</span></button>
        <button className="icon-btn"><strong>QR</strong> <span>QR kod</span></button>
      </div>

      {/* Promotions */}
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

      {/* Chilla */}
      <div className="product-section">
        <h2 className="section-title">Chilla</h2>
        <div className="product-slider" >
          {productsState
            .filter(product => product._id >= 1 && product._id <= 6)
            .map((product) => {
              const discount = product.discount_log?.find((d) => d.status === "active");
              const originalPrice = product.price || 0;
              const discountedPrice = discount
                ? (originalPrice - (originalPrice * discount.percent / 100)).toFixed(2)
                : null;

              return (
                <div key={product._id} className="product-card" onClick={() => handleProductClick(product)} style={{cursor: "pointer"}}>
                  <img src={product.image_log?.find((img)=> img.isMain)?.image_url || "/default-image.jpg"}
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

      {/* Aktual takliflar */}
      <div className="image-gallery-section">
        <h2 className="section-title">Aktual takliflar</h2>
        <div className="universal-gallery" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', }}>
          <div className="row">
            {productsState
              .filter(item => ["7", "8"].includes(item._id))
              .map(item => (
                <div key={item._id} style={{ textAlign: 'center' }}>
                  <img
                    src={item.image_log?.find((img)=> img.isMain)?.image_url || item.image_url || "/default-image.jpg"}
                    alt={item.product_name}
                    onClick={() => handleProductClick(item)}
                    style={{cursor: "pointer"}}
                  />
                  <div style={{ marginTop: '0px' }}>{item.product_name}</div>
                </div>
              ))}
          </div>
          <div className="row">
            {productsState
              .filter(item => ["9", "10", "11"].includes(item._id))
              .map(item => (
                <div key={item._id} style={{ textAlign: 'center' }}>
                  <img
                    src={item.image_log?.find((img)=> img.isMain)?.image_url || item.image_url || "/default-image.jpg"}
                    alt={item.product_name}
                    onClick={() => handleProductClick(item)}
                    style={{cursor: "pointer"}}
                  />
                  <div style={{ marginTop: '8px' }}>{item.product_name}</div>
                </div>
              ))}
          </div>
        </div>
      </div>
      {/* Sabzavot va mevalar*/}
      <div className="Tabiy-mahsulotlar section-title">
        <h2>Sabzavot va mevalar</h2>
        {/* Faqat _id 6 va 7 bo'lgan rasmlar */}
        <div className="sabzavot-gallery" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
          {productsState
            .filter(item =>
              (item._id === "12" || item._id === "13") &&
              item.product_name !== "Чай зеленый"
            )
            .map(item => (
              <div key={item._id}>
                <img
                  src={ item.image_log?.find((img)=> img.isMain)?.image_url ||
                    item.image_url ||
                    "/default-image.jpg"
                  }
                  alt={item.product_name}
                  style={{borderRadius: '10px', cursor: "pointer" }}
                  onClick={() => handleProductClick(item)}
                />
                <div style={{ textAlign: 'center', marginTop: '8px' }}>{item.product_name}</div>
              </div>
            ))}
        </div>
      </div>
      <div className='eng-aron-mahsulotlar'>
        <h2 className='section-title'>Haftaning super narxi</h2>
        <div className="super-price-slider" >
          {productsState
            .filter(product => {
              const id = Number(product._id);
              return id >= 14 && id <= 19; }) .map(product=> {
                const discount = product.discount_log?.find((d) => d.status === "active");
                const originalPrice = product.price || 0;
                const discountedPrice = discount
                  ? (originalPrice - (originalPrice * discount.percent / 100)).toFixed(2)
                  : null;

                return (
                  <div key={product._id} className="product-card" onClick={() => handleProductClick(product)} style={{cursor: "pointer"}}>
                    <img src={product.image_log?.find((img)=> img.isMain)?.image_url || product.image_url || "/default-image.jpg"}
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
                );
              })}
        </div>
      </div>



      <div className='tayyor-mahsulotlar' >
        <h2 className='section-title'>Tayyor ovqat</h2>
      <div className="tayyor-mahsulot-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', padding: '10px' }}>
        {productsState
          .filter(product => product._id === "20")
          .map(product => (
            <div key={product._id} className="tayyor-mahsulot-card" style={{ textAlign: 'center', cursor: "pointer" }} onClick={() => handleProductClick(product)}>
              <img src={product.image_log?.find((img)=> img.isMain)?.image_url || product.image_url || "/default-image.jpg"}
                alt={product.product_name || "Mahsulot rasmi"}
                style={{ width: '345px', height: '110px', objectFit: 'cover', borderRadius: '15px' }}
              />
              <div style={{ marginTop: '8px' }}>{product.product_name}</div>
            </div>
          ))}
      </div>
      </div>

      <div className="sut-mahsulotlari">
        <h2 className="section-title">Sut mahsulotlari</h2>
        <div className="sut-gallery"
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
          <div className="sut-gallery-row" style={{ display: 'flex', gap: '10px', padding: '10px', borderRadius: '10px' }}>
            {productsState
            .filter(item => ["21", "22", "23"].includes(item._id))
            .map(item => (
            <div key={item._id} style={{ cursor: "pointer" }} onClick={() => handleProductClick(item)}>
              <img
                src={item.image_log?.find(img => img.isMain)?.image_url || item.image_url || "/default-image.jpg"}
                alt={item.product_name || "Sut mahsuloti"}
                style={{ borderRadius: '10px', objectFit: 'cover', cursor: "pointer" }}
              />
              <div style={{ textAlign: 'center', marginTop: '8px' }}>{item.product_name}</div>
            </div>
            ))}
          </div>
          <div className="sut-gallery-item" style={{ display: 'flex', gap: '10px' }}>
            {productsState
            .filter(item => ["24", "25", "26"].includes(item._id))
            .map(item => (
            <div key={item._id} style={{ cursor: "pointer" }} onClick={() => handleProductClick(item)}>
              <img
                src={item.image_log?.find(img => img.isMain)?.image_url || item.image_url || "/default-image.jpg"}
                alt={item.product_name || "Sut mahsuloti"}
                style={{ borderRadius: '10px', objectFit: 'cover', cursor: "pointer" }}
              />
              <div style={{ textAlign: 'center', marginTop: '8px' }}>{item.product_name}</div>
            </div>
            ))}
          </div>
        </div>
      </div>

      <div className='Sizga-yoqadi'>
        <h2 className='section-title'>Sizga-yoqadi</h2>
      </div>

      <div className="sizga-yoqadi-slider" style={{zIndex: 1}}>
        {productsState
          .filter(product => {
            const id = Number(product._id);
            return id >= 27 && id <= 31; // kerakli id larni moslang
          })
          .map(product => (
            <div key={product._id} className="product-card" onClick={() => handleProductClick(product)} style={{cursor: "pointer"}}>
              <img
                src={product.image_log?.find((img) => img.isMain)?.image_url || product.image_url || "/default-image.jpg"}
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

      {/* Go'sht va parrandalar */}

      <div className='goshtlar'>
        <h2 className='section-title'>Go'sht va parrandalar</h2>
          <div className="gosht-gallery" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            {productsState
            .filter(item =>
            (item._id === "32" || item._id === "33") &&
            item.product_name !== "Чай зеленый"
            )
            .map(item => (
            <div key={item._id} style={{ cursor: "pointer" }} onClick={() => handleProductClick(item)}>
              <img src={ item.image_log?.find((img)=> img.isMain)?.image_url ||
              item.image_url ||
              "/default-image.jpg"
              }
              alt={item.product_name}
              style={{borderRadius: '10px', cursor: "pointer" }}
              />
              <div style={{ textAlign: 'center', marginTop: '8px' }}>{item.product_name}</div>
            </div>
            ))}
          </div>
      </div>

      {/* Dengiz mahsulotlari */}

      <div className='dengiz-mahsulotlari'>
        <h2 className='section-title'>Dengiz mahsulotlari</h2>
        <div className="gosht-gallery"
          style={{ display: 'flex',  }}>
          <div className="gosht-row" style={{ display: 'flex', gap: '10px' }}>
            {productsState
              .filter(item => ["34", "35", "36"].includes(item._id))
              .map(item => (
                <div key={item._id} style={{ textAlign: 'center', cursor: "pointer" }} onClick={() => handleProductClick(item)}>
                  <img src={item.image_url || "/default-image.jpg" }
                    alt={item.product_name || "Go'sht mahsuloti" }
                    style={{borderRadius: '10px', objectFit: 'cover', cursor: "pointer" }}
                  />
                  <div style={{ marginTop: '8px' }}>{item.product_name}</div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Suv va chimliklar */}

      <div className='ichimliklar'>
        <h2 className='section-title'>Suv va chimliklar</h2>
        <div className="universal-gallery" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center',}}>
            <div className="image-gallery">
              <div className="row">
                {productsState
                  .filter(item => item._id === "37" || item._id === "38")
                  .map(item => (
                    <img
                      key={item._id}
                      src={item.image_url || "/default-image.jpg"}
                      alt={item.product_name || "Mahsulot rasmi"}
                      style={{ cursor: "pointer" }}
                      onClick={() => handleProductClick(item)}
                    />
                  ))}
              </div>
              <div className="row">
                {productsState
                  .filter(item => item._id === "39" || item._id === "40" || item._id === "41")
                  .map(item => (
                    <img
                      key={item._id}
                      src={item.image_url || "/default-image.jpg"}
                      alt={item.product_name || "Mahsulot rasmi"}
                      style={{ cursor: "pointer" }}
                      onClick={() => handleProductClick(item)}
                    />
                  ))}
              </div>
            </div>
          </div>
      </div>

      {/* Shirinlik sevuvchilar */}

      <div className='shirinlik-sevuvchilar'></div>
      <h2 className='section-title'>Shirinlik sevuvchilar</h2>
      <div className="sizga-yoqadi-slider">
        {productsState
          .filter(product => {
            const id = Number(product._id);
            return id >= 42 && id <=47; // kerakli id larni moslang
          })
          .map(product => (
            <div key={product._id} className="product-card" onClick={() => handleProductClick(product)} style={{cursor: "pointer"}}>
              <img
                src={product.image_log?.find((img) => img.isMain)?.image_url || product.image_url || "/default-image.jpg"}
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

      {/* Shirinliklar */}

      <div className='shirinlikar'>
      <h2 className='section-title'>Shirinliklar</h2>
      <div className="shirinlik-gallery"
          style={{ display: 'flex', flexDirection: 'column', gap: '8px',  padding: '10px' }}>
          <div className="shirinlik-row" style={{ display: 'flex', gap: '10px' }}>
            {productsState  
            .filter(item => ["48", "49", "50"].includes(item._id))
            .map(item => (
            <div key={item._id}>
              <img src={item.image_url || "/default-image.jpg" } alt={item.product_name || "Shirinlik mahsuloti" }
                style={{borderRadius: '10px', objectFit: 'cover', cursor: "pointer" }}
                onClick={() => handleProductClick(item)}
              />
              <div style={{ textAlign: 'center' }}>
              </div>
            </div>
            ))}
          </div>
          <div className="shirinlik-row" style={{ display: 'flex', gap: '10px' }}>
            {productsState
            .filter(item => ["51", "52", "53"].includes(item._id))
            .map(item => (
            <div key={item._id}>
              <img src={item.image_url || "/default-image.jpg" } alt={item.product_name || "Shirinlik mahsuloti" }
                style={{borderRadius: '10px', objectFit: 'cover', cursor: "pointer" }}
                onClick={() => handleProductClick(item)}
              />
              <div style={{ textAlign: 'center', marginTop: '8px' }}>
              </div>
            </div>
            ))}
          </div>
        </div>  
      </div>

      {/* Oziq-ovqat mollari */}


      <div className='Oziq-ovqat'>
      <h2 className='section-title'>Oziq-ovqat mollari</h2>
      <div className="shirinlik-gallery "
          style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center', justifyContent: 'center' }}>
          <div className="shirinlik-row" style={{ display: 'flex', gap: '10px' }}>
            {productsState  
            .filter(item => ["54", "55", "56"].includes(item._id))
            .map(item => (
            <div key={item._id}>
              <img src={item.image_url || "/default-image.jpg" } alt={item.product_name || "Shirinlik mahsuloti" }
                style={{borderRadius: '10px', objectFit: 'cover', cursor: "pointer" }}
                onClick={() => handleProductClick(item)}
              />
              <div style={{ textAlign: 'center' }}>
              </div>
            </div>
            ))}
          </div>
          <div className="shirinlik-row" style={{ display: 'flex', gap: '10px' }}>
            {productsState
            .filter(item => ["57", "58", "59"].includes(item._id))
            .map(item => (
            <div key={item._id}>
              <img src={item.image_url || "/default-image.jpg" } alt={item.product_name || "Shirinlik mahsuloti" }
                style={{borderRadius: '10px', objectFit: 'cover', cursor: "pointer" }}
                onClick={() => handleProductClick(item)}
              />
              <div style={{ textAlign: 'center',  }}>
              </div>
            </div>
            ))}
          </div>
          <div className="shirinlik-row" style={{ display: 'flex', gap: '10px' }}>
            {productsState
            .filter(item => ["60", "61", "62"].includes(item._id))
            .map(item => (
            <div key={item._id}>
              <img src={item.image_url || "/default-image.jpg" } alt={item.product_name || "Shirinlik mahsuloti" }
                style={{borderRadius: '10px', objectFit: 'cover', cursor: "pointer" }}
                onClick={() => handleProductClick(item)}
              />
              <div style={{ textAlign: 'center', marginTop: '8px' }}>
              </div>
            </div>
            ))}
          </div>
        </div>  
      </div>

      {/* Non mahsulotlari */}

      <div className='Oziq-ovqat'>
      <h2 className='section-title'>Non mahsulotlari</h2>
      <div className="shirinlik-gallery"
          style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center', justifyContent: 'center' }}>
          <div className="shirinlik-row" style={{ display: 'flex', gap: '10px' }}>
            {productsState  
            .filter(item => ["63", "64", "65"].includes(item._id))
            .map(item => (
            <div key={item._id}>
              <img src={item.image_url || "/default-image.jpg" } alt={item.product_name || "Shirinlik mahsuloti" }
                style={{borderRadius: '10px', objectFit: 'cover', cursor: "pointer" }}
                onClick={() => handleProductClick(item)}
              />
              <div style={{ textAlign: 'center' }}>
              </div>
            </div>
            ))}
          </div>
        </div>  
      </div>

      {/* Muzlatilgan mahsulotlar va
        muzqaymoq */}

      <div className='goshtlar'>
      <h2 className='section-title'>Muzlatilgan mahsulotlar va
        muzqaymoq</h2>
          <div className="gosht-gallery" style={{ display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'center'}}>
            {productsState
            .filter(item =>
            (item._id === "66" || item._id === "67") &&
            item.product_name !== "Чай зеленый"
            )
            .map(item => (
            <div key={item._id}>
              <img src={ item.image_log?.find((img)=> img.isMain)?.image_url ||
              item.image_url ||
              "/default-image.jpg"
              }
              alt={item.product_name}
              style={{borderRadius: '10px', cursor: "pointer" }}
              onClick={() => handleProductClick(item)}
              />
              <div style={{ textAlign: 'center', marginTop: '8px' }}>{item.product_name}</div>
            </div>
            ))}
          </div>
      </div>

      {/* Turli xil konservalar */}

      <div className='goshtlar'>
      <h2 className='section-title'>Turli xil konservalar</h2>
          <div className="gosht-gallery" style={{ display: 'flex', gap: '10px',  alignItems: 'center', justifyContent: 'center'}}>
            {productsState.filter(item =>
            (item._id === "68" || item._id === "69") &&
            item.product_name !== "Чай зеленый"
            )
            .map(item => (
            <div key={item._id}>
              <img src={ item.image_log?.find((img)=> img.isMain)?.image_url ||
              item.image_url ||
              "/default-image.jpg"
              }
              alt={item.product_name}
              style={{borderRadius: '10px', cursor: "pointer" }}
              onClick={() => handleProductClick(item)}
              />
              <div style={{ textAlign: 'center', marginTop: '8px' }}>{item.product_name}</div>
            </div>
            ))}
          </div>
      </div>

      {/* Bolalar uchun */}

      <div className='ichimliklar'>
      <h2 className='section-title'>Bolalar uchun</h2>
      <div className="universal-gallery" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center',}}>
          <div className="image-gallery">
            <div className="row">
              {productsState
                .filter(item => item._id === "70" || item._id === "71")
                .map(item => (
                  <img
                    key={item._id}
                    src={item.image_url || "/default-image.jpg"}
                    alt={item.product_name || "Mahsulot rasmi"}
                    style={{ cursor: "pointer" }}
                    onClick={() => handleProductClick(item)}
                  />
                ))}
            </div>
            <div className="row">
              {productsState
                .filter(item => item._id === "72" || item._id === "73" || item._id === "74")
                .map(item => (
                  <img
                    key={item._id}
                    src={item.image_url || "/default-image.jpg"}
                    alt={item.product_name || "Mahsulot rasmi"}
                    style={{ cursor: "pointer" }}
                    onClick={() => handleProductClick(item)}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Uy hayvonlari uchun */}

      <div className='goshtlar'>
      <h2 className='section-title'>Uy hayvonlari uchun</h2>
          <div className="gosht-gallery" style={{ display: 'flex', gap: '10px',  alignItems: 'center', justifyContent: 'center'}}>
            {productsState
            .filter(item =>
            (item._id === "75" || item._id === "76") &&
            item.product_name !== "Чай зеленый"
            )
            .map(item => (
            <div key={item._id}>
              <img src={ item.image_log?.find((img)=> img.isMain)?.image_url ||
              item.image_url ||
              "/default-image.jpg"
              }
              alt={item.product_name}
              style={{borderRadius: '10px', cursor: "pointer" }}
              onClick={() => handleProductClick(item)}
              />
              <div style={{ textAlign: 'center', marginTop: '8px' }}>{item.product_name}</div>
            </div>
            ))}
          </div>
      </div>

      {/* Gigiyena va parvarish */}

      <div className='ichimliklar'>
        <h2 className='section-title'>Gigiyena va parvarish</h2>
        <div className="universal-gigiyena" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            {/* 1-qator: 2 ta rasm */}
            <div className="gigiyena" style={{ justifyContent: 'center', gap: '10px' }}>
              {productsState.filter(item => item._id === "77").map(item => (
                <div key={item._id} style={{ textAlign: 'center' }}>
                  <img src={item.image_url || "/default-image.jpg"}
                       alt={item.product_name || "Mahsulot rasmi"}
                       style={{borderRadius: '16px', objectFit: 'cover', cursor: "pointer" }}
                       onClick={() => handleProductClick(item)}
                  />
                </div>
              ))}
              {productsState.filter(item => item._id === "78").map(item => (
                <div key={item._id} style={{ textAlign: 'center' }}>
                  <img src={item.image_url || "/default-image.jpg"}
                       alt={item.product_name || "Mahsulot rasmi"}
                       style={{borderRadius: '16px', objectFit: 'cover', cursor: "pointer" }}
                       onClick={() => handleProductClick(item)}
                  />
                </div>
              ))}
            </div>
            {/* 2-qator: 3 ta rasm */}
            <div className="row" style={{ justifyContent: 'center', gap: '10px' }}>
              {productsState.filter(item => item._id === "79").map(item => (
                <div key={item._id} style={{ textAlign: 'center' }}>
                  <img src={item.image_url || "/default-image.jpg"}
                       alt={item.product_name || "Mahsulot rasmi"}
                       style={{borderRadius: '16px', objectFit: 'cover', cursor: "pointer" }}
                       onClick={() => handleProductClick(item)}
                  />
                </div>
              ))}
              {productsState.filter(item => item._id === "80").map(item => (
                <div key={item._id} style={{ textAlign: 'center' }}>
                  <img src={item.image_url || "/default-image.jpg"}
                       alt={item.product_name || "Mahsulot rasmi"}
                       style={{borderRadius: '16px', objectFit: 'cover', cursor: "pointer" }}
                       onClick={() => handleProductClick(item)}
                  />
                </div>
              ))}
              {productsState.filter(item => item._id === "81").map(item => (
                <div key={item._id} style={{ textAlign: 'center' }}>
                  <img src={item.image_url || "/default-image.jpg"}
                       alt={item.product_name || "Mahsulot rasmi"}
                       style={{borderRadius: '16px', objectFit: 'cover', cursor: "pointer" }}
                       onClick={() => handleProductClick(item)}
                  />
                </div>
              ))}
            </div>
            {/* 3-qator: 3 ta rasm, 1-qator o‘lchamida */}
            <div className="gigiyena" style={{ justifyContent: 'center', gap: '10px' }}>
              {productsState.filter(item => item._id === "82").map(item => (
                <div key={item._id} style={{ textAlign: 'center' }}>
                  <img src={item.image_url || "/default-image.jpg"}
                       alt={item.product_name || "Mahsulot rasmi"}
                       style={{ borderRadius: '16px', objectFit: 'cover', cursor: "pointer" }}
                       onClick={() => handleProductClick(item)}
                  />
                </div>
              ))}
              {productsState.filter(item => item._id === "83").map(item => (
                <div key={item._id} style={{ textAlign: 'center' }}>
                  <img src={item.image_url || "/default-image.jpg"}
                       alt={item.product_name || "Mahsulot rasmi"}
                       style={{borderRadius: '16px', objectFit: 'cover', cursor: "pointer" }}
                       onClick={() => handleProductClick(item)}
                  />
                </div>
              ))}
            </div>
        </div>
      </div>

      {/* Chinniyu chiroq */}

      <div className='Oziq-ovqat'>
      <h2 className='section-title'>Chinniyu chiroq</h2>
      <div className="shirinlik-gallery"
          style={{ display: 'flex', flexDirection: 'column', gap: '8px'}}>
          <div className="shirinlik-row" style={{ display: 'flex', gap: '10px' }}>
            {productsState.filter(item => ["84", "85", "86"].includes(item._id))
            .map(item => (
            <div key={item._id}>
              <img src={item.image_url || "/default-image.jpg" } alt={item.product_name || "Shirinlik mahsuloti" }
                style={{borderRadius: '10px', objectFit: 'cover', cursor: "pointer" }}
                onClick={() => handleProductClick(item)}
              />
              <div style={{ textAlign: 'center' }}>
              </div>
            </div>
            ))}
          </div>
        </div>  
      </div>

      {/* Ro'zg'or uchun */}

      <div className='shirinlikar'>
      <h2 className='section-title'>Ro'zg'or uchun</h2>
      <div className="shirinlik-gallery"
          style={{ display: 'flex', flexDirection: 'column', gap: '8px',  padding: '10px' }}>
          <div className="shirinlik-row" style={{ display: 'flex', gap: '10px' }}>
            {productsState  
            .filter(item => ["87", "88", "89"].includes(item._id))
            .map(item => (
            <div key={item._id}>
              <img src={item.image_log?.find(img => img.isMain)?.image_url || item.image_url || "/default-image.jpg"}
                alt={item.product_name || "Shirinlik mahsuloti"}
                style={{borderRadius: '10px', objectFit: 'cover', cursor: "pointer" }}
                onClick={() => handleProductClick(item)}
              />
              <div style={{ textAlign: 'center' }}>{item.product_name}</div>
            </div>
            ))}
          </div>
          <div className="shirinlik-row" style={{ display: 'flex', gap: '10px' }}>
            {productsState
            .filter(item => ["90", "91", "92"].includes(item._id))
            .map(item => (
            <div key={item._id}>
              <img src={item.image_log?.find(img => img.isMain)?.image_url || item.image_url || "/default-image.jpg"}
                alt={item.product_name || "Shirinlik mahsuloti"}
                style={{borderRadius: '10px', objectFit: 'cover', cursor: "pointer" }}
                onClick={() => handleProductClick(item)}
              />
              <div style={{ textAlign: 'center', marginTop: '8px' }}>{item.product_name}</div>
            </div>
            ))}
          </div>
        </div>  
      </div>

      {/* Mahsulot MODAL */}
      {selectedProduct && (
  <div className="modal-overlay" onClick={handleCloseProductModal} style={{zIndex: 100}}>
    <div className="modal-content product-modal" onClick={e => e.stopPropagation()} style={{overflowY: "auto", maxHeight: "95vh"}}>
      <div className="modal-img-wrap">
        <img
          src={
            selectedProduct.image_log?.find((img) => img.isMain)?.image_url ||
            selectedProduct.image_url ||
            "/default-image.jpg"
          }
          alt={selectedProduct.product_name}
          className="modal-product-img"
        />
        <button
          className={`modal-like-btn${selectedProduct.isFavorite ? " liked" : ""}`}
          onClick={() => {
            setSelectedProduct({ ...selectedProduct, isFavorite: !selectedProduct.isFavorite });
            // Saralanganlarga qo'shish logikasini shu yerda yozing (masalan, global state yoki localStorage)
          }}
        >
          <span role="img" aria-label="like" style={{fontSize: 26}}>❤️</span>
        </button>
        <button
          className="modal-close-btn"
          onClick={handleCloseProductModal}
        >
          <span style={{fontSize: 28, fontWeight: 600}}>×</span>
        </button>
      </div>
      <div className="modal-product-body">
        {/* Chegirma badge */}
        {selectedProduct.discount_log?.find(d => d.status === "active") && (
          <div className="modal-discount-badge">
            -{selectedProduct.discount_log.find(d => d.status === "active").percent}%
          </div>
        )}
        <div className="modal-product-title">
          <span className="modal-product-name">{selectedProduct.product_name}</span>
          {selectedProduct.unit_description && (
            <span className="modal-product-weight">
              {selectedProduct.unit_description}
            </span>
          )}
        </div>
        <div className="modal-product_desc">
          {selectedProduct.product_description}
        </div>
        <div className="modal-product-details">
          <div className="modal-product-price">
            {selectedProduct.discount_log?.find(d => d.status === "active") ? (
              <>
                <span className="modal-product-price-new">
                  {selectedProduct.price - (selectedProduct.price * selectedProduct.discount_log.find(d => d.status === "active").percent / 100)} so'm
                </span>
                <span className="modal-product-price-old">
                  {selectedProduct.price} so'm
                </span>
              </>
            ) : (
              <span className="modal-product-price-new">
                {selectedProduct.price} so'm
              </span>
            )}
          </div>
        </div>
        {/* Qo'shimcha info */}
        {selectedProduct.product_ingredients && (
          <div className="modal-product-info">
            <strong>Tarkibi:</strong> {selectedProduct.product_ingredients}
          </div>
        )}
        {selectedProduct.nutritional_value && (
          <div className="modal-product-info">
            <strong>Energiya:</strong>
            <ul>
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
        <button className="modal-add-to-cart-btn">Savatchaga qo'shish</button>

        {/* O'xshash mahsulotlar */}
        <div style={{marginTop: 24}}>
          <h3 style={{fontSize: 18, marginBottom: 8}}>O‘xshash mahsulotlar</h3>
          <div style={{display: "flex", gap: 12, overflowX: "auto"}}>
            {productsState
              .filter(
                p =>
                  p._id !== selectedProduct._id &&
                  p.product_name &&
                  selectedProduct.product_name &&
                  p.product_name.toLowerCase().includes(
                    selectedProduct.product_name.split(" ")[0].toLowerCase()
                  )
              )
              .slice(0, 8)
              .map(p => (
                <div
                  key={p._id}
                  style={{
                    minWidth: 100,
                    background: "#f7f7f7",
                    borderRadius: 8,
                    padding: 8,
                    textAlign: "center",
                    cursor: "pointer"
                  }}
                  onClick={() => handleProductClick(p)}
                >
                  <img
                    src={p.image_log?.find(img => img.isMain)?.image_url || p.image_url || "/default-image.jpg"}
                    alt={p.product_name}
                    style={{width: 80, height: 80, objectFit: "cover", borderRadius: 6}}
                  />
                  <div style={{fontSize: 13, marginTop: 6}}>{p.product_name}</div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  </div>
)}
    </div>
  );
}

export default Home;
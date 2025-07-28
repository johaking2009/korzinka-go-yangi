import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../assets/style.css';
import products from '../../assets/products.json';
// import gallery from '../../assets/gallery.json';

function Home() {
  const [productsState, setProductsState] = useState(products);

  useEffect(() => {
    console.log('Mahsulotlar:', productsState);
  }, [productsState]);

  if (!Array.isArray(productsState) || productsState.length === 0) {
    return <div>Hech qanday mahsulot topilmadi</div>;
  }

  return (
    <div className="home">
      {/* Header with Location and Search */}
      <div className="header">
        <span className="location">Namuna 3-tor ko'chasi, 3</span>
        <input type="text" placeholder="Do'kondan topish" className="search-bar" />
      </div>

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

      {/* Product Slider Section */}
      <div className="product-section">
        <h2 className="section-title">Chilla</h2>
        <div className="product-slider">
          {productsState
            .filter(product => product._id && product.product_name && product.price)
            .map((product) => {
              const discount = product.discount_log?.find((d) => d.status === "active");
              const originalPrice = product.price || 0;
              const discountedPrice = discount
                ? (originalPrice - (originalPrice * discount.percent / 100)).toFixed(2)
                : null;

              return (
                <div key={product._id} className="product-card">
                  <img
                    src={product.image_log?.find((img) => img.isMain)?.image_url || "/default-image.jpg"}
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

      {/* Qo‘shimcha Qism: Rasmlar Bo‘limi */}
      <div className="image-section">
        <h2 className="section-title">Aktual takliflar</h2>
        <div className="image-gallery">
          <div className="row">
            {productsState.slice(0, 2).map(item => (
              <img
                key={item._id}
                src={item.image_log?.find((img) => img.isMain)?.image_url || "/default-image.jpg"}
                alt={item.product_name}
              />
            ))}
          </div>
          <div className="row">
            {productsState.slice(2, 5).map(item => (
              <img
                key={item._id}
                src={item.image_log?.find((img) => img.isMain)?.image_url || "/default-image.jpg"}
                alt={item.product_name}
              />
            ))}
          </div>
        </div>
      </div>
      {/* Sabzavot va mevalar*/}
      <div className="Tabiy-mahsulotlar section-title">
        <h2>Sabzavot va mevalar</h2>
        {/* Faqat _id 6 va 7 bo'lgan rasmlar */}
        <div className="sabzavot-gallery" style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
          {productsState
            .filter(item =>
              (item._id === "6" || item._id === "7") &&
              item.product_name !== "Чай зеленый"
            )
            .map(item => (
              <div key={item._id}>
                <img
                  src={
                    item.image_log?.find((img) => img.isMain)?.image_url ||
                    item.image_url ||
                    "/default-image.jpg"
                  }
                  alt={item.product_name}
                  style={{ width: '200px', borderRadius: '10px' }}
                />
                <div style={{ textAlign: 'center', marginTop: '8px' }}>{item.product_name}</div>
              </div>
            ))}
        </div>
      </div>
        <div className='eng-aron-mahsulotlar'>
           <h2 className='section-title'>Haftaning super narxi</h2>
           <div className="product-slider">
          {productsState
            .filter(product => product._id && product.product_name && product.price)
            .map((product) => {
              const discount = product.discount_log?.find((d) => d.status === "active");
              const originalPrice = product.price || 0;
              const discountedPrice = discount
                ? (originalPrice - (originalPrice * discount.percent / 100)).toFixed(2)
                : null;

              return (
                <div key={product._id} className="product-card">
                  <img
                    src={product.image_log?.find((img) => img.isMain)?.image_url || "/default-image.jpg"}
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
  );
}

export default Home;
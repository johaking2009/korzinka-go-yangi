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
      .filter(product => product._id >= 1 && product._id <= 6)
      .map((product) => {
      const discount = product.discount_log?.find((d) => d.status === "active");
      const originalPrice = product.price || 0;
      const discountedPrice = discount
      ? (originalPrice - (originalPrice * discount.percent / 100)).toFixed(2)
      : null;

      return (
      <div key={product._id} className="product-card">
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

  {/* Qo‘shimcha Qism: Rasmlar Bo‘limi */}
  <div className="image-gallery-section">
  <h2 className="section-title">Aktual takliflar</h2>
  <div className="universal-gallery">
    <div className="row">
      {productsState
        .filter(item => ["7", "8", "9"].includes(item._id))
        .map(item => (
          <div key={item._id} style={{ textAlign: 'center' }}>
            <img
              src={item.image_log?.find((img)=> img.isMain)?.image_url || item.image_url || "/default-image.jpg"}
              alt={item.product_name}
            />
            <div style={{ marginTop: '8px' }}>{item.product_name}</div>
          </div>
        ))}
    </div>
    <div className="row">
      {productsState
        .filter(item => ["10", "11"].includes(item._id))
        .map(item => (
          <div key={item._id} style={{ textAlign: 'center' }}>
            <img
              src={item.image_log?.find((img)=> img.isMain)?.image_url || item.image_url || "/default-image.jpg"}
              alt={item.product_name}
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
    <div className="sabzavot-gallery" style={{ display: 'flex',  gap: '10px', marginTop: '15px' }}>
      {productsState
      .filter(item =>
      (item._id === "12" || item._id === "13") &&
      item.product_name !== "Чай зеленый"
      )
      .map(item => (
      <div key={item._id}>
        <img src={ item.image_log?.find((img)=> img.isMain)?.image_url ||
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
    <div className="super-price-slider">
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
        <div key={product._id} className="product-card">
          <img src={product.image_log?.find((img)=> img.isMain)?.image_url || product.image_url || "/default-image.jpg"}
          alt={product.product_name || "Mahsulot rasmi"}
          className="product-image"
          />
          <div className="product-details">
            <span className="price">
              {discountedPrice ? (
              <>
                <span className="discounted-price">{discountedPrice} so'm</span>
                <span className="original-price">{originalPrice} so'm</span>
              </>
              ) : (
              <>{originalPrice} so'm</>
              )}
            </span>
            <h3 className="product-name">{product.product_name || "Noma'lum mahsulot"}</h3>
            <p className="weight">Og'irligi: {product.unit_description || "Noma'lum"}</p>
            <button className="add-to-cart">Savata</button>
          </div>
        </div>
        );
        })}
    </div>
  </div>
  <div className='tayyor-mahsulotlar'>
    <h2 className='section-title'>Tayyor ovqat</h2>
    {productsState
      .filter(product => product._id === "20")
      .map(product => (
        <div key={product._id} className="tayyor-mahsulot-card" style={{ textAlign: 'center' }}>
          <img src={product.image_log?.find((img)=> img.isMain)?.image_url || product.image_url || "/default-image.jpg"}
            alt={product.product_name || "Mahsulot rasmi"}
            style={{ width: '410px', height: '110px', objectFit: 'cover', borderRadius: '15px' }}
          />
          <div style={{ marginTop: '8px' }}>{product.product_name}</div>
        </div>
      ))}
  </div>

  <div className="sut-mahsulotlari">
    <h2 className="section-title">Sut mahsulotlari</h2>
    <div className="sut-gallery"
      style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px', padding: '10px' }}>
      <div className="sut-gallery-row" style={{ display: 'flex', gap: '10px' }}>
        {productsState
        .filter(item => ["21", "22", "23"].includes(item._id))
        .map(item => (
        <div key={item._id}>
          <img src={item.image_url || "/default-image.jpg" } alt={item.product_name || "Sut mahsuloti" }
            style={{ width: '130px', height:'130px', borderRadius: '10px', objectFit: 'cover', }} />
          <div style={{ textAlign: 'center', marginTop: '8px' }}>
          </div>
        </div>
        ))}
      </div>
      <div className="sut-gallery-row" style={{ display: 'flex', gap: '10px' }}>
        {productsState
        .filter(item => ["24", "25", "26"].includes(item._id))
        .map(item => (
        <div key={item._id}>
          <img src={item.image_url || "/default-image.jpg" } alt={item.product_name || "Sut mahsuloti" }
            style={{ width: '130px', height:'130px', borderRadius: '10px', objectFit: 'cover', }} />
          <div style={{ textAlign: 'center', marginTop: '8px' }}>
          </div>
        </div>
        ))}
      </div>
    </div>
  </div>

  <div className='Sizga-yoqadi'>
<h2 className='section-title'>Sizga-yoqadi</h2>
</div>

<div className="sizga-yoqadi-slider">
  {productsState
    .filter(product => {
      const id = Number(product._id);
      return id >= 27 && id <= 31; // kerakli id larni moslang
    })
    .map(product => (
      <div key={product._id} className="product-card">
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

<div className='goshtlar'>
<h2 className='section-title'>Go'sht va parrandalar</h2>
    <div className="gosht-gallery" style={{ display: 'flex', gap: '10px', marginTop: '15px', padding: '10px' }}>
      {productsState
      .filter(item =>
      (item._id === "32" || item._id === "33") &&
      item.product_name !== "Чай зеленый"
      )
      .map(item => (
      <div key={item._id}>
        <img src={ item.image_log?.find((img)=> img.isMain)?.image_url ||
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

<div className='dengiz-mahsulotlari'>
<h2 className='section-title'>Dengiz mahsulotlari</h2>
  <div className="gosht-gallery"
    style={{ display: 'flex', gap: '15px', marginTop: '15px', padding: '10px' }}>
    <div className="gosht-row" style={{ display: 'flex', gap: '10px' }}>
      {productsState
        .filter(item => ["34", "35", "36"].includes(item._id))
        .map(item => (
          <div key={item._id} style={{ textAlign: 'center' }}>
            <img src={item.image_url || "/default-image.jpg" } alt={item.product_name || "Go'sht mahsuloti" }
              style={{ width: '130px', height:'130px', borderRadius: '10px', objectFit: 'cover', }} />
            <div style={{ marginTop: '8px' }}>{item.product_name}</div>
          </div>
        ))}
    </div>
  </div>
</div>

<div className='ichimliklar'>
<h2 className='section-title'>Suv va chimliklar</h2>
<div className="universal-gallery">
    <div className="image-gallery">
      <div className="row">
        {productsState
          .filter(item => item._id === "37" || item._id === "38")
          .map(item => (
            <img
              key={item._id}
              src={item.image_url || "/default-image.jpg"}
              alt={item.product_name || "Mahsulot rasmi"}
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
            />
          ))}
      </div>
    </div>
  </div>
</div>

<div className='shirinlik-sevuvchilar'></div>
<h2 className='section-title'>Shirinlik sevuvchilar</h2>
<div className="sizga-yoqadi-slider">
  {productsState
    .filter(product => {
      const id = Number(product._id);
      return id >= 42 && id <=47; // kerakli id larni moslang
    })
    .map(product => (
      <div key={product._id} className="product-card">
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
            style={{ width: '130px', height:'130px', borderRadius: '10px', objectFit: 'cover', }} />
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
            style={{ width: '130px', height:'130px', borderRadius: '10px', objectFit: 'cover', }} />
          <div style={{ textAlign: 'center', marginTop: '8px' }}>
          </div>
        </div>
        ))}
      </div>
    </div>  
</div>




<div className='Oziq-ovqat'>
<h2 className='section-title'>Oziq-ovqat mollari</h2>
<div className="shirinlik-gallery"
      style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '15px', padding: '10px' }}>
      <div className="shirinlik-row" style={{ display: 'flex', gap: '10px' }}>
        {productsState  
        .filter(item => ["54", "55", "56"].includes(item._id))
        .map(item => (
        <div key={item._id}>
          <img src={item.image_url || "/default-image.jpg" } alt={item.product_name || "Shirinlik mahsuloti" }
            style={{ width: '130px', height:'130px', borderRadius: '10px', objectFit: 'cover', }} />
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
            style={{ width: '130px', height:'130px', borderRadius: '10px', objectFit: 'cover', }} />
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
            style={{ width: '130px', height:'130px', borderRadius: '10px', objectFit: 'cover', }} />
          <div style={{ textAlign: 'center', marginTop: '8px' }}>
          </div>
        </div>
        ))}
      </div>
    </div>  
</div>

</div>
);
}

export default Home;
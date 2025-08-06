import React, { useState } from 'react';
import axios from 'axios';

export default function Admin() {
  const sections = [
    'Chilla',
    'Aktual taklif',
    'Sabzavot va mevalar',
    'Haftaning super narxi',
    'Tayyor ovqat',
    'Sut mahsulotlari',
    'Sizga yoqadi',
    'Go\'sht va parrandalar',
    'Dengiz mahsulotlari',
    'Suv va ichimliklar',
    'Shirinlik sevuvchilar',
    'Shirinliklar',
    'Oziq-ovqat mollari',
    'Non mahsulotlari',
    'Muzlatilgan mahsulotlar',
    'Turli xil konservalar',
    'Bolalar uchun',
    'Uy hayvonlari uchun',
    'Gigiyena va parvarish',
    'Chinniyu chiroq',
    'Ro\'zg\'or uchun',
  ];
  const [selectedSection, setSelectedSection] = useState(null);
  const [product, setProduct] = useState({
    product_name: '',
    subcategory: '',
    category: '',
    unit: '',
    unit_description: '',
    price: '',
    expiration: '',
    additionals: '',
    image_url: '',
    product_description: '',
    product_ingredients: '',
    nutritional_value: { kkal: '', fat: '', protein: '', uglevod: '' },
    strg_conditions: '',
  });
  const [savedProduct, setSavedProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (["kkal", "fat", "protein", "uglevod"].includes(name)) {
      setProduct((prev) => ({
        ...prev,
        nutritional_value: { ...prev.nutritional_value, [name]: value },
      }));
    } else {
      setProduct((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setError("");
    try {
      // Faqat backend API endpointga so'rov yuboriladi
      const res = await axios.post('/api/products', {
        ...product,
        section: selectedSection,
        additionals: product.additionals.split(',').map(s => s.trim()),
        nutritional_value: {
          kkal: Number(product.nutritional_value.kkal),
          fat: Number(product.nutritional_value.fat),
          protein: Number(product.nutritional_value.protein),
          uglevod: Number(product.nutritional_value.uglevod),
        },
        price: Number(product.price),
        expiration: Number(product.expiration),
      });
      setSavedProduct(res.data || { ...product });
      setProduct({
        product_name: '', subcategory: '', category: '', unit: '', unit_description: '', price: '', expiration: '', additionals: '', image_url: '', product_description: '', product_ingredients: '', nutritional_value: { kkal: '', fat: '', protein: '', uglevod: '' }, strg_conditions: '',
      });
    } catch (err) {
      setError("Saqlashda xatolik: " + (err?.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "flex-start", flexDirection: "column", paddingTop: 40 }}>
      <h1 style={{ color: "#19b394", fontSize: 32, fontWeight: 700, marginBottom: 24 }}>Admin panel</h1>
      {!selectedSection ? (
        <>
          <p style={{ fontSize: 18, color: "#555", marginBottom: 32 }}>Bo'limni tanlang:</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center', maxWidth: 600 }}>
            {sections.map(section => (
              <button
                key={section}
                style={{
                  padding: '14px 22px',
                  fontSize: 16,
                  borderRadius: 10,
                  border: '1px solid #19b394',
                  background: '#fff',
                  color: '#19b394',
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px #19b39422',
                  transition: 'background 0.15s, color 0.15s',
                }}
                onMouseOver={e => { e.target.style.background = '#19b394'; e.target.style.color = '#fff'; }}
                onMouseOut={e => { e.target.style.background = '#fff'; e.target.style.color = '#19b394'; }}
                onClick={() => setSelectedSection(section)}
              >
                {section}
              </button>
            ))}
          </div>
        </>
      ) : (
        <div style={{ width: '100%', maxWidth: 500, marginTop: 24 }}>
          <button onClick={() => { setSelectedSection(null); setSavedProduct(null); }} style={{ marginBottom: 18, background: 'none', border: 'none', color: '#19b394', fontWeight: 600, cursor: 'pointer', fontSize: 16 }}>&larr; Orqaga</button>
          <h2 style={{ color: '#19b394', marginBottom: 18 }}>{selectedSection} uchun mahsulot qo'shish</h2>
          <form style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <input name="product_name" value={product.product_name} onChange={handleInputChange} placeholder="Mahsulot nomi" style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc' }} />
            <input name="subcategory" value={product.subcategory} onChange={handleInputChange} placeholder="Subcategory" style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc' }} />
            <input name="category" value={product.category} onChange={handleInputChange} placeholder="Category" style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc' }} />
            <input name="unit" value={product.unit} onChange={handleInputChange} placeholder="Unit (gr, l, dona...)" style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc' }} />
            <input name="unit_description" value={product.unit_description} onChange={handleInputChange} placeholder="Unit description (masalan: 150 g)" style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc' }} />
            <input name="price" value={product.price} onChange={handleInputChange} placeholder="Narxi" type="number" style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc' }} />
            <input name="expiration" value={product.expiration} onChange={handleInputChange} placeholder="Yaroqlilik muddati (kun)" type="number" style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc' }} />
            <input name="additionals" value={product.additionals} onChange={handleInputChange} placeholder="Qo'shimchalar (vergul bilan)" style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc' }} />
            <input name="image_url" value={product.image_url} onChange={handleInputChange} placeholder="Rasm URL" style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc' }} />
            <textarea name="product_description" value={product.product_description} onChange={handleInputChange} placeholder="Mahsulot tavsifi" style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc' }} />
            <textarea name="product_ingredients" value={product.product_ingredients} onChange={handleInputChange} placeholder="Tarkibi" style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc' }} />
            <div style={{ display: 'flex', gap: 8 }}>
              <input name="kkal" value={product.nutritional_value.kkal} onChange={handleInputChange} placeholder="Kkal" type="number" style={{ flex: 1, padding: 8, borderRadius: 6, border: '1px solid #ccc' }} />
              <input name="fat" value={product.nutritional_value.fat} onChange={handleInputChange} placeholder="Yog' (g)" type="number" style={{ flex: 1, padding: 8, borderRadius: 6, border: '1px solid #ccc' }} />
              <input name="protein" value={product.nutritional_value.protein} onChange={handleInputChange} placeholder="Oqsil (g)" type="number" style={{ flex: 1, padding: 8, borderRadius: 6, border: '1px solid #ccc' }} />
              <input name="uglevod" value={product.nutritional_value.uglevod} onChange={handleInputChange} placeholder="Uglevod (g)" type="number" style={{ flex: 1, padding: 8, borderRadius: 6, border: '1px solid #ccc' }} />
            </div>
            <input name="strg_conditions" value={product.strg_conditions} onChange={handleInputChange} placeholder="Saqlash shartlari" style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc' }} />
            <button type="button" onClick={handleSave} disabled={loading} style={{ marginTop: 12, background: '#19b394', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 0', fontWeight: 600, fontSize: 16, cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>{loading ? 'Saqlanmoqda...' : 'Saqlash'}</button>
            {error && <span style={{ color: 'red', fontSize: 14 }}>{error}</span>}
          </form>
          {savedProduct && (
            <div style={{ marginTop: 32, border: '1px solid #eee', borderRadius: 10, padding: 18, background: '#fafafa', boxShadow: '0 2px 8px #19b39411' }}>
              <h3 style={{ color: '#19b394', fontSize: 20, marginBottom: 8 }}>{savedProduct.product_name}</h3>
              <img src={savedProduct.image_url} alt={savedProduct.product_name} style={{ width: 120, height: 90, objectFit: 'cover', borderRadius: 8, marginBottom: 8 }} />
              <div><b>Kategoriya:</b> {savedProduct.category}</div>
              <div><b>Subkategoriya:</b> {savedProduct.subcategory}</div>
              <div><b>Narxi:</b> {savedProduct.price} so'm</div>
              <div><b>Og'irligi:</b> {savedProduct.unit_description}</div>
              <div><b>Tavsif:</b> {savedProduct.product_description}</div>
              <div><b>Tarkibi:</b> {savedProduct.product_ingredients}</div>
              <div><b>Energiya:</b> {savedProduct.nutritional_value?.kkal} kkal, Yog': {savedProduct.nutritional_value?.fat}g, Oqsil: {savedProduct.nutritional_value?.protein}g, Uglevod: {savedProduct.nutritional_value?.uglevod}g</div>
              <div><b>Saqlash:</b> {savedProduct.strg_conditions}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

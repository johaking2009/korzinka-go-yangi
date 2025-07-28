import React from 'react';
import gallery from '../assets/gallery.json';

function Home() {
  return (
    <div>
      <h1>Welcome to Our Gallery</h1>
      {gallery
        .filter(item => item._id === "6" || item._id === "7")
        .map(item => (
          <div key={item._id}>
            <h3>{item.product_name}</h3>
            <img
              src={item.image_url}
              alt={item.product_name}
              style={{ width: '300px', height: 'auto' }}
            />
          </div>
        ))}
    </div>
  );
}

export default Home;
import React, { useState } from "react";
import img from "../../assets/uz.png";

const Phone = ({ onNext }) => {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendCode = async () => {
    setLoading(true);
    // Bu yerda haqiqiy SMS yuborish API chaqiriladi
    // await fetch('/api/send-sms', { method: 'POST', body: JSON.stringify({ phone }) })
    setTimeout(() => {
      setLoading(false);
      if (onNext) onNext(phone); // Otp sahifasiga o'tkazish
    }, 1000); // Demo uchun
  };

  return (
    <div className="auth-phone">
      <div className="phone-body">
        <img src={img} alt="" />
        <b>Telefon raqamni kiriting</b>
        <input
          type="tel"
          placeholder="+998 (00) 000-00-00"
          value={phone}
          onChange={e => setPhone(e.target.value)}
        />
        <button onClick={handleSendCode} disabled={loading || phone.length < 9}>
          {loading ? "Yuborilmoqda..." : "Davom etish"}
        </button>
        <p>
          Davom etish orqali <a href="#">Ommaviy oferta</a> shartlarini qabul
          qilaman va shaxsiy ma'lumotlarim{" "}
          <a href="#">Shaxsiy ma'lumotlarni qayta ishlash siyosatiga</a> muvofiq
          qayta ishlanishiga rozilik bildiraman
        </p>
      </div>
    </div>
  );
};

export default Phone;











// import img from "../../assets/uz.png";

// const Phone = () => {
//   return (
//     <div className="auth-phone">
//       <div className="phone-body">
//         <img src={img} alt="" />
//         <b>Telefon raqamni kiriting</b>
//         <input type="tel" placeholder="+998 (00) 000-00-00" />
//         <button>Davom etish</button>
//         <p>
//           Davom etish orqali <a href="#">Ommaviy oferta</a> shartlarini qabul
//           qilaman va shaxsiy ma'lumotlarim{" "}
//           <a href="#">Shaxsiy ma'lumotlarni qayta ishlash siyosatiga</a> muvofiq
//           qayta ishlanishiga rozilik bildiraman
//         </p>
//       </div>
//     </div>
//   );
// };
// export default Phone;


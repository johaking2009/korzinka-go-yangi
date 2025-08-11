import { useEffect, useState } from "react";
import img from "../../assets/uz.png";
import { BsArrowLeft } from "react-icons/bs";

const Otp = ({ phone }) => {
  const [timer, setTimer] = useState(59);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleResend = () => {
    // Bu yerda kodni qayta yuborish funksiyasi bo'lishi mumkin
    setTimer(59);
  };

  return (
    <div className="otp-auth">
      <div className="otp-body">
        <div>
          <button>
            <BsArrowLeft />
          </button>
          <img src={img} alt="" />
        </div>
        <b>{phone}</b>
        <p>raqamiga yuborilgan SMS kodni kiriting</p>
        <input
          type="number"
          placeholder="_ _ _  _ _ _"
          maxLength={6}
          onInput={(e) => {
            if (e.target.value.length > 6) {
              e.target.value = e.target.value.slice(0, 6);
            }
          }}
        />
        <p>
          Kodni olmadingizmi?{" "}
          <span>00:{timer < 10 ? `0${timer}` : timer}</span>
        </p>
        <button
          onClick={handleResend}
          disabled={timer > 0}
          style={{
            opacity: timer > 0 ? 0.5 : 1,
            cursor: timer > 0 ? "not-allowed" : "pointer",
          }}
        >
          Takrorlash
        </button>
      </div>
    </div>
  );
};

export default Otp;

// import { useState } from "react";
// import Otp from "../../pages/auth/Otp";
// import Phone from "../../pages/auth/Phone";

// const AuthLayout = ({ active }) => {
//   const [step, setStep] = useState("phone");
//   const [phone, setPhone] = useState("");

//   return (
//     <div className="auth-layout">
//       {step === "phone" && (
//         <Phone onNext={(num) => { setPhone(num); setStep("otp"); }} />
//       )}
//       {step === "otp" && <Otp phone={phone} />}
//     </div>
//   );
// };

// export default AuthLayout;









import Introduction from "../../pages/auth/Introduction";
import Otp from "../../pages/auth/Otp";
import Phone from "../../pages/auth/Phone";
import Success from "../../pages/auth/Success";
import UserForm from "../../pages/auth/UserForm";
import home from "../../pages/main/home";

const AuthLayout = () => {
  return (
    <div className="auth-layout">
      {/* <Phone  /> */}
      {/* <Otp /> */}
      {/* <Introduction /> */}
      {/* <UserForm /> */}
      {/* <Success /> */}
    </div>
  );
};

export default AuthLayout;


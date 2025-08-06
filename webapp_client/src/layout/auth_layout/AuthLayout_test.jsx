import Introduction from "../../pages/auth/Introduction";
import Otp from "../../pages/auth/Otp";
import Phone from "../../pages/auth/Phone";
import Success from "../../pages/auth/Success";
import UserForm from "../../pages/auth/UserForm";
import home from "../../pages/main/home";

const AuthLayout = ({ active }) => {
  return (
    <div className="auth-layout">
      {active === "phone" && <Phone />}
      {/* boshqa bo‘limlar uchun ham shunday shartlar yozishingiz mumkin */}
    </div>
  );
};

export default AuthLayout;




// cd d:\food-delivery-webapp\webapp_client
// git init
// git remote add origin https://github.com/johaking2009/korzinka-go-yangi.git
// git add .
// git commit -m "21:43"
// git branch -M main
// git push -u origin main

// git add .
// git commit -m "Responsive CSS: .shirinlik-row img formula-based sizing and code cleanup"
// git push origin main






// import Introduction from "../../pages/auth/Introduction";
// import Otp from "../../pages/auth/Otp";
// import Phone from "../../pages/auth/Phone";
// import Success from "../../pages/auth/Success";
// import UserForm from "../../pages/auth/UserForm";
// import home from "../../pages/main/home";

// const AuthLayout = () => {
//   return (
//     <div className="auth-layout">
//       {/* <Phone  /> */}
//       {/* <Otp /> */}
//       {/* <Introduction /> */}
//       {/* <UserForm /> */}
//       {/* <Success /> */}
//     </div>
//   );
// };

// export default AuthLayout;

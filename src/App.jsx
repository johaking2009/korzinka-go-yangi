// import React from 'react';
// import AuthLayout from './layout/auth_layout/AuthLayout';
// import Home from './pages/main/home';
// import Mahsulotlar from './pages/main/Mahsulotlar';

// const App = () => {
//   return (
//     <div>
//       <AuthLayout />
//     </div>
//   );
// };


// export default App;





import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/main/home';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
};

export default App;






// import React from 'react';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import AuthLayout from './layout/auth_layout/AuthLayout';
// import Home from './pages/main/home';

// const App = () => {
//   return (
//     <Router>
//         <Routes>
//           <Route path="/" element={<AuthLayout />} />
//         </Routes>
//     </Router>
//   );
// };

// export default App;
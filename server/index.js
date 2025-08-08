// require("dotenv").config();
// const express = require("express");
// const { connectDB } = require("./config/connectDB");
// connectDB();
// const cors = require("cors");
// const path = require("path");
// const tokenAuth = require("./middlewares/token.auth");
// const basicAuth = require("./middlewares/basic.auth");
// const app = express();
// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     credentials: true,
//   })
// );
// app.use("/images", express.static(path.join(__dirname, "uploads")));
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());
// app.use("/api/v1/token", tokenAuth, require("./routes/admin.routes"));
// app.use("/api/v1/basic", basicAuth, require("./routes/user.routes"));

// app.get("/api/v1/token/admins", async (req, res) => {
//   const Admin = require("./models/admin.model");
//   const admins = await Admin.find({}, { admin_login: 1, _id: 0 });
//   res.json(admins);
// });

// const PORT = process.env.PORT || 8080;
// app.listen(PORT, () => {
//   console.log(`Server ishga tushdi: http://localhost:${PORT}/api/v1`);
// });







require("dotenv").config();
const express = require("express");
const { connectDB } = require("./config/connectDB");
connectDB();
const cors = require("cors");
const path = require("path");
const tokenAuth = require("./middlewares/token.auth");
const basicAuth = require("./middlewares/basic.auth");
const app = express();
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  })
);
app.use("/images", express.static(path.join(__dirname, "uploads")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// PUBLIC PRODUCT ENDPOINT (NO AUTH)
const { getProducts } = require("./controllers/product.controller");
app.get("/api/v1/basic/product/public", getProducts);

// AUTHENTICATED ROUTES
app.use("/api/v1/token", tokenAuth, require("./routes/admin.routes"));
app.use("/api/v1/basic", basicAuth, require("./routes/user.routes"));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server ishga tushdi: http://localhost:${PORT}/api/v1`);
});

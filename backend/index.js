const express = require("express");
const path = require("path")
const PORT = 8000;
const cors = require("cors")
require("dotenv").config({
  path: __dirname + "/../.env"
});

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "backend", "public")))

const productRouter = require("./routes/product")
const categoryRouter = require("./routes/category")
const loginRouter = require("./routes/login");
const cashierRouter = require("./routes/cashier");

//Routing
app.use("/categories", categoryRouter)
app.use("/products", productRouter)
app.use("/login", loginRouter);
app.use("/cashier", cashierRouter)

app.use((req, res) => {
  console.log(`404: ${req.url}`);
  res.status(404).json({
    msg: "NOT FOUND",
  });
});


app.use((err, req, res) => {
  console.log(`500: ${res.url}`);
  console.log(err);
  res.status(500).json({
    msg: "FATAL ERROR",
    err,
  });
});

app.listen(PORT, () => {
  console.log(`application start on port ${PORT}`);
});

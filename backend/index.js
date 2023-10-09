const express = require("express");
const PORT = 8000;

const app = express();
app.use(express.json());

const categoryRouter = require("./routes/category")

//Routingg
app.use("/categories", categoryRouter)

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

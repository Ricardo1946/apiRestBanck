require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cardRoutes = require("./routes/cardRoutes");
const errorHandler = require("./middlewares/errorHandler");
const connectDB = require("./bd/db");


const app = express();
const port = process.env.PORT || 3000;

// Conectar a Mongo
connectDB();

app.use(cors());
app.use(express.json());
app.use("/card", cardRoutes);
app.use(errorHandler);


app.get("/", (req, res) => {
  res.send("Servidor con MongoDB funcionando 🚀");
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});

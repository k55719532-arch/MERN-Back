const mongoose = require("mongoose");
require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URL)
.then(() => {
  console.log("mongodb running successfully ✅");
})
.catch((error) => {
  console.log("mongodb not connect ❌", error);
});

// Routes - Must come BEFORE app.listen
const userRouter = require("./Routers/User");
app.use("/api/user", userRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
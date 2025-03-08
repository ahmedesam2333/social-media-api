const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

// Import Routes
const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);

const postRoutes = require("./routes/postRoutes");
app.use("/api/posts", postRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

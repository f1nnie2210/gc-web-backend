const express = require("express");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();

const paymentCallbackApp = require("./routes/paymentCallback");
const userRoutes = require("./routes/user");
const auth = require("./middleware/auth");

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

// MongoDB connection
mongoose.set("strictQuery", false);
mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("Connected to DB."))
    .catch((err) => console.log(`DB Connection Error: ${err}`));

// Use routes
app.use("/payment-callback", paymentCallbackApp);
app.use("/user", userRoutes);

// Sample protected route
app.get("/protected", auth, (req, res) => {
    res.send("This is a protected route");
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

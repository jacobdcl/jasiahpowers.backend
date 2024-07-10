require("dotenv").config();
const cloudinary = require("cloudinary").v2;
const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());
app.use(cors());

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.VITE_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.VITE_CLOUDINARY_API_KEY,
  api_secret: process.env.VITE_CLOUDINARY_API_SECRET,
});

// API route to fetch images from a specific folder in Cloudinary
app.get("/api/images/:folder", async (req, res) => {
  try {
    const folderPath = `jasiahpowers/${req.params.folder}`; // Use the folder parameter to get the specific folder
    const { resources } = await cloudinary.search
      .expression(`folder:${folderPath}`)
      .sort_by("public_id", "desc")
      .max_results(30)
      .execute();

    const imagePublicIds = resources.map((file) => file.public_id);
    res.json({ images: imagePublicIds });
  } catch (error) {
    console.error("Error fetching images:", error);
    res.status(500).send("Error fetching images");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

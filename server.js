// server.js
require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const PORT = process.env.PORT || 5001;
const express = require('express');
const path = require('path');
const app = express();

const cors = require('cors');
app.use(cors());

// Cloudinary configuration
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

app.use(express.json());

app.get('/api/images', async (req, res) => {
    try {
        let result = await cloudinary.search
            .expression('folder:jasiahpowers') // Update the folder path if necessary
            .sort_by('public_id', 'desc')
            .max_results(100)
            .execute();

        let imageUrls = result.resources.map(file => file.secure_url);
        res.json({ images: imageUrls });
    } catch (error) {
        console.error('Error fetching images:', error);
        res.status(500).send('Error fetching images');
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

import React, { useState, useEffect } from 'react';
import { Box, Container, Modal } from '@mui/material';
import { Masonry } from '@mui/lab';
import { Image } from 'cloudinary-react';
import LazyLoad from 'react-lazyload';
import axios from 'axios';
import LoadingPage from '../LoadingPage/LoadingPage.jsx'; 

function PhotosPage() {
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [items, setItems] = useState([]);

  const handleOpen = (imageUrl) => {
    console.log("Opening modal with image:", imageUrl); // Diagnostic log
    setSelectedItem(imageUrl);
    setOpen(true);
  };
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true); // Set loading to true when the request starts
      try {
        const response = await axios.get('CYCLIC_URL/api/images');
        if (response.data && Array.isArray(response.data.images)) {
          setItems(response.data.images);
        } else {
          console.error('Invalid data structure:', response.data);
          setItems([]); // Fallback to an empty array
        }
      } catch (error) {
        console.error('Error fetching images:', error);
      }
      setLoading(false); // Set loading to false when the request ends

    };
    fetchImages();
  }, []);

  if (loading) {
    return <LoadingPage/>;
  }

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Container maxWidth="lg" sx={{ paddingTop: '10vh', paddingBottom: '5vh', textAlign: 'center' }}>
      <Masonry columns={{ xs: 2, sm: 3, md: 4, lg: 5 }} spacing={0.6}>
      {items.map((imagePublicId, index) => (
        <LazyLoad key={index} height={200} offset={100}>
          <Box
            sx={{
              display: 'block',
              width: 1,
              cursor: 'pointer',
              '&:hover': {
                opacity: 0.8,
              },
            }}
            onClick={() => handleOpen(imagePublicId)}
          >
            <Image 
              cloudName={import.meta.env.VITE_CLOUDINARY_CLOUD_NAME} 
              publicId={imagePublicId} 
              width="300" 
              crop="scale"
              style={{ width: '100%' }} 
            />
          </Box>
        </LazyLoad>
      ))}
      </Masonry>
       {/*}
        <Modal
          open={open}
          onClose={handleClose}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Image 
            cloudName={import.meta.env.VITE_CLOUDINARY_CLOUD_NAME} 
            publicId={selectedItem} // used to be publicId
            style={{
              outline: 'none',
              maxWidth: '90%',
              maxHeight: '90%',
              boxShadow: 24,
              borderRadius: 2,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            }} 
            crop="scale"
          />
        </Modal>
          */}
    </Container>
  );
}

export default PhotosPage;

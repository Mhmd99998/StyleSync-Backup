import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  IconButton,
  Typography,
  useTheme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { ImageDto } from '../../models/Image';

interface ImagePreviewModalProps {
  open: boolean;
  images: ImageDto[];
  initialImage?: string;
  onClose: () => void;
}

const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({
  open,
  images,
  initialImage,
  onClose,
}) => {
  const initialIndex = initialImage
    ? images.findIndex(img => img.imageUrl === initialImage)
    : 0;

  const [currentIndex, setCurrentIndex] = useState<number>(
    initialIndex >= 0 ? initialIndex : 0
  );

  useEffect(() => {
    if (open) {
      setCurrentIndex(initialIndex >= 0 ? initialIndex : 0);
    }
  }, [initialIndex, open]);

  const handlePrev = () => {
    setCurrentIndex(prev => (prev - 1 + images.length) % images.length);
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % images.length);
  };

  const handleSelect = (index: number) => {
    setCurrentIndex(index);
  };

  const theme = useTheme();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: 'transparent',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '80vw',
          height: '92vh',
          maxHeight: '92vh',
          overflow: 'hidden',
        },
      }}
    >
      <DialogContent
        sx={{
          p: 2,
          width: '100%',
          maxWidth: '1000px',
          mx: 'auto',
          overflow: 'hidden',
        }}
      >
        <Box position="relative" textAlign="center">
          {/* Close Button */}
          <IconButton
            onClick={onClose}
            sx={{ position: 'absolute', top: 8, right: 8, zIndex: 2, color: '#fff' }}
          >
            <CloseIcon />
          </IconButton>

          {/* Main Image */}
          <Box
            component="img"
            src={images[currentIndex]?.imageUrl}
            sx={{
              width: '100%',
              maxHeight: '65vh',
              objectFit: 'contain',
              borderRadius: 2,
              mb: 2,
            }}
          />

          {/* Navigation */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            px={2}
            mb={2}
          >
            <IconButton onClick={handlePrev} sx={{ color: '#fff' }}>
              <ArrowBackIosNewIcon />
            </IconButton>
            <Typography fontSize="0.875rem">
              {currentIndex + 1} of {images.length}
            </Typography>
            <IconButton onClick={handleNext} sx={{ color: '#fff' }}>
              <ArrowForwardIosIcon />
            </IconButton>
          </Box>

          {/* Thumbnails */}
          <Box
            display="flex"
            justifyContent="center"
            gap={1}
            flexWrap="wrap"
            px={2}
            sx={{
              overflowX: 'auto',
              scrollbarWidth: 'none', // Firefox
              '&::-webkit-scrollbar': { display: 'none' }, // Chrome
            }}
          >
            {images.map((img, index) => (
              <Box
                key={img.imageId}
                component="img"
                src={img.imageUrl}
                alt="preview"
                onClick={() => handleSelect(index)}
                sx={{
                  width: 80,
                  height: 80,
                  objectFit: 'cover',
                  borderRadius: 1,
                  border:
                    index === currentIndex
                      ? `2px solid ${theme.palette.primary.main}`
                      : '2px solid transparent',
                  cursor: 'pointer',
                  transition: 'border 0.2s ease-in-out',
                  opacity: index === currentIndex ? 1 : 0.7,
                }}
              />
            ))}
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ImagePreviewModal;

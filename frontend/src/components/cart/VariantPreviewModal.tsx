import React, { useEffect, useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  IconButton,
  Divider
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Carousel from 'react-material-ui-carousel';
import VariantService from '../../services/VariantService';
import { VariantDto } from '../../models/Variant';
import { ImageDto } from '../../models/Image';

interface Props {
  open: boolean;
  onClose: () => void;
  variantId: string | null;
}

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  maxHeight: '90vh',
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 3,
  overflowY: 'auto'
};

const VariantPreviewModal: React.FC<Props> = ({ open, onClose, variantId }) => {
  const [variant, setVariant] = useState<VariantDto | null>(null);

  useEffect(() => {
    const fetchVariant = async () => {
      if (!variantId) return;
      try {
        const data = await VariantService.getVariantById(variantId);
        setVariant(data);
      } catch (err) {
        console.error('Failed to fetch variant details', err);
      }
    };

    if (open && variantId) {
      fetchVariant();
    }
  }, [variantId, open]);

  const images: ImageDto[] = variant?.images ?? [];

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="h6">Item Preview</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {variant ? (
          <>
            {/* Carousel */}
            <Carousel>
              {images.map((img, idx) => (
                <Box
                  key={img.imageId}
                  component="img"
                  src={img.imageUrl}
                  alt={`Image ${idx + 1}`}
                  sx={{ width: '100%', height: 300, objectFit: 'contain', borderRadius: 1 }}
                />
              ))}
            </Carousel>

            <Divider sx={{ my: 2 }} />

            {/* Variant Info */}
            <Typography variant="body1"><strong>Size:</strong> {variant.size}</Typography>
            <Typography variant="body1"><strong>Color:</strong> {variant.color}</Typography>
            <Typography variant="body1"><strong>Price:</strong> ${variant.price.toFixed(2)}</Typography>
            <Typography variant="body1"><strong>Stock:</strong> {variant.stock}</Typography>
            <Typography variant="body1"><strong>SKU:</strong> {variant.sku}</Typography>
          </>
        ) : (
          <Typography>Loading...</Typography>
        )}
      </Box>
    </Modal>
  );
};

export default VariantPreviewModal;

import React, { useState } from 'react';
import { Card, CardContent, Typography, Grid, Button, Box, IconButton, CircularProgress, Tooltip, FormControl, Select, MenuItem, Chip, InputLabel } from '@mui/material';
import CustomTextField from '../shared/CustomTextField';
import { UpdateVariantDto, VariantDto } from '../../models/Variant';
import { Close, CloudUpload } from '@mui/icons-material';
import { toast } from 'material-react-toastify';
import VariantService from '../../services/VariantService';
import { useParams } from 'react-router-dom'; // Import useParams
import ConfirmationPopup from '../shared/ConfirmationPopup';
import ImageService from '../../services/ImageService';
import S3Service from '../../services/S3Service';
import { getChipColor, getKnownColors, isLightColor } from '../../utils/colorUtils';

interface Props {
  variant: VariantDto;
  onChange: (variantId: string, field: keyof VariantDto, value: any) => void;
  isSaving: boolean;
  onDelete: (variantId: string) => void;
  isLoading: boolean;
}

const VariantCard: React.FC<Props> = ({ variant, onChange, isSaving, onDelete, isLoading }) => {
  const { productId } = useParams<{ productId: string }>();
  const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false);
  const [uploading, setUploading] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<string | null>(null);
  const [isConfirmImageDeleteOpen, setIsConfirmImageDeleteOpen] = useState(false);
  const [isSavingLocally, setIsSavingLocally] = useState(false);

  const knownColors = getKnownColors();

  const handleUpdateVariant = async (variantId: string, variant: VariantDto) => {
    if (!productId) {
      toast.error('Product ID not found in the URL');
      return;
    }

    setIsSavingLocally(true);
    try {
      const updatedVariantData: UpdateVariantDto = {
        variantId: variantId,
        productId: productId,
        size: variant.size,
        color: variant.color,
        sku: variant.sku,
        price: variant.price,
        stock: variant.stock,
      };

      await VariantService.updateVariant(variantId, updatedVariantData);

      toast.success('Variant updated successfully!');
    } catch (error) {
      console.error('Failed to update variant', error);
      toast.error('Failed to update product variant');
    } finally {
      setIsSavingLocally(false);
    }
  };

  const handleDeleteVariant = async () => {
    try {
      const variantId = variant.variantId
      await VariantService.deleteVariant(variantId);
      toast.success('Product variant deleted successfully');
      onDelete(variantId);
    } catch (error) {
      console.error('Failed to delete product variant', error);
      toast.error('Failed to delete product variant');
      throw new Error('Failed to delete product variant');
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const variantId = variant.variantId;
    setUploading(true);

    try {
      const uploadedImages = await Promise.all(
        Array.from(files).map(async (file) => {
          const imageDto = await ImageService.uploadImage(variantId, file);
          return imageDto;
        })
      );

      const updatedImages = [...variant.images, ...uploadedImages];
      onChange(variant.variantId, 'images', updatedImages);

      toast.success('Images uploaded successfully!');
    } catch (error) {
      console.error('Image upload failed', error);
      toast.error('Failed to upload one or more images');
    } finally {
      setUploading(false);
    }
  };

  const handleConfirmImageDelete = async () => {
    if (!imageToDelete) return;

    try {
      const image = variant.images.find(img => img.imageId === imageToDelete);
      if (!image) {
        toast.error('Image not found');
        return;
      }

      await S3Service.delete({ url: image.imageUrl });
      await ImageService.deleteImage(image.imageId);

      const updatedImages = variant.images.filter(img => img.imageId !== image.imageId);
      onChange(variant.variantId, 'images', updatedImages);

      toast.success('Image deleted successfully!');
    } catch (error) {
      console.error('Failed to delete image', error);
      toast.error('Failed to delete image');
    } finally {
      setImageToDelete(null);
      setIsConfirmImageDeleteOpen(false);
    }
  };

  const handleSetDefaultImage = async (imageId: string) => {
    try {
      await ImageService.setImageAsDefault(variant.variantId, imageId);
      const updatedImages = variant.images.map(img => ({
        ...img,
        isDefault: img.imageId === imageId
      }));

      onChange(variant.variantId, 'images', updatedImages);
      toast.success("Image set to default successfully!");
    } catch (error) {
      toast.error("Failed to set image as default");
      throw new Error("Failed to set image as default");
    }
  };

  return (
    <Card sx={{ marginBottom: 2 }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>Variant ID: {variant.variantId}</Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <CustomTextField
              label="Size"
              fullWidth
              value={variant.size}
              onChange={value => onChange(variant.variantId, 'size', value)}
              disabled={isSaving}
            />
            <FormControl fullWidth sx={{ mt: 1 }}>
              <InputLabel>Color</InputLabel>
              <Select
                value={variant.color}
                label="Color"
                onChange={(e) => onChange(variant.variantId, 'color', e.target.value)}
                disabled={isSaving}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip
                      size="small"
                      label={selected}
                      sx={{
                        backgroundColor: getChipColor(selected),
                        color: isLightColor(getChipColor(selected)) ? '#000' : '#fff',
                        textTransform: 'capitalize'
                      }}
                    />
                  </Box>
                )}
              >
                {Object.entries(knownColors).map(([name, hex]) => (
                  <MenuItem key={name} value={name}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        sx={{
                          width: 16,
                          height: 16,
                          borderRadius: '50%',
                          backgroundColor: hex,
                          border: `1px solid ${isLightColor(hex) ? '#ccc' : '#333'}`
                        }}
                      />
                      <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                        {name}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <CustomTextField
              label="Price"
              fullWidth
              value={variant.price.toString()}
              onChange={value => onChange(variant.variantId, 'price', parseFloat(value))}
              disabled={isSaving}
              sx={{ mt: 1 }}
            />
            <CustomTextField
              label="Stock"
              fullWidth
              value={variant.stock.toString()}
              onChange={value => onChange(variant.variantId, 'stock', parseFloat(value))}
              disabled={isSaving}
              sx={{ mt: 1 }}
            />
            <CustomTextField
              label="SKU"
              fullWidth
              value={variant.sku}
              onChange={value => onChange(variant.variantId, 'sku', value)}
              disabled={isSaving}
              sx={{ mt: 1 }}
            />
          </Grid>
        </Grid>

        {/* Display Images */}
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1">Images:</Typography>
          <Grid container spacing={1} alignItems="center">
            {variant.images.map((image) => (
              <Grid item xs={4} key={image.imageId}>
                <Box
                  sx={{
                    position: 'relative',
                    width: '100%',
                    paddingTop: '100%',
                    borderRadius: 2,
                    overflow: 'hidden',
                  }}
                >
                  {/* Image itself */}
                  <img
                    src={image.imageUrl}
                    alt="Variant"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />

                  {/* Delete (X) Button */}
                  <IconButton
                    size="small"
                    onClick={() => {
                      setImageToDelete(image.imageId);
                      setIsConfirmImageDeleteOpen(true);
                    }}
                    sx={{
                      position: 'absolute',
                      top: 4,
                      right: 4,
                      zIndex: 2,
                      backgroundColor: 'rgb(113, 113, 113)',
                      color: 'rgb(172, 21, 21)',
                      '&:hover': {
                        backgroundColor: 'rgb(94, 94, 94)',
                      }
                    }}
                  >
                    <Close fontSize="small" />
                  </IconButton>

                  {/* Default badge */}
                  {image.isDefault && (
                    <Tooltip title="This will appear as the product listing image" arrow>
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 4,
                          left: 8,
                          backgroundColor: 'rgba(0, 128, 0, 0.7)',
                          border: '0.4px solid #ccc',
                          color: 'white',
                          px: 1,
                          py: 0.5,
                          fontWeight: '400',
                          borderRadius: 0.4,
                          fontSize: '0.8rem',
                          zIndex: 2,
                          transform: 'scale(1.1)'
                        }}
                      >
                        DEFAULT
                      </Box>
                    </Tooltip>
                  )}

                  {/* Set as Default Button */}
                  {!image.isDefault && (
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => handleSetDefaultImage(image.imageId)}
                      sx={{
                        position: 'absolute',
                        bottom: 4,
                        left: 4,
                        zIndex: 2,
                        backgroundColor: 'rgba(255,255,255,0.8)',
                        color: 'black',
                        fontWeight: '500',
                        px: 1.5,
                        py: 0.5,
                        textTransform: 'none',
                        overflow: 'hidden',
                        '&::after': {
                          bottom: 4,
                          content: '""',
                          position: 'absolute',
                          left: '50%',
                          transform: 'translateX(-50%) scaleX(0)',
                          transformOrigin: 'center',
                          width: '90%',
                          height: '1.4px',
                          backgroundColor: 'black',
                          transition: 'transform 0.3s ease',
                        },
                        '&:hover::after': {
                          transform: 'translateX(-50%) scaleX(1)',
                        }
                      }}
                    >
                      SET DEFAULT
                    </Button>
                  )}
                </Box>
              </Grid>

            ))}
          </Grid>

          {/* Upload Button */}
          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
              <IconButton
                component="label"
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: 1,
                  border: '1px dashed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative'
                }}
              >
                {uploading ? (
                  <CircularProgress size={24} />
                ) : (
                  <CloudUpload fontSize="small" />
                )}
                <input
                  type="file"
                  hidden
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </IconButton>
            </Box>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleUpdateVariant(variant.variantId, variant)}
            disabled={isSavingLocally || isSaving || isLoading}
            startIcon={isSavingLocally ? <CircularProgress size={18} color="inherit" /> : null}
          >
            {isSavingLocally ? 'SAVING...' : 'SAVE  '}
          </Button>
          <Button
            variant="outlined"
            color="error"
            disabled={isSavingLocally || isSaving || isLoading}
            onClick={() => setIsConfirmOpen(true)}
          >
            DELETE
          </Button>
        </Box>
      </CardContent>

      {/* Delete Confirmation Popup */}
      <ConfirmationPopup
        open={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDeleteVariant}
        title="Confirm Deletion"
        message={`Are you sure you want to delete variant ID: ${variant.variantId}? This action cannot be undone.`}
        confirmButtonText="Delete"
        confirmColor="error"
      />

      <ConfirmationPopup
        open={isConfirmImageDeleteOpen}
        onClose={() => setIsConfirmImageDeleteOpen(false)}
        onConfirm={handleConfirmImageDelete}
        title="Delete Image"
        message="Are you sure you want to delete this image? This action cannot be undone."
        confirmButtonText="Delete"
        confirmColor="error"
      />
    </Card>
  );
};

export default VariantCard;

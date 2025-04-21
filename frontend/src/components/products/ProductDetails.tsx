import React, { ChangeEvent, useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  TextField,
  Dialog,
  DialogContent,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ProductService from '../../services/ProductService';
import CartService from '../../services/CartService';
import { ProductDto } from '../../models/Product';
import { ImageDto } from '../../models/Image';
import { toast } from 'material-react-toastify';
import { RootState } from '../../redux/store';
import { getChipColor, isLightColor, isValidCssColor } from '../../utils/colorUtils';
import ImagePreviewModal from '../shared/ImagePreviewModal';

const ProductDetails: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const userId = useSelector((state: RootState) => state.user.userId);

  const [product, setProduct] = useState<ProductDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [currentImagePage, setCurrentImagePage] = useState(0);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isSelectionValid = Boolean(selectedColor && selectedSize);
  const IMAGES_PER_PAGE = 4;

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;
      try {
        const response = await ProductService.getProductById(productId);
        setProduct(response);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!product) {
    return (
      <Box p={2}>
        <Typography variant="h6">Product not found.</Typography>
      </Box>
    );
  }

  const colors = Array.from(new Set(product.variants.map(v => v.color)));
  const sizes = Array.from(new Set(product.variants.map(v => v.size)));

  const selectedVariant = product.variants.find(
    v => v.color === selectedColor && v.size === selectedSize
  );

  const isVariantAvailable = selectedVariant && selectedVariant.stock > 0;

  const handleAddToCart = async () => {
    if (!userId) {
      toast.error('Please log in to add items to your cart.');
      return;
    }

    if (!selectedVariant) {
      toast.error('Please select a valid size and color.');
      return;
    }

    try {
      await CartService.addItemToCart(userId, {
        variantId: selectedVariant.variantId,
        quantity,
      });
      toast.success('Item added to cart!');
    } catch (error) {
      toast.error('Failed to add item to cart.');
      console.error('Add to cart error:', error);
    }
  };

  const handleQuantityChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) setQuantity(value);
  };

  const images: ImageDto[] = Array.from(
    new Map(
      product.variants
        .flatMap(variant => variant.images || [])
        .filter(img => img && img.imageUrl)
        .map(img => [img.imageId, img])
    ).values()
  );

  const paginatedImages = images.slice(
    currentImagePage * IMAGES_PER_PAGE,
    (currentImagePage + 1) * IMAGES_PER_PAGE
  );

  const handlePrevPage = () => {
    setCurrentImagePage(prev => Math.max(prev - 1, 0));
  };

  const handleNextPage = () => {
    const maxPage = Math.floor((images.length - 1) / IMAGES_PER_PAGE);
    setCurrentImagePage(prev => Math.min(prev + 1, maxPage));
  };

  return (
    <Box p={2} sx={{ fontFamily: "'Inter', 'Helvetica Neue', sans-serif" }}>
      <Box
        maxWidth="1200px"
        mx="auto"
        display="flex"
        flexDirection={{ xs: 'column', md: 'row' }}
        gap={4}
        p={3}
        mb={5}
      >
        {/* Image Section */}
        <Box flexShrink={0} width={{ xs: '100%', md: 480 }}>
          <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={2}>
            {paginatedImages.map(img => (
              <Box
                key={img.imageId}
                component="img"
                src={img.imageUrl}
                alt={product.name}
                onClick={() => {
                  setIsModalOpen(true);
                  setPreviewImageUrl(img.imageUrl);
                }}
                sx={{
                  width: '100%',
                  height: 280,
                  objectFit: 'cover',
                  borderRadius: 0.5,
                  boxShadow: 2,
                  cursor: 'pointer',
                }}
              />
            ))}
          </Box>


          {/* Pagination */}
          {images.length > IMAGES_PER_PAGE && (
            <Box display="flex" justifyContent="center" mt={2} gap={2}>
              <Button size="small" onClick={handlePrevPage} disabled={currentImagePage === 0}>
                Previous
              </Button>
              <Typography fontSize="0.85rem">
                Page {currentImagePage + 1} of {Math.ceil(images.length / IMAGES_PER_PAGE)}
              </Typography>
              <Button
                size="small"
                onClick={handleNextPage}
                disabled={(currentImagePage + 1) * IMAGES_PER_PAGE >= images.length}
              >
                Next
              </Button>
            </Box>
          )}
        </Box>

        {/* Product Info */}
        <Box flex={1} display="flex" flexDirection="column" justifyContent="space-between">
          <Box>
            <Typography variant="h5" fontWeight={500} gutterBottom>
              {product.name}
            </Typography>
            <Typography fontSize="1rem" fontWeight={400} color="text.secondary" mb={2}>
              ${selectedVariant ? (selectedVariant.price).toFixed(2) : '0.00'}
            </Typography>

            {/* Color */}
            <Typography fontSize="0.9rem" color="text.secondary" gutterBottom>
              Color
            </Typography>
            <Box display="flex" gap={1} flexWrap="wrap" mb={2}>
              {colors.map(color => {
                const chipColor = getChipColor(color);
                const isValid = isValidCssColor(chipColor);
                const isSelected = selectedColor === color;
                const needsBorder = isLightColor(chipColor);

                return (
                  <Box
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    title={color}
                    sx={{
                      width: 42,
                      height: 42,
                      borderRadius: '50%',
                      backgroundColor: isValid ? chipColor : 'transparent',
                      border: isValid
                        ? needsBorder
                          ? '2px solid #222'
                          : '2px solid #aaa'
                        : '2px dashed #aaa',
                      boxShadow: isSelected ? '0 0 0 3px rgba(25, 118, 210, 0.5)' : 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s ease-in-out',
                      fontSize: '0.75rem',
                      color: 'text.secondary',
                    }}
                  >
                    {!isValid && "?"}
                  </Box>
                );
              })}
            </Box>

            {/* Size - Placeholder, will replace with squares in next step */}
            <Typography fontSize="0.9rem" color="text.secondary" gutterBottom>
              Size
            </Typography>
            <Box display="flex" gap={1} flexWrap="wrap" mb={2}>
              {sizes.map(size => (
                <Button
                  key={size}
                  variant={selectedSize === size ? 'contained' : 'outlined'}
                  onClick={() => setSelectedSize(size)}
                  size="small"
                  sx={{ textTransform: 'none', minWidth: 40, fontSize: '0.8rem' }}
                >
                  {size}
                </Button>
              ))}
            </Box>

            {/* Quantity */}
            <Typography fontSize="0.9rem" color="text.secondary" gutterBottom>
              Quantity
            </Typography>
            <TextField
              type="number"
              size="small"
              inputProps={{ min: 1 }}
              value={quantity}
              onChange={handleQuantityChange}
              sx={{ width: 100 }}
            />

            {/* Stock / Errors */}
            {(!selectedColor || !selectedSize) && (
              <Typography variant="body2" color="text.secondary" mt={1}>
                Please select both color and size.
              </Typography>
            )}
            {!isVariantAvailable && (
              <Typography variant="body2" sx={{ color: 'error.main', mt: 1 }}>
                Out of Stock
              </Typography>
            )}
          </Box>

          {/* Actions */}
          <Box mt={4} display="flex" flexDirection="column" gap={2}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              disabled={!isVariantAvailable}
              onClick={() => console.log('Buy Now clicked')}
            >
              Buy Now
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              size="large"
              fullWidth
              disabled={!isSelectionValid || !isVariantAvailable}
              onClick={handleAddToCart}
              startIcon={<ShoppingCartIcon />}
            >
              Add to Cart
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Image Preview Dialog */}
      <ImagePreviewModal
        open={isModalOpen}
        images={images}
        initialImage={previewImageUrl!}
        onClose={() => setIsModalOpen(false)}
      />
    </Box>
  );
};

export default ProductDetails;

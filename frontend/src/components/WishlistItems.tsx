import { Box, Button, Card, CardContent, CardMedia, Typography, IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useSelector } from "react-redux";
import { ProductDto } from "../models/Product";
import WishlistService from "../services/WishlistService";
import { RootState } from "../redux/store";
import { toast } from "material-react-toastify";
import { useNavigate } from "react-router-dom";

const WishlistItems: React.FC = () => {
  const navigate = useNavigate();
  const userId = useSelector((state: RootState) => state.user.userId);
  const [items, setItems] = useState<ProductDto[]>([]);
  const [imageIndex, setImageIndex] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!userId) {
        toast.info("You must be logged in to use this feature!");
        return;
      }

      try {
        const wishlistItems = await WishlistService.getWishlistByUserId(userId);
        setItems(wishlistItems);
      } catch (error) {
        console.error("Failed to fetch wishlist items:", error);
      }
    };

    fetchWishlist();
  }, [userId]);

  // Handle next image
  const handleNextImage = (productId: string, totalImages: number) => {
    setImageIndex((prev) => ({
      ...prev,
      [productId]: (prev[productId] + 1) % totalImages,
    }));
  };

  // Handle previous image
  const handlePrevImage = (productId: string, totalImages: number) => {
    setImageIndex((prev) => ({
      ...prev,
      [productId]: (prev[productId] - 1 + totalImages) % totalImages,
    }));
  };

  const handleOnRemoveClick = async (productId: string) => {
    try {
      if (!userId) {
        toast.error("Error performing operation");
        return;
      }

      await WishlistService.deleteItemFromWishlist(userId, productId);
      toast.success("Item removed successfully!");
      setItems((prevItems) => prevItems.filter((item) => item.productId !== productId));
    } catch (error) {
      toast.error("Failed to remove item from favorites");
      console.error("Failed to remove item from favorites:", error);
    }
  };

  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, padding: 2 }}>
      {items.map((product) => {
        const firstVariant = product.variants[0];
        const images = firstVariant?.images || [];
        const currentImageIndex = imageIndex[product.productId] || 0;

        // ✅ Calculate the price range
        const variantPrices = product.variants.map((variant) => variant.price);
        const minPrice = Math.min(...variantPrices);
        const maxPrice = Math.max(...variantPrices);
        const priceRange = minPrice === maxPrice ? `$${minPrice.toFixed(2)}` : `$${minPrice.toFixed(2)} - $${maxPrice.toFixed(2)}`;

        return (
          <Card key={product.productId} sx={{ width: 300, padding: 1 }}>
            {/* Image Carousel */}
            {images.length > 0 && (
              <Box sx={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <IconButton
                  sx={{ position: "absolute", left: 5, backgroundColor: "white", zIndex: 1 }}
                  onClick={() => handlePrevImage(product.productId, images.length)}
                  disabled={images.length <= 1}
                >
                  <ArrowBackIosIcon />
                </IconButton>
                <CardMedia
                  component="img"
                  height="180"
                  image={images[currentImageIndex].imageUrl}
                  alt={product.name}
                  sx={{ objectFit: "contain" }}
                />
                <IconButton
                  sx={{ position: "absolute", right: 5, backgroundColor: "white", zIndex: 1 }}
                  onClick={() => handleNextImage(product.productId, images.length)}
                  disabled={images.length <= 1}
                >
                  <ArrowForwardIosIcon />
                </IconButton>
              </Box>
            )}

            {/* Product Details */}
            <CardContent>
              <Typography variant="h6" fontWeight="bold">
                {product.name}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {product.description}
              </Typography>
              {/* ✅ Display price range */}
              <Typography variant="body1" fontWeight="bold" sx={{ marginTop: 1 }}>
                {priceRange}
              </Typography>

              {/* Actions */}
              <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: 2, flexDirection: "column" }}>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => navigate(`/products/${product.productId}`)}
                  sx={{ mb: 1 }}
                >
                  View
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleOnRemoveClick(product.productId)}>
                  Remove
                </Button>
              </Box>
            </CardContent>
          </Card>
        );
      })}
    </Box>
  );
};

export default WishlistItems;

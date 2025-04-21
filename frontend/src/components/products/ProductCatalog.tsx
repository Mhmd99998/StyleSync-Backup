import React, { useEffect, useState } from "react";
import { Container, Grid, Box, CircularProgress, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ProductCard from "./ProductCard";
import ProductService from "../../services/ProductService";
import { toast } from 'material-react-toastify';
import { PaginatedProductResponse, ProductDto } from "../../models/Product";
import Pagination from "../shared/Pagination";

const ProductCatalog: React.FC = () => {
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(20);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response: PaginatedProductResponse = await ProductService.getAllProducts(pageNumber, pageSize,
          {
            isArchived: false,
          });
        setProducts(response.products || []);
        setTotalProducts(response.totalProducts || 0);
        setLoading(false);
      } catch (error) {
        toast.error("Error fetching products");
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [pageNumber, pageSize]);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= Math.ceil(totalProducts / pageSize)) {
      setPageNumber(newPage);
    }
  };

  const handleCardClick = (productId: string) => {
    navigate(`/products/${productId}`);
  };

  const getDefaultImageUrl = (product: ProductDto): string | undefined => {
    for (const variant of product.variants) {
      if (variant.images && variant.images.length > 0) {
        const defaultImage = variant.images.find(img => img.isDefault);
        return defaultImage ? defaultImage.imageUrl : variant.images[0].imageUrl;
      }
    }
    return undefined;
  };
  
  const totalPages = Math.ceil(totalProducts / pageSize);
  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="40vh"
      >
        <CircularProgress size={60} thickness={5} />
        <Typography fontFamily={"'Montserrat', sans-serif"} fontWeight={300} mt={2}>Loading products...</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4, px: { xs: 1, sm: 2, md: 4 } }}>
      {/* Grid Layout with multiple columns */}
      <Grid container spacing={2} justifyContent="center">
        {products.map((product) => {
          const colors = [...new Set(product.variants.map((variant) => variant.color))];
          const prices = product.variants.map((variant) => variant.price);

          return (
            <Grid
              item
              key={product.productId}
              xs={12}
              sm={6}
              md={4}
              lg={3}
              xl={3}
            >
              <ProductCard
                name={product.name}
                colors={colors}
                prices={prices}
                imageUrl={getDefaultImageUrl(product)}
                onImageClick={() => handleCardClick(product.productId)}
                sx={{ height: "100%" }}
              />
            </Grid>
          );
        })}
      </Grid>

      {/* Pagination Component */}
      <Pagination
        pageNumber={pageNumber}
        totalPages={totalPages}
        handlePageChange={handlePageChange}
      />
    </Container>
  );
};

export default ProductCatalog;

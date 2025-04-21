import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Box, Typography, FormControlLabel, Checkbox, Autocomplete } from '@mui/material';
import { ProductDto } from '../../models/Product';
import ProductService from '../../services/ProductService';
import { toast } from 'material-react-toastify';
import VariantList from './VariantList';
import ProductDetailsForm from './ProductDetailsForm';
import AddVariantForm from './AddVariantForm';
import { CreateVariantDto } from '../../models/Variant';
import VariantService from '../../services/VariantService';
import { CategoryDto } from '../../models/Category';
import CategoryService from '../../services/CategoryService';
import CustomTextField from '../shared/CustomTextField';

const EditProduct: React.FC = () => {
  const navigate = useNavigate();
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<ProductDto | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isAddingVariant, setIsAddingVariant] = useState(false);

  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<CategoryDto[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);


  useEffect(() => {
    (async () => {
      try {
        const response = await ProductService.getProductById(productId!);
        setProduct(response);
        setSelectedCategories(response.categories);
      } catch (error) {
        toast.error(`Error loading product: ${productId}`);
        console.error('Error fetching product:', error);
      }

      try {
        setLoadingCategories(true);
        const allCategories = await CategoryService.getAllCategories();
        setCategories(allCategories);
      } catch (error) {
        toast.error("Error loading categories");
        console.error("Error loading categories", error);
      } finally {
        setLoadingCategories(false);
      }
    })();
  }, [productId]);


  const handleProductChange = (field: keyof ProductDto, value: string | boolean) => {
    if (!isSaving) setProduct(prev => prev ? { ...prev, [field]: value } : prev);
  };

  const handleSaveProduct = async () => {
    setIsSaving(true);
    try {
      await ProductService.updateProduct(product!.productId, {
        name: product!.name,
        description: product!.description,
        isArchived: product!.isArchived,
        categories: selectedCategories,
      });
      toast.success("Product details updated successfully!");
    } catch (error) {
      console.error("Failed to update product details", error);
      toast.error("Error updating product details");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddVariant = async (variant: CreateVariantDto) => {
    try {
      variant.productId = productId!;
      const newVariant = await VariantService.createVariant(variant);

      setProduct(prevProduct => prevProduct ? {
        ...prevProduct,
        variants: [...prevProduct.variants, newVariant]
      } : prevProduct);

      toast.success("Product variant added successfully!");
    } catch (error) {
      console.error("Failed to create new product variant", error);
      toast.error("Error creating new product variant");
    }
  };

  if (!product) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ padding: 3, mt: 6, mb: 3 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>Edit Product</Typography>

      <ProductDetailsForm product={product} onChange={handleProductChange} isSaving={isSaving} />

      <FormControlLabel
        control={<Checkbox checked={product.isArchived} onChange={e => handleProductChange("isArchived", e.target.checked)} disabled={isSaving} />}
        label="Archived"
        sx={{ mb: 2 }}
      />

      <Autocomplete
        multiple
        options={categories}
        getOptionLabel={(option) => option.name}
        value={selectedCategories}
        onChange={(_, newValue) => setSelectedCategories(newValue)}
        loading={loadingCategories}
        renderInput={(params) => (
          <CustomTextField
            {...params}
            label="Categories"
            placeholder="Select categories"
          />
        )}
        sx={{ mb: 3 }}
      />

      <Button variant="contained" color="primary" onClick={handleSaveProduct} disabled={isSaving} sx={{ mb: 3 }}>
        {isSaving ? "Saving..." : "Save Product Details"}
      </Button>

      <Typography variant="h5">Variants</Typography>

      <Button variant="contained" color="primary" onClick={() => setIsAddingVariant(true)} sx={{ mt: 2, mb: 3 }}>
        Add New Variant
      </Button>

      <VariantList product={product} setProduct={setProduct} isSaving={isSaving} />

      <AddVariantForm
        open={isAddingVariant}
        onClose={() => setIsAddingVariant(false)}
        onAdd={handleAddVariant}
        existingVariants={product.variants.map(v => ({ size: v.size, color: v.color }))}
      />

      <Button variant="outlined" color="secondary" onClick={() => navigate(-1)} disabled={isSaving}>
        Back
      </Button>
    </Box>
  );
};

export default EditProduct;

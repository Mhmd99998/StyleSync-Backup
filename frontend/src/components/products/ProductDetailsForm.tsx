import React from 'react';
import { Box } from '@mui/material';
import CustomTextField from '../shared/CustomTextField';
import { ProductDto } from '../../models/Product';

interface Props {
  product: ProductDto;
  onChange: (field: keyof ProductDto, value: string | boolean) => void;
  isSaving: boolean;
}

const ProductDetailsForm: React.FC<Props> = ({ product, onChange, isSaving }) => (
  <Box sx={{ mb: 2 }}>
    <CustomTextField label="Product Name" fullWidth value={product.name} onChange={value => onChange("name", value)} disabled={isSaving} />
    <CustomTextField label="Description" fullWidth multiline rows={3} value={product.description} onChange={value => onChange("description", value)} disabled={isSaving} sx={{ mt: 2 }} />
  </Box>
);

export default ProductDetailsForm;

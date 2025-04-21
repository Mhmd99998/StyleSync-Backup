import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Grid, Box, Typography } from '@mui/material';
import { CloudUpload } from '@mui/icons-material';
import { CreateVariantDto } from '../../models/Variant';

interface AddVariantFormProps {
  open: boolean;
  onClose: () => void;
  onAdd: (variant: CreateVariantDto) => Promise<void>;
  existingVariants: { size: string; color: string }[];
}

const AddVariantForm: React.FC<AddVariantFormProps> = ({ open, onClose, onAdd, existingVariants }) => {
  const [size, setSize] = useState<string>('');
  const [color, setColor] = useState<string>('');
  const [stock, setStock] = useState<number | ''>('');
  const [sku, setSku] = useState<string>('');
  const [price, setPrice] = useState<number | ''>('');
  const [images, setImages] = useState<File[]>([]);
  const [error, setError] = useState<string>('');
  const [fieldErrors, setFieldErrors] = useState({
    size: false,
    color: false,
    stock: false,
    sku: false,
    price: false,
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setImages([...images, ...Array.from(event.target.files)]);
    }
  };

  const handleSubmit = () => {
    // Check for empty fields
    const errors = {
      size: !size,
      color: !color,
      stock: stock === '' || stock < 0,
      sku: !sku,
      price: price === '' || price < 0,
    };

    setFieldErrors(errors);

    // If any field is empty, return early
    if (Object.values(errors).some((error) => error)) {
      setError('All fields are required.');
      return;
    }

    // Check for duplicate size & color combination
    const isDuplicate = existingVariants.some(v => v.size === size && v.color === color);
    if (isDuplicate) {
      setError('This size and color combination already exists.');
      return;
    }

    const createVariantDto: CreateVariantDto = {
      productId: '',
      size: size,
      color: color,
      stock: Number(stock),
      price: Number(price),
      sku: sku,
      images: [],
    };

    onAdd(createVariantDto);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ mb: 5 }}>Add Variant</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              label="Size"
              fullWidth
              value={size}
              onChange={(e) => setSize(e.target.value)}
              error={fieldErrors.size}
              helperText={fieldErrors.size ? "Size is required" : ""}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Color"
              fullWidth
              value={color}
              onChange={(e) => setColor(e.target.value)}
              error={fieldErrors.color}
              helperText={fieldErrors.color ? "Color is required" : ""}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Stock"
              fullWidth
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value === "" ? "" : Number(e.target.value))}
              error={fieldErrors.stock}
              helperText={fieldErrors.stock ? "Stock is required and must be a non-negative number" : ""}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="SKU"
              fullWidth
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              error={fieldErrors.sku}
              helperText={fieldErrors.sku ? "SKU is required" : ""}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Price"
              fullWidth
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value === "" ? "" : Number(e.target.value))}
              error={fieldErrors.price}
              helperText={fieldErrors.price ? "Price is required and must be a non-negative number" : ""}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1">Upload Images:</Typography>
            <input type="file" multiple accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} id="upload" />
            <label htmlFor="upload" style={{ cursor: 'pointer' }}>
              <Box sx={{ border: '1px dashed #ccc', padding: 2, textAlign: 'center' }}>
                <CloudUpload fontSize="large" />
                <Typography>Click to upload</Typography>
              </Box>
            </label>
          </Grid>
          {error && (
            <Grid item xs={12}>
              <Typography color="error">{error}</Typography>
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary" variant="outlined">Cancel</Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">Add</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddVariantForm;

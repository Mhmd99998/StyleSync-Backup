import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControlLabel,
  Checkbox,
  Autocomplete,
  CircularProgress
} from '@mui/material';
import CustomTextField from '../shared/CustomTextField';
import CategoryService from '../../services/CategoryService';
import { CategoryDto } from '../../models/Category';

interface NewProductModalProps {
  open: boolean;
  onClose: () => void;
  onProductCreated: (name: string, description: string, isArchived: boolean, categoryIds: string[]) => void;
}

const NewProductModal: React.FC<NewProductModalProps> = ({ open, onClose, onProductCreated }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isArchived, setIsArchived] = useState(false);
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<CategoryDto[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const data = await CategoryService.getAllCategories();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoadingCategories(false);
      }
    };

    if (open) {
      fetchCategories();
    }
  }, [open]);

  const handleCreate = async () => {
    const categoryIds = selectedCategories.map((c) => c.categoryId);
    setLoading(true);
    try {
      onProductCreated(name, description, isArchived, categoryIds);
      handleClose();
    } catch (error) {
      console.error('Error creating product:', error);
      setLoading(false);
    }
  };

  const handleClose = () => {
    setName('');
    setDescription('');
    setIsArchived(false);
    setSelectedCategories([]);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add New Product</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
        <CustomTextField
          label="Product Name"
          fullWidth
          value={name}
          onChange={setName}
          validate={(v) => (v.trim() === '' ? 'Name is required' : null)}
        />
        <CustomTextField
          label="Description"
          fullWidth
          multiline
          minRows={3}
          value={description}
          onChange={setDescription}
          validate={(v) => (v.trim() === '' ? 'Description is required' : null)}
        />
        <FormControlLabel
          control={<Checkbox checked={isArchived} onChange={(e) => setIsArchived(e.target.checked)} />}
          label="Archived"
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
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleCreate}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewProductModal;

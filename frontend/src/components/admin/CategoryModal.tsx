import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import CategoryService from "../../services/CategoryService";
import { toast } from "material-react-toastify";
import { CategoryDto } from "../../models/Category";

interface CategoryModalProps {
  open: boolean;
  mode: "add" | "edit";
  category?: CategoryDto;
  initialName?: string;
  onClose: () => void;
  onSave: () => void;
}

const CategoryModal: React.FC<CategoryModalProps> = ({
  open,
  mode,
  category,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState(category?.name || "");
  const [error, setError] = useState("");

  useEffect(() => {
    setName(category?.name || "");
    setError("");
  }, [category, open]);

  const handleSubmit = async () => {
    const trimmedName = name.trim();

    if (!trimmedName) {
      setError("Category name is required");
      return;
    }

    try {
      if (mode === "add") {
        await CategoryService.createCategory({ name: trimmedName });
        toast.success("Category created successfully!");
      } else if (mode === "edit" && trimmedName !== category?.name) {
        if (!category) return;

        await CategoryService.updateCategory(category.categoryId, { name: trimmedName });      
        toast.success("Category updated successfully!");
      }
      onSave();
      onClose();
    } catch (error: any) {
      setError(error?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        {mode === "add" ? "Add New Category" : "Edit Category"}
      </DialogTitle>

      <DialogContent>
        <TextField
          autoFocus
          fullWidth
          label="Category Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={!!error}
          helperText={error}
          variant="outlined"
          InputLabelProps={{ shrink: true }}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained">
          {mode === "add" ? "Add" : "Update"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CategoryModal;

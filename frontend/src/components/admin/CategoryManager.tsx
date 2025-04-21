import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Divider,
  useTheme,
  Paper,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import CategoryService from "../../services/CategoryService";
import { CategoryDto } from "../../models/Category";
import CategoryModal from "./CategoryModal";
import CloseIcon from "@mui/icons-material/Close";
import ConfirmationPopup from "../shared/ConfirmationPopup";
import { toast } from "material-react-toastify";

const CategoryManager: React.FC = () => {
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<CategoryDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<CategoryDto | undefined>(undefined);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<CategoryDto | null>(null);

  const theme = useTheme();

  useEffect(() => {
    fetchCategories();
  }, []);

  // Debounce search
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const term = search.toLowerCase().trim();
      if (term === "") {
        setFilteredCategories(categories);
      } else {
        setFilteredCategories(
          categories.filter((cat) =>
            cat.name.toLowerCase().includes(term)
          )
        );
      }
    }, 1000); // 1 second debounce

    return () => clearTimeout(delayDebounce);
  }, [search, categories]);

  const fetchCategories = async () => {
    try {
      const response = await CategoryService.getAllCategories();
      setCategories(response);
      setFilteredCategories(response);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return;
    try {
      await CategoryService.deleteCategory(categoryToDelete.categoryId);
      toast.success("Category deleted successfully!");
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
      fetchCategories(); // Refresh the list
    } catch (err) {
      toast.error("Failed to delete category");
      console.error("Error deleting category:", err);
    }
  };

  const openDeleteDialog = (category: CategoryDto) => {
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography
        variant="h6"
        fontFamily="'Poppins', sans-serif"
        fontWeight={400}
        gutterBottom
        mt={1}
      >
        CATEGORY MANAGER
      </Typography>

      <Divider sx={{ mb: 2 }} />

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontWeight: 300 }}
        >
          Manage your product categories
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            flexGrow: 1,
            justifyContent: "center",
          }}
        >
          <TextField
            size="small"
            variant="outlined"
            placeholder="Search category"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
              sx: {
                backgroundColor: "rgba(0, 0, 0, 0.03)",
                backdropFilter: "blur(4px)",
                borderRadius: 2,
              },
            }}
            sx={{
              width: 600,
              "& .MuiOutlinedInput-root": {
                backgroundColor: "rgba(255,255,255,0.04)",
              },
            }}
          />
        </Box>

        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          size="small"
          onClick={() => {
            setModalMode("add");
            setCategoryToEdit(undefined);
            setCategoryModalOpen(true);
          }}
        >
          ADD CATEGORY
        </Button>
      </Box>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
        {loading ? (
          <Typography>Loading...</Typography>
        ) : filteredCategories.length === 0 ? (
          <Typography>No categories found.</Typography>
        ) : (
          filteredCategories.map((category) => (
            <Paper
              key={category.name}
              elevation={2}
              sx={{
                position: "relative",
                px: 3,
                py: 1.5,
                borderRadius: 1,
                border: `1px solid ${theme.palette.divider}`,
                transition: "transform 0.2s",
                "&:hover": {
                  transform: "scale(1.05)",
                  borderColor: theme.palette.primary.main,
                },
                "&:hover .category-text::after": {
                  width: "90%",
                },
              }}
            >
              {/* Delete Button */}
              <IconButton
                size="small"
                sx={{
                  position: "absolute",
                  top: -10,
                  right: -12,
                  zIndex: 2,
                  color: theme.palette.error.main,
                  "&:hover": {
                    backgroundColor: "rgba(255, 0, 0, 0.05)",
                  },
                }}
                onClick={(e) => {
                  e.stopPropagation(); // prevent opening edit modal
                  openDeleteDialog(category);
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>

              {/* Clickable Category Name */}
              <Box
                onClick={() => {
                  setModalMode("edit");
                  setCategoryToEdit(category);
                  setCategoryModalOpen(true);
                }}
              >
                <Typography
                  variant="body2"
                  fontWeight={500}
                  color="text.primary"
                  className="category-text"
                  sx={{
                    textTransform: "capitalize",
                    position: "relative",
                    cursor: "pointer",
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      left: "50%",
                      bottom: 0,
                      transform: "translateX(-50%)",
                      width: "0%",
                      height: "2px",
                      backgroundColor: theme.palette.secondary.main,
                      transition: "width 0.25s ease-in-out",
                    },
                  }}
                >
                  {category.name}
                </Typography>
              </Box>
            </Paper>
          ))
        )}
      </Box>

      <CategoryModal
        open={categoryModalOpen}
        mode={modalMode}
        category={categoryToEdit}
        onClose={() => {
          setCategoryModalOpen(false);
          setCategoryToEdit(undefined);
        }}
        onSave={fetchCategories}
      />

      <ConfirmationPopup
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setCategoryToDelete(null);
        }}
        onConfirm={handleDeleteCategory}
        title="Delete Category"
        message={
          <>
            Are you sure you want to delete <strong>{categoryToDelete?.name}</strong>?
            This action cannot be undone.
          </>
        }
        confirmButtonText="Delete"
        confirmColor="error"
      />
    </Box>
  );
};

export default CategoryManager;

import React, { useState, useEffect } from 'react';
import { GridColDef, GridPaginationModel, GridRowId } from '@mui/x-data-grid';
import { Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ProductService from '../../services/ProductService';
import UniversalGrid from '../shared/UniveralGrid';
import ConfirmationPopup from '../shared/ConfirmationPopup';
import { ProductDto } from '../../models/Product';
import NewProductModal from './NewProductModal';
import CategoryService from '../../services/CategoryService';
import { toast } from 'material-react-toastify';

const ProductsGrid: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isNewProductOpen, setIsNewProductOpen] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [paginationModel]);

  const fetchProducts = async () => {
    try {
      const response = await ProductService.getAllProducts(paginationModel.page + 1, paginationModel.pageSize);
      const processedProducts = (response.products || response).map((product: any) => ({
        ...product,
        totalStock: product.variants.reduce((total: number, variant: any) => total + variant.stock, 0),
      }));
      setProducts(processedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleEdit = (id: GridRowId) => {
    const stringId = String(id);
    navigate(`/admin/products/edit/${stringId}`);
  };

  const handleDelete = (id: GridRowId) => {
    const stringId = String(id);
    setDeleteId(stringId);
    setIsConfirmOpen(true);
  };

  const handleNewProduct = () => {
    setIsNewProductOpen(true);
  };

  const handleProductCreated = async (
    name: string,
    description: string,
    isArchived: boolean,
    categoryIds: string[]
  ) => {
    try {
      // Step 1: Fetch full category objects
      const categoryPromises = categoryIds.map((id) => CategoryService.getCategoryById(id));
      const fullCategories = await Promise.all(categoryPromises);

      // Step 2: Create the product
      const newProduct = await ProductService.createProduct({
        name,
        description,
        isArchived,
        categories: fullCategories,
        variants: [],
      });

      const processedNewProduct = {
        ...newProduct,
        totalStock: newProduct.variants.reduce((total: number, variant: any) => total + variant.stock, 0),
      };
      setProducts((prevProducts) => [processedNewProduct, ...prevProducts]);

      // Step 3: Refresh grid and close modal
      await fetchProducts();
      setIsNewProductOpen(false);
      toast.success("Product created successfully!");
    } catch (error) {
      toast.error("Something went wrong");
      console.error('Error creating product:', error);
    }
  };


  const confirmDelete = async () => {
    if (deleteId) {
      try {
        await ProductService.deleteProduct(deleteId);
        toast.success("Product deleted successfully!");
        setIsConfirmOpen(false);
        setDeleteId(null);
        fetchProducts();
      } catch (error) {
        toast.error("Failed to delete product");
        console.error('Error deleting product:', error);
      }
    }
  };

  const columns: GridColDef[] = [
    { field: 'productId', headerName: 'ID', flex: 2 },
    { field: 'name', headerName: 'NAME', flex: 1 },
    { field: 'description', headerName: 'DESCRIPTION', flex: 5 },
    {
      field: 'totalStock',
      headerName: 'STOCK',
      flex: 0.8,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'edit',
      headerName: '',
      width: 120,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', mt: 0.8 }}>
          <Button
            variant="contained"
            color="primary"
            size="medium"
            onClick={() => handleEdit(params.id)}
          >
            EDIT
          </Button>
        </Box>
      ),
    },
    {
      field: 'delete',
      headerName: '',
      width: 120,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', mt: 0.8 }}>
          <Button
            variant="contained"
            color="secondary"
            size="medium"
            onClick={() => handleDelete(params.id)}
          >
            DELETE
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ padding: 3 }}>
      <Button
        variant="contained"
        color="secondary"
        size="medium"
        sx={{ mt: 2 }}
        onClick={handleNewProduct}>
        NEW PRODUCT
      </Button>

      <UniversalGrid
        rows={products}
        columns={columns}
        initialPageSize={paginationModel.pageSize}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        getRowId={(row) => row.productId}
      />

      {/* Confirmation Popup */}
      <ConfirmationPopup
        open={isConfirmOpen}
        title="Confirm Delete"
        message="Are you sure you want to delete this product?"
        onClose={() => setIsConfirmOpen(false)}
        confirmColor='error'
        onConfirm={confirmDelete}
      />

      {/* New Product Modal */}
      <NewProductModal
        open={isNewProductOpen}
        onClose={() => setIsNewProductOpen(false)}
        onProductCreated={handleProductCreated}
      />
    </Box>
  );
};

export default ProductsGrid;
import { Box, Button } from "@mui/material";
import { GridColDef, GridPaginationModel, GridRowId } from "@mui/x-data-grid";
import UniversalGrid from "../shared/UniveralGrid";
import ConfirmationPopup from "../shared/ConfirmationPopup";
import { useEffect, useState } from "react";
import { User } from "../../models/User";
import UserService from "../../services/UserService";
import { useNavigate } from "react-router-dom";
import { toast } from "material-react-toastify";

const UserGrid: React.FC = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState<User[]>([]);
  const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });

  const maskEmail = (email: string) => {
    const [localPart, domain] = email.split("@");
    if (!localPart || !domain) return email;

    const visiblePart = localPart.slice(-2);
    const maskedPart = "*".repeat(localPart.length - 2);

    return `${maskedPart}${visiblePart}@${domain}`;
  };

  useEffect(() => {
    fetchUsers();
  }, [paginationModel]);

  const fetchUsers = async () => {
    try {
      const response = await UserService.getUsers();
      console.log(response);
      setUsers(response);
    } catch (error) {
      throw new Error("Error fetching users");
    }
  };

  const handleEdit = async (userId: GridRowId) => {
    const stringId = String(userId);
    navigate(`/admin/users/edit/${stringId}`);
  }

  const handleDelete = async (userId: GridRowId) => {
    const stringId = String(userId);
    setDeleteId(stringId);
    setIsConfirmOpen(true);
  }

  const confirmDelete = async () => {
    if (!deleteId) return;

    try {
      await UserService.deleteUser(deleteId);
    } catch (error) {
      toast.error("Error deleting user");
      throw new Error("Failed to delete user");
    }
  }

  const columns: GridColDef[] = [
    { field: 'userId', headerName: 'ID', flex: 2 },
    {
      field: 'email',
      headerName: 'Email',
      flex: 2,
      renderCell: (params) => maskEmail(params.value) 
    },
    { field: 'role', headerName: 'Role', flex: 1 },
    {
      field: 'edit',
      headerName: '',
      width: 120,
      renderCell: (params) => (
        <Button variant="contained" color="primary" size="medium" onClick={() => handleEdit(params.id)}>
          Edit
        </Button>
      ),
    },
    {
      field: 'delete',
      headerName: '',
      width: 120,
      renderCell: (params) => (
        <Button variant="contained" color="secondary" size="medium" onClick={() => handleDelete(params.id)}>
          Delete
        </Button>
      ),
    },
  ];

  return (
    <Box sx={{ padding: 3 }}>
      <UniversalGrid
        key={users.length}
        rows={users}
        columns={columns}
        initialPageSize={paginationModel.pageSize}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        getRowId={(row) => row.userId ?? row.email}
      />

      {/* Confirmation Popup */}
      <ConfirmationPopup
        open={isConfirmOpen}
        title="Confirm Delete"
        message="Are you sure you want to delete this user?"
        onClose={() => setIsConfirmOpen(false)}
        confirmColor='error'
        onConfirm={confirmDelete}
      />
    </Box>
  );
}

export default UserGrid;
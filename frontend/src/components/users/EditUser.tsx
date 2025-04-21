import { Box, Button, FormControl, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { User } from "../../models/User";
import UserService from "../../services/UserService";
import { toast } from "material-react-toastify";

const maskEmail = (email: string) => {
  const [localPart, domain] = email.split("@");
  if (!localPart || !domain) return email;

  const visiblePart = localPart.slice(-2);
  const maskedPart = "*".repeat(localPart.length - 2);

  return `${maskedPart}${visiblePart}@${domain}`;
};

const EditUser: React.FC = () => {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<"customer" | "admin">("customer");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await UserService.getUserById(userId as string);
        setUser(response);
        setRole(response.role); 
      } catch (error) {
        toast.error("Failed to fetch user data");
        console.error("Error fetching user:", error);
      }
    };

    if (userId) fetchUser();
  }, [userId]);

  const handleUpdateUser = async () => {
    try {
      const updatedUser = {
        role: role
      }

      await UserService.updateUser(userId!, updatedUser);
      toast.success("User updated successfully");
      navigate(-1);      
    } catch (error) {
      toast.error("Failed to update user");
      throw new Error("Failed to update user");
    }
  };

  if (!user) return <Typography>Loading user details...</Typography>;

  return (
    <Box sx={{
      padding: 3,
      maxWidth: 500,
      margin: "auto",
      mt: 10,
      display: "flex",
      flexDirection: "column",
      gap: 2,
      border: "2px solid",
      borderRadius: "8px",
    }}>
      <Typography variant="h5">Edit User</Typography>

      <Typography><strong>First Name:</strong> {user.firstName}</Typography>
      <Typography><strong>Last Name:</strong> {user.lastName}</Typography>
      <Typography><strong>Email:</strong> {maskEmail(user.email)}</Typography>
      <Typography><strong>Account Created:</strong> {new Date(user.createdAt).toLocaleDateString()}</Typography>
      <Typography><strong>Email Verified:</strong> {user.isEmailVerified ? "Yes" : "No"}</Typography>

      {/* Role selection */}
      <FormControl fullWidth>
        <InputLabel>Role</InputLabel>
        <Select value={role} onChange={(e) => setRole(e.target.value as "customer" | "admin")}>
          <MenuItem value="customer">Customer</MenuItem>
          <MenuItem value="admin">Admin</MenuItem>
        </Select>
      </FormControl>

      <Button variant="contained" color="primary" onClick={handleUpdateUser}>
        Save Changes
      </Button>
    </Box>
  );
};

export default EditUser;

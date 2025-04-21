import React, { useEffect, useState } from "react";
import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import { HexColorPicker } from "react-colorful";

interface AddColorModalProps {
  open: boolean;
  existingNames: string[];
  onClose: () => void;
  onSave: (newName: string, newColorValue: string) => void;
}

const AddColorModal: React.FC<AddColorModalProps> = ({
  open,
  existingNames,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState("");
  const [color, setColor] = useState("#cccccc");
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setName("");
      setColor("#cccccc");
      setError("");
    }
  }, [open]);

  const handleSave = () => {
    const trimmedName = name.trim();
    const nameConflict = existingNames.includes(trimmedName);

    if (!trimmedName) {
      setError("Name is required.");
    } else if (nameConflict) {
      setError("Name already exists. Please choose another.");
    } else {
      onSave(trimmedName, color.trim());
      onClose();
    }
  };

  const handleColorChange = (newColor: string) => setColor(newColor);

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setColor(e.target.value.trim());
  };

  const handleHexBlur = () => {
    if (!/^#[0-9A-Fa-f]{6}$/i.test(color)) {
      setColor("#ffffff");
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          p: 3,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 8,
          width: 320,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Typography variant="h6" fontWeight={400}>
          ADD NEW COLOR
        </Typography>

        <TextField
          label="Color Name"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={!!error}
          helperText={error}
        />

        <Box>
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            Pick a Color:
          </Typography>
          <HexColorPicker
            color={color}
            onChange={handleColorChange}
            style={{ width: "100%", height: "180px" }}
          />
        </Box>

        <TextField
          label="Hex Color"
          fullWidth
          value={color}
          onChange={handleHexChange}
          onBlur={handleHexBlur}
          error={!!error}
          helperText={error}
        />

        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
          <Button onClick={onClose} color="inherit">
            CANCEL
          </Button>
          <Button onClick={handleSave} variant="contained">
            SAVE
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AddColorModal;

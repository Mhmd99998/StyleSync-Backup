import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, ButtonProps } from '@mui/material';
import React from 'react';

interface ConfirmationPopupProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  title: string;
  message: React.ReactNode;
  confirmButtonText?: string;
  confirmColor?: ButtonProps["color"];
  cancelButtonText?: string; 
}

const ConfirmationPopup: React.FC<ConfirmationPopupProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmButtonText = 'Confirm',
  confirmColor = 'primary',
  cancelButtonText = 'Cancel'
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText component="div">{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          {cancelButtonText}
        </Button>
        <Button onClick={onConfirm} color={confirmColor} variant="contained">
          {confirmButtonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationPopup;

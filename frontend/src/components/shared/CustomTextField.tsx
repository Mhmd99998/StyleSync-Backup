import React, { useState, useEffect } from 'react';
import { TextField, TextFieldProps } from '@mui/material';

interface CustomTextFieldProps extends Omit<TextFieldProps, 'error' | 'onChange'> {
  validate?: (value: string) => string | null;
  onChange?: (value: string) => void;
  disabled?: boolean;
  value?: string; 
}

const CustomTextField: React.FC<CustomTextFieldProps> = ({ validate, onChange, disabled, value = '', ...props }) => {
  const [inputValue, setInputValue] = useState<string>(value ?? '');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (value !== inputValue) {
      setInputValue(value ?? '');
    }
  }, [value]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setInputValue(newValue);

    // Handle validation if it exists
    if (validate) {
      const validationError = validate(newValue);
      setError(validationError);
    }

    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <TextField
      {...props}
      value={inputValue}
      onChange={handleChange}
      error={Boolean(error)}  // Set error if validation fails
      helperText={error}  // Pass the error message
      disabled={disabled}
    />
  );
};

export default CustomTextField;

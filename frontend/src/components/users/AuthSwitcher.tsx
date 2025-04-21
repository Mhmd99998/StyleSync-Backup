import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  Alert,
  Collapse,
} from '@mui/material';
import CustomTextField from '../shared/CustomTextField';
import AuthService from '../../services/AuthService';
import UserService, { RegisterRequest } from '../../services/UserService';
import CartService from '../../services/CartService';
import { useNavigate } from 'react-router-dom';
import { toast } from 'material-react-toastify';
import { useDispatch } from 'react-redux';
import { login } from '../../redux/slices/userSlice';

const validateName = (name: string) => name.length >= 2 ? null : 'Must be at least 2 characters';
const validateEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? null : 'Invalid email format';
const validatePassword = (password: string) =>
  password.length >= 6 ? null : 'Password must be at least 6 characters';

const AuthSwitcher: React.FC = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const toggleForm = () => {
    setError(null);
    setIsRegistering(!isRegistering);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const authResponse = await AuthService.login({ email, password });
      const token = authResponse?.token;
      const expiresIn = authResponse?.expiresIn;

      if (token && expiresIn) {
        localStorage.setItem('token', token);
        localStorage.setItem('tokenExpiration', expiresIn.toString());

        const user = await UserService.getUserByEmail(email);
        if (!user) throw new Error('User not found.');

        dispatch(
          login({
            token,
            tokenExpiration: expiresIn,
            email: user.email,
            userId: user.userId,
            role: user.role,
          })
        );

        navigate("/");
        // navigate(user.role === 'admin' ? '/admin' : '/');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const confirmPassError = confirmPassword === password ? null : 'Passwords do not match';
    if (confirmPassError) {
      setError(confirmPassError);
      setIsSubmitting(false);
      return;
    }

    const registerData: RegisterRequest = {
      email,
      password,
      firstName,
      lastName,
    };

    try {
      const user = await UserService.register(registerData);
      await AuthService.sendVerificationEmail(user.email);
      await CartService.createCart(user.userId);
      toast.warning('A verification link has been sent to your Email.');
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          position: 'relative',
          height: 560,
          width: isRegistering ? 600 : 400,
          transition: 'width 0.4s ease',
          margin: '30px auto',
        }}
      >
        <Paper elevation={3} sx={{ p: 4, borderRadius: 1, height: '100%' }}>
          <Box sx={{ position: 'absolute', inset: 0 }}>
            {/* Login Form */}
            <Collapse in={!isRegistering} timeout={400} unmountOnExit>
              <Box component="form" onSubmit={handleLogin} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <Typography variant="h5" align="center" gutterBottom sx={{ mt: 2 }}>
                  LOGIN
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 2, mt: 2, margin: 3 }}>
                  <CustomTextField
                    fullWidth
                    label="Email"
                    type="email"
                    validate={validateEmail}
                    onChange={setEmail}
                    required
                    disabled={isSubmitting}
                  />
                  <CustomTextField
                    fullWidth
                    label="Password"
                    type="password"
                    validate={validatePassword}
                    onChange={setPassword}
                    required
                    disabled={isSubmitting}
                  />
                </Box>

                <Button
                  type="submit"
                  variant="contained"
                  sx={{ m: 3, py: 1.5, fontSize: '1rem' }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'LOGGING IN...' : 'PROCEED'}
                </Button>
              </Box>
            </Collapse>

            {/* Register Form */}
            <Collapse in={isRegistering} timeout={400} unmountOnExit>
              <Box
                component="form"
                onSubmit={handleRegister}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%'
                }}>
                <Typography variant="h5" align="center" gutterBottom sx={{ mt: 2 }}>
                  REGISTER
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                <Box
                  sx={{
                    flexGrow: 1,
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 2,
                    mt: 2,
                    margin: 3
                  }}
                >
                  <CustomTextField
                    label="First Name"
                    validate={validateName}
                    onChange={setFirstName}
                    required
                    disabled={isSubmitting}
                  />
                  <CustomTextField
                    label="Last Name"
                    validate={validateName}
                    onChange={setLastName}
                    required
                    disabled={isSubmitting}
                  />
                  <CustomTextField
                    label="Email"
                    type="email"
                    validate={validateEmail}
                    onChange={setEmail}
                    required
                    disabled={isSubmitting}
                    sx={{ gridColumn: '1 / -1' }}
                  />
                  <CustomTextField
                    label="Password"
                    type="password"
                    validate={validatePassword}
                    onChange={setPassword}
                    required
                    disabled={isSubmitting}
                  />
                  <CustomTextField
                    label="Confirm Password"
                    type="password"
                    validate={(val) => (val === password ? null : 'Passwords do not match')}
                    onChange={setConfirmPassword}
                    required
                    disabled={isSubmitting}
                  />
                </Box>

                <Button
                  type="submit"
                  variant="contained"
                  sx={{ m: 3, py: 1.5, fontSize: '1rem' }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'REGISTERING...' : 'PROCEED'}
                </Button>
              </Box>
            </Collapse>
          </Box>

          {/* Switcher Link */}
          <Box sx={{ position: 'absolute', bottom: 16, left: 0, right: 0, textAlign: 'center' }}>
            <Typography variant="body2">
              {isRegistering ? 'Already have an account?' : "Don't have an account?"}
            </Typography>
            <Button
              size="small"
              onClick={toggleForm}
              sx={{
                position: 'relative',
                textTransform: 'none',
                color: 'primary.main',
                backgroundColor: 'transparent',
                paddingBottom: '0.5px',
                '&:hover': {
                  backgroundColor: 'transparent',
                },
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  left: '50%', // Start from the center
                  bottom: 0,
                  width: '0%',
                  height: '1px', // Thinner line
                  backgroundColor: 'primary.main',
                  transition: 'width 0.3s ease',
                  transform: 'translateX(-50%)', // Adjust to center align
                },
                '&:hover::after': {
                  width: '90%', // Line expands to 90% on hover
                },
              }}
            >
              {isRegistering ? 'Login here' : 'Register here'}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default AuthSwitcher;

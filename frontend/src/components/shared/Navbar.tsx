import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Button,
  Menu,
  MenuItem,
  Tooltip,
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store';
import { toggleTheme } from '../../redux/slices/themeSlice';
import { useNavigate } from 'react-router-dom';

import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import MenuIcon from '@mui/icons-material/Menu';
import { logout } from '../../redux/slices/userSlice';

interface NavbarProps {
  onSearchToggle?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onSearchToggle }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const isDarkMode = useSelector((state: RootState) => state.theme.isDarkMode);
  const isLoggedIn = useSelector((state: RootState) => state.user.isAuthenticated);
  const role = useSelector((state: RootState) => state.user.role);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMenuAnchorEl, setMobileMenuAnchorEl] = useState<null | HTMLElement>(null);

  const handleProfileOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    handleProfileClose();
    navigate('/');
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMenuAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchorEl(null);
  };

  const navItems = ['NEW ARRIVALS', 'MEN', 'WOMEN', 'BEST SELLERS', 'ABOUT'];

  const profileMenu = (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleProfileClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      MenuListProps={{ onMouseLeave: handleProfileClose, sx: { paddingY: 0.5 } }}
      PaperProps={{ sx: { width: 150 } }}
    >
      {isLoggedIn ? (
        <>
          <MenuItem
            onClick={() => {
              navigate('/profile');
              handleProfileClose();
            }}
            sx={menuItemStyle}
          >
            Profile
          </MenuItem>
          <MenuItem onClick={handleLogout} sx={menuItemStyle}>
            Logout
          </MenuItem>
        </>
      ) : (
        <MenuItem
          onClick={() => {
            navigate('/auth');
            handleProfileClose();
          }}
          sx={menuItemStyle}
        >
          Login / Register
        </MenuItem>
      )}
    </Menu>
  );

  const mobileNavMenu = (
    <Menu
      anchorEl={mobileMenuAnchorEl}
      open={Boolean(mobileMenuAnchorEl)}
      onClose={handleMobileMenuClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      MenuListProps={{ sx: { py: 1 } }}
      PaperProps={{
        sx: {
          width: 200,
          backgroundColor: 'background.paper',
          boxShadow: 2,
        },
      }}
    >
      {navItems.map((label, index) => (
        <MenuItem
          key={index}
          onClick={() => {
            navigate(`/${label.toLowerCase().replace(' ', '-')}`);
            handleMobileMenuClose();
          }}
          sx={menuItemStyle}
        >
          {label}
        </MenuItem>
      ))}
    </Menu>
  );

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: 'background.paper',
        color: 'text.primary',
        px: 4,
        boxShadow: 2,
        fontFamily: "'Montserrat', sans-serif",
        zIndex: theme => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography
          variant="h5"
          onClick={() => navigate('/')}
          sx={{
            cursor: 'pointer',
            userSelect: 'none',
            transition: 'color 0.3s',
            '&:hover': { color: 'primary.main' },
          }}
        >
          StyleSync
        </Typography>

        <Box
          sx={{
            display: { xs: 'none', md: 'flex' },
            gap: 4,
            justifyContent: 'center',
            alignItems: 'center',
            flexGrow: 1,
          }}
        >
          {navItems.map((label, index) => (
            <Button
              key={index}
              color="inherit"
              sx={{
                fontSize: 15,
                fontWeight: 500,
                textTransform: 'none',
                position: 'relative',
                '&:hover': {
                  color: 'primary.main',
                  backgroundColor: 'transparent',
                },
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  bottom: -6,
                  width: '100%',
                  height: '2px',
                  backgroundColor: 'secondary.main',
                  transform: 'scaleX(0)',
                  transformOrigin: 'center',
                  transition: 'transform 0.3s ease',
                },
                '&:hover::after': {
                  transform: 'scaleX(1)',
                },
              }}
              onClick={() => navigate(`/${label.toLowerCase().replace(' ', '-')}`)}
            >
              {label}
            </Button>
          ))}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {isLoggedIn && role === 'admin' && (
            <Tooltip title="Switch to Admin Dashboard" arrow>
              <IconButton onClick={() => navigate('/admin')} sx={iconButtonStyle}>
                <AdminPanelSettingsOutlinedIcon sx={{ fontSize: 26 }} />
              </IconButton>
            </Tooltip>
          )}

          <IconButton onMouseEnter={handleProfileOpen} sx={iconButtonStyle}>
            <AccountCircleOutlinedIcon sx={{ fontSize: 26 }} />
          </IconButton>
          {profileMenu}

          <IconButton onClick={onSearchToggle} sx={iconButtonStyle}>
            <SearchOutlinedIcon sx={{ fontSize: 26 }} />
          </IconButton>

          <IconButton onClick={() => navigate('/cart')} sx={iconButtonStyle}>
            <ShoppingBagOutlinedIcon sx={{ fontSize: 26 }} />
          </IconButton>

          <IconButton onClick={() => dispatch(toggleTheme())} sx={iconButtonStyle}>
            {isDarkMode ? (
              <DarkModeIcon sx={{ fontSize: 24 }} />
            ) : (
              <LightModeIcon sx={{ fontSize: 24 }} />
            )}
          </IconButton>

          <IconButton
            onClick={handleMobileMenuOpen}
            sx={{
              display: { xs: 'flex', md: 'none' },
              p: 1,
              transition: 'all 0.3s ease-in-out',
              color: 'primary.main',
              '&:hover': {
                backgroundColor: 'transparent',
                color: 'secondary.main',
              },
            }}
          >
            <MenuIcon sx={{ fontSize: 26 }} />
          </IconButton>
        </Box>
      </Toolbar>
      {mobileNavMenu}
    </AppBar>
  );
};

const menuItemStyle = {
  justifyContent: 'center',
  textAlign: 'center',
  py: 1,
  fontWeight: 500,
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    backgroundColor: 'transparent',
    color: 'primary.main',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 4,
    left: '50%',
    width: '80%',
    height: '1px',
    backgroundColor: 'primary.main',
    transform: 'translateX(-50%) scaleX(0)',
    transformOrigin: 'center',
    transition: 'transform 0.3s ease-in-out',
  },
  '&:hover::after': {
    transform: 'translateX(-50%) scaleX(1)',
  },
};

const iconButtonStyle = {
  p: 1,
  transition: 'all 0.3s ease-in-out',
  color: 'primary.main',
  '&:hover': {
    backgroundColor: 'transparent',
    color: 'secondary.main',
  },
};

export default Navbar;

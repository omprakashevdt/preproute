import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Avatar,
  Typography,
  Button,
  Menu,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LogoutIcon from "@mui/icons-material/Logout";
import { useSelector, useDispatch } from "react-redux";
import type { AppDispatch, RootState } from "../redux/store";
import { logout } from "../redux/slice/auth/authSlice";
import { useState } from "react";

const logoImg = "/preproute lofo.png";

interface NavbarProps {
  onMenuClick: () => void;
  onCollapseToggle: () => void; 
}

const Navbar = ({ onMenuClick, onCollapseToggle }: NavbarProps) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    dispatch(logout());
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        backgroundColor: "#fff",
        color: "#000",
        borderBottom: "1px solid #eee",
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar>

        <IconButton
          onClick={onCollapseToggle}
          sx={{ display: { xs: "none", md: "inline-flex" }, mr: 1 }}
        >
          <MenuIcon />
        </IconButton>


        <IconButton
          onClick={onMenuClick}
          sx={{ display: { xs: "inline-flex", md: "none" }, mr: 1 }}
        >
          <MenuIcon />
        </IconButton>

        {/* Logo */}
        <Box
          component="img"
          src={logoImg}
          alt="PrepRoute Logo"
          sx={{
            height: 32,
            mr: 2,
            cursor: "pointer",
          }}
        />

        <Box flexGrow={1} />

        <IconButton>
          <NotificationsIcon />
        </IconButton>

        {/* User Profile Trigger */}
        <Box
          display="flex"
          alignItems="center"
          ml={2}
          mr={2}
          onClick={handleMenuOpen}
          sx={{ cursor: "pointer" }}
        >
          <Avatar sx={{ width: 32, height: 32, mr: 1 }}>
            {user?.name?.charAt(0).toUpperCase()}
          </Avatar>
          <Box display={{ xs: "none", sm: "block" }}>
            <Typography fontSize={14}>{user?.name || "User"}</Typography>
            <Typography fontSize={12} color="gray">
              {user?.role || "Role"}
            </Typography>
          </Box>
        </Box>

        {/* Profile Menu */}
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          onClick={handleMenuClose}
          slotProps={{
            paper: {
              elevation: 4,
              sx: {
                minWidth: 250,
                mt: 1.5,
                borderRadius: 2,
                p: 1,
              },
            },
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <Box
            display="flex"
            alignItems="center"
            px={2}
            py={1}
            gap={1.5}
            mb={1}
          >
            <Avatar sx={{ width: 40, height: 40 }}>
              {user?.name?.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography fontWeight={600} fontSize={15}>
                {user?.name || "User"}
              </Typography>
              <Typography fontSize={12} color="text.secondary">
                {user?.userId || user?.role || "Info"}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ mb: 1.5 }} />

          <Box px={2} pb={1}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              sx={{
                backgroundColor: "#d32f2f",
                color: "#fff",
                textTransform: "none",
                borderRadius: 2,
                "&:hover": {
                  backgroundColor: "#b71c1c",
                },
              }}
            >
              Logout
            </Button>
          </Box>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

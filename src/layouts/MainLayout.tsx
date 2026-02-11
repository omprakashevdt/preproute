import { Box, Toolbar } from "@mui/material";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./NavBar";
import Sidebar from "./SideBar";

const drawerWidth = 260;
const collapsedWidth = 80;

const MainLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  const handleCollapseToggle = () => {
    setCollapsed((prev) => !prev);
  };

  return (
    <Box display="flex">
      <Navbar
        onMenuClick={handleDrawerToggle}
        onCollapseToggle={handleCollapseToggle}
      />

      <Sidebar
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        collapsed={collapsed}
        onCollapseToggle={handleCollapseToggle}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 0, md: 3 },
          width: { xs: "100%", md: "auto" },
          ml: {
            xs: 0,
            md: collapsed ? `${collapsedWidth}px` : `${drawerWidth}px`,
          },
          transition: "margin 0.3s ease",
          maxWidth: "100vw",
          overflowX: "hidden",
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default MainLayout;

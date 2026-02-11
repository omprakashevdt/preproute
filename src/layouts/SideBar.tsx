import {
  Drawer,
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
  Tooltip,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import QuizIcon from "@mui/icons-material/Quiz";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import SettingsIcon from "@mui/icons-material/Settings";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useLocation, useNavigate } from "react-router-dom";
import { colors } from "../theme/colors";

const drawerWidth = 260;
const collapsedWidth = 80;

interface SidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
  collapsed: boolean;
  onCollapseToggle: () => void;
}

const menuItems = [
  { label: "Dashboard", path: "/dashboard", icon: <DashboardIcon /> },
  { label: "Creation Test", path: "/create-test", icon: <QuizIcon /> },
  {
    label: "Test Tracking",
    path: "/test-tracking",
    icon: <TrackChangesIcon />,
  },
  { label: "Settings", path: "/settings", icon: <SettingsIcon /> },
];

const Sidebar = ({
  mobileOpen,
  onClose,
  collapsed,
  onCollapseToggle,
}: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const content = (isMobile?: boolean) => (
    <Box>
      {/* Header */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent={collapsed ? "center" : "space-between"}
        px={2}
        py={2}
      >
        {!collapsed && (
          <Typography fontWeight={700} fontSize={18}>
            PrepRoute
          </Typography>
        )}
        {!isMobile && (
          <IconButton onClick={onCollapseToggle}>
            {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        )}
      </Box>

      {/* Menu */}
      <List>
        {menuItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);

          return (
            <Tooltip
              key={item.label}
              title={collapsed ? item.label : ""}
              placement="right"
            >
              <ListItemButton
                selected={isActive}
                onClick={() => {
                  navigate(item.path);
                  onClose();
                }}
                sx={{
                  mx: 1,
                  mb: 0.5,
                  borderRadius: 1,
                  justifyContent: collapsed ? "center" : "flex-start",
                  "&.Mui-selected": {
                    backgroundColor: "#EEF2FF",
                    color: colors.primary,
                    "& .MuiListItemIcon-root": {
                      color: colors.primary.dark,
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: collapsed ? "auto" : 40,
                    justifyContent: "center",
                  }}
                >
                  {item.icon}
                </ListItemIcon>

                {!collapsed && <ListItemText primary={item.label} />}
              </ListItemButton>
            </Tooltip>
          );
        })}
      </List>
    </Box>
  );

  return (
    <>
      {/* Desktop */}
      <Drawer
        variant="permanent"
        open
        sx={{
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": {
            width: collapsed ? collapsedWidth : drawerWidth,
            transition: "width 0.3s ease",
            boxSizing: "border-box",
            borderRight: "1px solid #eee",
            overflowX: "hidden",
          },
        }}
      >
        {content(false)}
      </Drawer>

      {/* Mobile */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
          },
        }}
      >
        {content(true)}
      </Drawer>
    </>
  );
};

export default Sidebar;

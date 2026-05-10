import {
  AppBar, Toolbar, Typography, Button, Box, IconButton, Tooltip,
  Avatar, Drawer, List, ListItem, ListItemIcon, ListItemText, Divider,
} from "@mui/material";
import {
  Dashboard, People, Group, RestaurantMenu, Receipt,
  PointOfSale, Logout, AccountCircle, Menu as MenuIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";

const menuItems = [
  { label: "Dashboard", icon: <Dashboard />, path: "/home" },
  { label: "Funcionários", icon: <People />, path: "/funcionarios" },
  { label: "Clientes", icon: <Group />, path: "/clientes" },
  { label: "Produtos", icon: <RestaurantMenu />, path: "/produtos" },
  { label: "Comandas", icon: <Receipt />, path: "/comandas" },
  { label: "Caixa", icon: <PointOfSale />, path: "/caixa" },
];

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout, usuarioLogado } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = () => { setDrawerOpen(false); logout(); };
  const navTo = (path) => { setDrawerOpen(false); navigate(path); };

  const drawer = (
    <Box sx={{ width: 260 }}>
      <Box sx={{ p: 2, background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar sx={{ bgcolor: "#f59e0b", width: 40, height: 40, fontWeight: 700 }}>
            {usuarioLogado?.nome?.[0] || "U"}
          </Avatar>
          <Box>
            <Typography variant="body1" fontWeight={700} color="white">
              {usuarioLogado?.nome || "Usuário"}
            </Typography>
            <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.6)" }}>
              Mat. {usuarioLogado?.matricula || "-"}
            </Typography>
          </Box>
        </Box>
      </Box>
      <List>
        {menuItems.map((item) => (
          <ListItem
            button key={item.path}
            onClick={() => navTo(item.path)}
            sx={{ "&:hover": { bgcolor: "rgba(30,41,59,0.06)" }, cursor: "pointer" }}
          >
            <ListItemIcon sx={{ color: "primary.main" }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <ListItem button onClick={() => navTo("/perfil")} sx={{ cursor: "pointer", "&:hover": { bgcolor: "rgba(30,41,59,0.06)" } }}>
          <ListItemIcon sx={{ color: "primary.main" }}><AccountCircle /></ListItemIcon>
          <ListItemText primary="Perfil" />
        </ListItem>
        <ListItem button onClick={handleLogout} sx={{ cursor: "pointer", "&:hover": { bgcolor: "rgba(239,68,68,0.08)" } }}>
          <ListItemIcon sx={{ color: "error.main" }}><Logout /></ListItemIcon>
          <ListItemText primary="Sair" sx={{ color: "error.main" }} />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <AppBar position="sticky" elevation={2}>
      <Toolbar sx={{ minHeight: 64, px: { xs: 1, sm: 2 } }}>
        {/* Logo */}
        <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
          <Typography
            variant="h5" component="div"
            sx={{
              fontWeight: 700,
              background: "linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              backgroundClip: "text", display: "flex", alignItems: "center", gap: 1,
              fontSize: { xs: "1.2rem", sm: "1.5rem" }, cursor: "pointer",
            }}
            onClick={() => isAuthenticated && navigate("/home")}
          >
            <RestaurantMenu sx={{ color: "#f59e0b", fontSize: { xs: "1.5rem", sm: "2rem" } }} />
            <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>Comandas do Zé</Box>
            <Box component="span" sx={{ display: { xs: "inline", sm: "none" } }}>Zé</Box>
          </Typography>
        </Box>

        {/* Menu desktop */}
        {isAuthenticated && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Box sx={{ display: { xs: "none", lg: "flex" }, alignItems: "center", gap: 0.5 }}>
              {menuItems.map((item) => (
                <Tooltip key={item.path} title={item.label} arrow>
                  <Button
                    color="inherit"
                    onClick={() => navigate(item.path)}
                    sx={{
                      minWidth: "auto", px: 1.2, py: 0.8, borderRadius: 2,
                      display: "flex", alignItems: "center", gap: 0.5,
                      "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
                    }}
                  >
                    {item.icon}
                    <Typography variant="body2" sx={{ ml: 0.3, display: { xs: "none", xl: "inline" } }}>
                      {item.label}
                    </Typography>
                  </Button>
                </Tooltip>
              ))}
            </Box>

            {/* Perfil e logout desktop */}
            <Box sx={{ display: { xs: "none", lg: "flex" }, alignItems: "center", gap: 0.5, ml: 1 }}>
              <Tooltip title="Perfil" arrow>
                <IconButton color="inherit" onClick={() => navigate("/perfil")}>
                  <Avatar sx={{ width: 32, height: 32, bgcolor: "#f59e0b", fontSize: ".9rem", fontWeight: 700 }}>
                    {usuarioLogado?.nome?.[0] || <AccountCircle />}
                  </Avatar>
                </IconButton>
              </Tooltip>
              <Tooltip title="Sair" arrow>
                <IconButton color="inherit" onClick={handleLogout} sx={{ "&:hover": { bgcolor: "rgba(239,68,68,0.15)" } }}>
                  <Logout />
                </IconButton>
              </Tooltip>
            </Box>

            {/* Hamburguer mobile */}
            <IconButton
              color="inherit"
              onClick={() => setDrawerOpen(true)}
              sx={{ display: { xs: "flex", lg: "none" }, "&:hover": { bgcolor: "rgba(255,255,255,0.1)" } }}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        )}
      </Toolbar>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{ display: { xs: "block", lg: "none" }, "& .MuiDrawer-paper": { width: 260 } }}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
};

export default Navbar;
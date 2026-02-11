import { Box, CircularProgress } from "@mui/material";
    
const logoImg = "/preproute lofo.png";

const Loader = () => {
  return (
    <Box
      sx={{
        height: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <CircularProgress />
      <Box
        component="img"
        src={logoImg}
        alt="PrepRoute Logo"
        sx={{ maxWidth: "80%", height: "auto" }}
      />
    </Box>
  );
};

export default Loader;

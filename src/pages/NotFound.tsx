import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { colors } from "../theme/colors";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        backgroundColor: colors.background.default,
        p: 3,
      }}
    >
      <Typography variant="h1" fontWeight="bold" color="primary" gutterBottom>
        404
      </Typography>
      <Typography variant="h5" color="text.secondary" paragraph>
        Oops! The page you are looking for does not exist.
      </Typography>
      <Button
        variant="contained"
        size="large"
        onClick={() => navigate("/")}
        sx={{ mt: 2 }}
      >
        Go Back Home
      </Button>
    </Box>
  );
};

export default NotFound;

import { Box, Grid, Paper } from "@mui/material";
import LoginForm from "../components/auth/LoginForm";

const testTubeImg = "/test-tube-man.png";

const Login = () => {
  return (
    <Grid container minHeight="100vh">
      {/* Left Illustration */}
      <Grid
        size={{ xs: 12, md: 6 }}
        display={{ xs: "flex", md: "flex" }}
        alignItems="center"
        justifyContent="center"
        sx={{ backgroundColor: "#F7FAFF" }}
      >
        <Box
          component="img"
          src={testTubeImg}
          alt="Login Illustration"
          sx={{ maxWidth: "80%", height: "auto" }}
        />
      </Grid>

      {/* Right Login Form */}
      <Grid
        size={{ xs: 12, md: 6 }}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Paper
          elevation={0}
          sx={{
            width: "100%",
            maxWidth: 420,
            p: 4,
            borderRadius: 2,
            border: "1px solid #E0E7FF",
          }}
        >
          <LoginForm />
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Login;

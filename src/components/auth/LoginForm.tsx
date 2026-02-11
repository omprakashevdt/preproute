import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Box,
  Link,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
const logoImg = "/preproute lofo.png";
import CustomButton from "../common/CustomButton";
import { colors } from "../../theme/colors";
import {
  login,
  clearAuthError,
  resetLoginState,
} from "../../redux/slice/auth/authSlice";
import type { AppDispatch, RootState } from "../../redux/store";

interface LoginFormInputs {
  userId: string;
  password: string;
}

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { loading, error, isAuthenticated, success } = useSelector(
    (state: RootState) => state.auth,
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    defaultValues: {
      userId: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormInputs) => {
    dispatch(login(data));
  };

  useEffect(() => {
    if (success && isAuthenticated) {
      toast.success("Login Successful!", {
        toastId: "login-success",
      });
      dispatch(resetLoginState());
      navigate("/dashboard");
    }
  }, [success, isAuthenticated, navigate, dispatch]);

  useEffect(() => {
    if (error) {
      dispatch(clearAuthError());
    }
  }, [error, dispatch]);

  return (
    <Box>
      <Box mb={3}>
        <Box
          component="img"
          src={logoImg}
          alt="PrepRoute Logo"
          sx={{ maxWidth: "80%", height: "auto" }}
        />
      </Box>

      {/* Heading */}
      <Typography
        variant="h6"
        fontWeight={600}
        gutterBottom
        color={colors.text.primary}
      >
        Login
      </Typography>

      <Typography variant="body2" color={colors.text.primary} mb={3}>
        Use your company provided login credentials
      </Typography>

      {/* Form */}
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Controller
          name="userId"
          control={control}
          rules={{ required: "User ID is required" }}
          render={({ field }) => (
            <TextField
              {...field}
              label="User ID"
              placeholder="Enter User ID"
              fullWidth
              margin="normal"
              error={!!errors.userId}
              helperText={errors.userId?.message}
            />
          )}
        />

        <Controller
          name="password"
          control={control}
          rules={{ required: "Password is required" }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Password"
              placeholder="Enter Password"
              type={showPassword ? "text" : "password"}
              fullWidth
              margin="normal"
              error={!!errors.password}
              helperText={errors.password?.message}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword((prev) => !prev)}
                      edge="end"
                      aria-label="toggle password visibility"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          )}
        />

        <Box display="flex" justifyContent="flex-start" mt={1} mb={3}>
          <Link
            href="#"
            underline="hover"
            variant="body2"
            sx={{ color: colors.text.link }}
            onClick={(e) => e.preventDefault()}
          >
            Forgot password?
          </Link>
        </Box>

        <CustomButton
          label="Login"
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          loading={loading}
          loadingText="Logging in..."
          disabled={loading}
          sx={{
            backgroundColor: colors.primary.main,
            "&:hover": {
              backgroundColor: colors.primary.dark,
              opacity: 0.9,
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default LoginForm;

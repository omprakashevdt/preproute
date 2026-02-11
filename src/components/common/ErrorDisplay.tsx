import { Box, Typography, Button } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

interface ErrorDisplayProps {
  error: string;
  onRetry?: () => void;
}

const ErrorDisplay = ({ error, onRetry }: ErrorDisplayProps) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="50vh"
      textAlign="center"
    >
      <ErrorOutlineIcon color="error" sx={{ fontSize: 64, mb: 2 }} />
      <Typography variant="h6" color="text.secondary" gutterBottom>
        Something went wrong
      </Typography>
      <Typography variant="body1" color="error" sx={{ mb: 3 }}>
        {error}
      </Typography>
      {onRetry && (
        <Button variant="contained" onClick={onRetry}>
          Retry
        </Button>
      )}
    </Box>
  );
};

export default ErrorDisplay;

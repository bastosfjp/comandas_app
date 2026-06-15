import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { CircularProgress, Box } from '@mui/material';

export default function PrivateRoute({ children }) {
	const { isAuthenticated, loading } = useAuth();
	if (loading) {
		return (
			<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
				<CircularProgress />
			</Box>
		);
	}
	return isAuthenticated ? children : <Navigate to="/login" replace />;
}
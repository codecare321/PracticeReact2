import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";
const ProtectedRoute = ({ isAuth, children }) => {
  return isAuth ? children : <Navigate to="/auth/signin" replace />;
};

export default ProtectedRoute;

ProtectedRoute.propTypes = {
  isAuth: PropTypes.bool,
  children: PropTypes.node,
};

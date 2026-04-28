import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Toast = ({ position = "top-right", autoClose = 3000 }) => {
  return <ToastContainer position={position} autoClose={autoClose} />;
};

export default Toast;

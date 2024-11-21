import { useNavigate } from "react-router-dom";
import Otp from "./Otp";
import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
const OtpContainer = () => {
  const [otp, setOtp] = useState("");
  const [result, setResult] = useState("");
  const location = useLocation();
  const baseUrl = "http://localhost:3000";
  const navigate = useNavigate();
  const [timer, setTimer] = useState(60);
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const { state } = useLocation();

  const email = location.state?.formData?.email;
  console.log("formdata", email);
  console.log("state", state);

  useEffect(() => {
    let interval;

    if (isResendDisabled && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1500);
    } else if (timer === 0) {
      setIsResendDisabled(false);
    }

    return () => clearInterval(interval);
  }, [isResendDisabled, timer]);

  const handleVerify = async () => {
    const email = location.state?.formData?.email;

    console.log("email", email);
    try {
      const response = await axios.post(`${baseUrl}/api/v1/verify-otp`, {
        otp,
        email: email,
      });
      console.log(response.data);
      setResult(response.data.message);
      console.log("result", result);

      if (response.data.success) {
        toast.success("User verified successfully");
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setResult("Error verifying OTP");
      toast.error("Error verifying OTP");
    }
  };

  const resendOtp = async () => {
    const email = location.state?.formData?.email;
    try {
      if (isResendDisabled) {
        return;
      }

      const response = await axios.post(`${baseUrl}/api/v1/resend-otp`, {
        email: email,
      });
      console.log(response.data);
      setResult(response.data.message);
      toast.success("OTP resent successfully");
      setIsResendDisabled(true);
      setTimer(30);
    } catch (error) {
      console.error("Error resending OTP:", error);
      setResult("Error resending OTP");
      toast.error("Error resending OTP");
    }
  };

  return (
    <>
      <ToastContainer
        autoClose={1500}
        hideProgressBar={false}
        pauseOnHover={true}
        draggable={true}
      />
      <Otp
        otp={otp}
        setOtp={setOtp}
        handleVerify={handleVerify}
        result={result}
        resendOtp={resendOtp}
        isResendDisabled={isResendDisabled}
        timer={timer}
      />
    </>
  );
};

export default OtpContainer;

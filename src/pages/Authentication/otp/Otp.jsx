import OtpInput from "react-otp-input";
import { PropTypes } from "prop-types";
const Otp = ({
  otp,
  setOtp,
  handleVerify,

  resendOtp,
  isResendDisabled,
  timer,
}) => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className=" border-2 mt-2 p-2 mb-8 w-96  rounded-lg shadow-xl">
        <h1 className="font-satoshi flex items-center justify-center mr-10 text-blue-500">
          Please check your email
        </h1>
        <h2 className="font-satoshi flex items-center justify-center mr-10 text-black-400">
          we have sent you a 6 digit otp
        </h2>
        <div className="flex justify-center items-center gap-2 m-8 ">
          <OtpInput
            inputStyle={{
              width: "2rem",
              height: "3rem",
              fontSize: "1rem",
              borderRadius: "0.5rem",
              border: "1px solid #ccc",
            }}
            value={otp}
            onChange={setOtp}
            numInputs={6}
            renderSeparator={
              <span className="text-gray-500 text-lg mx-1">-</span>
            }
            renderInput={(props) => (
              <input
                {...props}
                className="w-12 h-12 border border-gray-300 rounded-md text-center text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            )}
          />
        </div>
        <div className="flex items-center justify-center mt-4">
          <button
            className="p-2 m-2 bg-blue-500 rounded-lg"
            onClick={handleVerify}
          >
            Verify otp
          </button>

          {isResendDisabled ? (
            <button
              className="p-2 m-2 bg-[#C6C6C6] rounded-lg"
              onClick={resendOtp}
              disabled={isResendDisabled}
            >
              Resend Otp
            </button>
          ) : (
            <button
              className="p-2 m-2  bg-yellow-500 rounded-lg"
              onClick={resendOtp}
              disabled={isResendDisabled}
            >
              Resend Otp
            </button>
          )}
        </div>
        {isResendDisabled ? `Resend otp (${timer})` : ""}
      </div>
    </div>
  );
};

Otp.propTypes = {
  otp: PropTypes.string,
  setOtp: PropTypes.func,
  handleVerify: PropTypes.func,
  result: PropTypes.string,
  resendOtp: PropTypes.func,
  isResendDisabled: PropTypes.bool,
  timer: PropTypes.number,
};

export default Otp;

import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import LOGIN_IMG from "../../assests/pera_ride.jpg";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "../../Redux/features/admin/adminSlice";

import apiConnection from "../../apiConnection";

const Login = () => {
  const navigate = useNavigate();
  const { isFetching } = useSelector((store) => store.admin);
  const usernameRef = useRef();
  const passwordRef = useRef();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginStart());
    try {
      const response = await apiConnection.post("/login", {
        username: usernameRef.current.value,
        password: passwordRef.current.value,
      });
      dispatch(loginSuccess(response.data));
      navigate("/");
    } catch (err) {
      usernameRef.current.value = "";
      passwordRef.current.value = "";
      dispatch(loginFailure());
      alert("Something went wrong! please try again.");
      console.log(`Error: ${err.message}`);
    }
  };

  const handleOTPgenerate = async () => {
    alert("OTP has been sent successfully!");
    try {
      const response = await apiConnection.get("/admin/generateOtp");
      if (!response) {
        console.log("Error with generating OTP, please try again!");
      }
    } catch (err) {
      console.log(`Error: ${err.message}`);
    }
  };

  return (
    <div className="login-main-div">
      <div className="login-sub-div">
        <div className="login-title">
          <h1 className="h1">admin login</h1>
          <p className="p">Pera Ride 🚲 Cycle Beyond Limits</p>
        </div>
        <div className="login-img-container">
          <img
            src={LOGIN_IMG}
            alt=""
            className="login-img"
            width={120}
            height={120}
          />
        </div>
        <form className="login-form" onSubmit={handleSubmit}>
          <input
            className="login-input"
            type="text"
            name="admin-username"
            id="admin-username"
            placeholder="username..."
            required
            ref={usernameRef}
          />
          <input
            className="login-input"
            type="password"
            name="admin-password"
            id="admin-password"
            placeholder="password..."
            required
            autoComplete="new-password"
            autoCorrect="off"
            ref={passwordRef}
          />
          <button type="submit" className="login-btn" disabled={isFetching}>
            login
          </button>
        </form>
        <div className="login-forgot">
          Forgot Password?{" "}
          <Link
            onClick={handleOTPgenerate}
            to="/reset"
            className="Link login-link"
          >
            Reset.
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;

import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode'; // Import jwtDecode instead of jwt_decode

import styles from "./styles.module.css";

const Login = () => {
  const [data, setData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = "http://localhost:9000/api/auth";
      console.log("Sending request with data:", data);
      const { data: res } = await axios.post(url, data);
      console.log("Response from server:", res);
      
      // Decode the token
      const decodedToken = jwtDecode(res.data);
      console.log("Decoded token:", decodedToken);

      // Store the token in localStorage
      localStorage.setItem("token", res.data);
      console.log("Token stored in localStorage:", res.data);

      // Redirect the user to the home page
      navigate("/");
    } catch (error) {
      console.error("Error during login:", error);
      // Handle error
    }
  };


  return (
    <div className={styles.login_container}>
      <div className={styles.login_form_container}>
        <div className={styles.left}>
          <form className={styles.form_container} onSubmit={handleSubmit}>
            <h1>Login to Your Account</h1>
            <input
              type="email"
              placeholder="Email"
              name="email"
              onChange={handleChange}
              value={data.email}
              required
              className={styles.input}
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleChange}
              value={data.password}
              required
              className={styles.input}
            />
            {error && <div className={styles.error_msg}>{error}</div>}
            <button type="submit" className={styles.green_btn}>
              Sign In
            </button>
          </form>
        </div>
        <div className={styles.right}>
          <h1>New Here ?</h1>
          <Link to="/signup">
            <button type="button" className={styles.white_btn}>
              Sign Up
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;

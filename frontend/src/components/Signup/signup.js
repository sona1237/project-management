import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import styles from "./styles.module.css";

const Signup = () => {
	const [data, setData] = useState({
		firstname: "",
		lastname: "",
		email: "",
		password: "",
	});
	const [error, setError] = useState("");
	const navigate = useNavigate();

	const handleChange = ({ currentTarget: input }) => {
		setData({ ...data, [input.name]: input.value });
	};

	const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        console.log("Sending request with data:", data); // Log data before sending the request

        const url = "http://localhost:9000/api/users";
        console.log("Sending request to:", url); // Log the URL before sending the request
        
        const response = await axios.post(url, data);
        console.log("Response from server:", response.data); // Log response from the server

        navigate("/login");
        console.log("Signup successful. Redirecting to login page.");
    } catch (error) {
        console.error("Error during signup:", error); // Log any errors that occur
        if (error.response && error.response.status >= 400 && error.response.status <= 500) {
            console.log("Server responded with status code:", error.response.status); // Log the status code if available
            setError(error.response.data.message);
        }
    }
};

	return (
		<div className={styles.signup_container}>
			<div className={styles.signup_form_container}>
				<div className={styles.left}>
					<h1>Welcome Back</h1>
					<Link to="/login">
						<button type="button" className={styles.white_btn}>
							Sign in
						</button>
					</Link>
				</div>
				<div className={styles.right}>
					<form className={styles.form_container} onSubmit={handleSubmit}>
						<h1>Create Account</h1>
						<input
							type="text"
							placeholder="First Name"
							name="firstname"
							onChange={handleChange}
							value={data.firstname}
							required
							className={styles.input}
						/>
						<input
							type="text"
							placeholder="Last Name"
							name="lastname"
							onChange={handleChange}
							value={data.lastname}
							required
							className={styles.input}
						/>
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
							Sign Up
						</button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default Signup;

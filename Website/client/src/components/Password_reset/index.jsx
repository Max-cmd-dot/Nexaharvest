import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import styles from "./styles.module.css";
const apiUrl = process.env.REACT_APP_API_URL;
const Password_reset = () => {
  const [data, setData] = useState({
    email: "",
  });
  const [error, setError] = useState("");
  //const navigate = useNavigate();

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = `${apiUrl}/api/password-reset`;
      //console.log(data);
      const { data: res } = await axios.post(url, data);
      //navigate("/login");
      //console.log(res.message);
    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        setError(error.response.data.message);
      }
    }
  };

  return (
    <div className={styles.signup_container}>
      <div className={styles.signup_form_container}>
        <div className={styles.left}>
          <h1>Back to Login</h1>
          <Link to="/login">
            <button type="button" className={styles.white_btn}>
              Log in
            </button>
          </Link>
        </div>
        <div className={styles.right}>
          <form className={styles.form_container} onSubmit={handleSubmit}>
            <h1>Password Reset</h1>
            <input
              type="email"
              placeholder="Email"
              name="email"
              onChange={handleChange}
              value={data.email}
              required
              className={styles.input}
            />
            {error && <div className={styles.error_msg}>{error}</div>}
            <button type="submit" className={styles.green_btn}>
              Reset now
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Password_reset;

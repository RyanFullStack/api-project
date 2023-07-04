import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";
import "./SignupForm.css";

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();
  const [disabled, setDisabled] = useState(true)


  useEffect(() => {
    if (!email || !username || !firstName || ! lastName || !password || !confirmPassword) {
      setDisabled(true)
    }
    if (username.length < 4 || password.length < 6) {
      setDisabled(true)
    }
    else {
      setDisabled(false)
    }

    return function() {
      setDisabled(false)
    }


  }, [email, username, firstName, lastName, password, confirmPassword])



  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors({});
      return dispatch(
        sessionActions.signup({
          email,
          username,
          firstName,
          lastName,
          password,
        })
      )
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          if (data && data.errors) {
            setErrors(data.errors);
          }
        });
    }
    return setErrors({
      confirmPassword: "Confirm Password field must be the same as the Password field"
    });
  };

  return (
    <div className="signup-form">
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit} className="form">
        <label>
          <div>
          Email
          </div>
          <div><input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          /></div>
        </label>
        <div className="errors">{errors.email && <p>{errors.email}</p>}</div>
        <label>
          <div>
          Username
          </div>
          <div><input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          /></div>
        </label>
        <div className="errors">{errors.username && <p>{errors.username}</p>}</div>
        <label>
          <div>
          First Name
          </div>
          <div><input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          /></div>
        </label>
        <div className="errors">{errors.firstName && <p>{errors.firstName}</p>}</div>
        <label>
          <div>
          Last Name
          </div>
          <div><input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          /></div>
        </label>
        <div className="errors">{errors.lastName && <p>{errors.lastName}</p>}</div>
        <label>
          <div>
          Password
          </div>
          <div><input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          /></div>
        </label>
        <div className="errors">{errors.password && <p>{errors.password}</p>}</div>
        <label>
          <div>
          Confirm Password
          </div>
          <div><input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          /></div>
        </label>
        <div className="errors">{errors.confirmPassword && (
          <p>{errors.confirmPassword}</p>
        )}</div>
        <button type="submit" className="formbutton" disabled={disabled}>Sign Up</button>
      </form>
    </div>
  );
}

export default SignupFormModal;

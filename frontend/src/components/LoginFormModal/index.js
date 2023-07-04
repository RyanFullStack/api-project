import React, { useEffect, useState } from "react";
import { useHistory } from 'react-router-dom'
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const history = useHistory()
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();
  const [disabled, setDisabled] = useState(true)


useEffect(() => {
  if (credential.length < 4 || password.length < 6) {
    setDisabled(true)
  }
    else {
      setDisabled(false)
    }
    return function() {
      setDisabled(false)
    }
}, [credential, password])


  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.thunkStartSession({ credential, password }))
      .then(closeModal).then(history.push('/'))
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  const demoLogin = () => {
    dispatch(sessionActions.thunkStartSession({credential: 'ReedE', password: 'password1'}))
    closeModal()
    history.push('/')
  }

  return (
    <div className="login-form">
      <h1>Log In</h1>
      <form onSubmit={handleSubmit} className="loginform">
        <label>
        <div>
          Username or Email
          </div>
          <div>
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          /></div>
        </label>
        <label>
          <div>
          Password
          </div>
          <div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          /></div>
        </label>
        <div className="loginerrors">
        {errors.credential && (
          <p>{errors.credential}</p>
        )}</div>
        <div>
        <button type="submit" className="loginformbutton" disabled={disabled}>Log In</button></div>
      </form>
      <button onClick={demoLogin} className="loginformbutton">Demo Login</button>
    </div>
  );
}

export default LoginFormModal;

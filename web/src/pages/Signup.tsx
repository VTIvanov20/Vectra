import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import App from '../App.css';
import { useNavigate } from 'react-router-dom';

import UserService from "../services/user.service";
import "../styles/pages/_signup.page.scss";

const Signup: React.FC = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleFirstNameChange = useCallback(() => validateFirstName(firstName), [firstName]);

  const handleLastNameChange = useCallback(() => validateLastName(lastName), [lastName]);

  const handleEmailChange = useCallback(() => validateEmail(email), [email]);

  const handlePasswordChange = useCallback(() => validatePassword(password), [password]);

  function validateFirstName(firstName: string) {
    if (firstName.length < 1) {
      setFirstNameError('Please enter a valid first name');
      return;
    }
    if (firstName[0] !== firstName[0].toUpperCase()) {
      setFirstNameError('First letter of first name must be uppercase');
      return;
    }
    setFirstNameError('');
  }

  function validateLastName(lastName: string) {
    if (lastName.length < 1) {
      setLastNameError('Please enter a valid last name');
      return;
    }
    if (lastName[0] !== lastName[0].toUpperCase()) {
      setLastNameError('First letter of last name must be uppercase');
      return;
    }
    setLastNameError('');
  }

  function validateEmail(email: string) {
    const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
    } else {
      setEmailError('');
    }
  }

  function validatePassword(password: string) {
    // Check if password is at least 8 characters long
    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      return;
    }
    // Check if password contains at least 1 lowercase letter
    if (!/[a-z]/.test(password)) {
      setPasswordError('Password must contain at least 1 lowercase letter');
      return;
    }
    // Check if password contains at least 1 uppercase letter
    if (!/[A-Z]/.test(password)) {
      setPasswordError('Password must contain at least 1 uppercase letter');
      return;
    }
    // Check if password contains at least 1 number
    if (!/[0-9]/.test(password)) {
      setPasswordError('Password must contain at least 1 number');
      return;
    }
    // Check if password contains at least 1 special character
    if (!/[!@#\$%\^&\*]/.test(password)) {
      setPasswordError('Password must contain at least 1 special character (!, @, #, $, %, ^, &, *)');
      return;
    }
    // If all checks pass, clear any error messages
    setPasswordError('');
  }

  const [error, setError] = useState(false);

  const onSubmit = async (e: any) => {
    e.preventDefault();

    const isRegisterSuccessful = await UserService.register({
      username: username,
      first_name: firstName,
      last_name: lastName,
      email: email,
      password: password
    });

    if (isRegisterSuccessful) {
      navigate('/login');
    } else {
      setError(true);
    }
  }

  return (
    <div className="container">
      <div className="navbar-container">
        <Link className="navbar-brand" to="/Index">Vectra</Link>
        <div className="navbar-links">
          <Link className="navbar-link" to="/Login">Login</Link>
          <Link className="navbar-link" to="/Signup">Register</Link>
        </div>
      </div>
      <form className="form" onSubmit={onSubmit}>
        <h1 className="form-title">Register</h1>
        <div className="form-group">
          <input
            type="text"
            className="form-input"
            name="username"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div className="form-group">
          <input
            type="text"
            className="form-input"
            name="first_name"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => {
              setFirstName(e.target.value);
              handleFirstNameChange();
            }} />
          {firstNameError && <div className="error">{firstNameError}</div>}
        </div>
        <div className="form-group">
          <input
            type="text"
            className="form-input"
            name="last_name"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => {
              setLastName(e.target.value);
              handleLastNameChange();
            }} />
          {lastNameError && <div className="error">{lastNameError}</div>}
        </div>
        <div className="form-group">
          <input
            className="form-input"
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              handleEmailChange();
            }} />
          {emailError && <div className="error">{emailError}</div>}
        </div>
        <div className="form-group">
          <input
            className="form-input"
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              handlePasswordChange();
            }} />
          {passwordError && <div className="error">{passwordError}</div>}
        </div>
        <button type="submit" className="form-submit">
                    Submit
                </button>
      </form >
    </div >
  );
}

export default Signup;
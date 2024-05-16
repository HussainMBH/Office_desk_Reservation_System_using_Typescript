import { useRef, useState, useEffect } from 'react';
import { faCheck, faTimes, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios'; // Make sure to install axios if not already installed
import styled from 'styled-components';
import Button from 'react-bootstrap/Button';
import Login from './Login';

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const REGISTER_URL = 'http://localhost:3000/register'; // Update this URL to your actual register endpoint

const ElementStyle = styled.div`
  margin-top: 2rem;
  text-align: left;

  section {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding: 1rem;
    border: 1px solid rgba(0, 0, 0, 0.4);
  }

  form {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    flex-grow: 1;
    padding-bottom: 1rem;

    label, button {
      margin-top: 0.6rem;
    }
  }

  .valid {
    color: green;
  }

  .invalid {
    color: red;
  }

  .hide {
    display: none;
  }

  .offscreen {
    position: absolute;
    left: -9999px;
  }

  .errmsg {
    background-color: lightpink;
    color: firebrick;
    padding: 0.5rem;
    margin-bottom: 1rem;
  }
`;

const Register = () => {
  const userRef = useRef();
  const errRef = useRef();
  
  const [user, setUser] = useState('');
  const [validName, setValidName] = useState(false);
  const [userFocus, setUserFocus] = useState(false);
  
  const [pwd, setPwd] = useState('');
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);
  
  const [matchPwd, setMatchPwd] = useState('');
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);
  
  const [role, setRole] = useState('user'); // Default role is 'user'
  
  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);
  
  useEffect(() => {
    userRef.current.focus();
  }, []);
  
  useEffect(() => {
    setValidName(USER_REGEX.test(user));
  }, [user]);
  
  useEffect(() => {
    setValidPwd(PWD_REGEX.test(pwd));
    setValidMatch(pwd === matchPwd);
  }, [pwd, matchPwd]);
  
  useEffect(() => {
    setErrMsg('');
  }, [user, pwd, matchPwd]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!validName || !validPwd || !validMatch) {
      setErrMsg('Invalid Entry');
      return;
    }
  
    try {
      const response = await axios.post(REGISTER_URL, {
        username: user,
        password: pwd,
        role: role
      });
      console.log(response?.data);
      setSuccess(true);
      setUser('');
      setPwd('');
      setMatchPwd('');
    } catch (err) {
      if (err.response) {
        if (err.response.status === 409) {
          setErrMsg('Username Taken');
        } else {
          setErrMsg('Registration Failed');
        }
      } else {
        setErrMsg('No Server Response');
      }
      errRef.current.focus();
    }
  };
  
  return (
    <ElementStyle>
      {success ? (
        <Login />
      ) : (
        <section>
          <p ref={errRef} className={errMsg ? 'errmsg' : 'offscreen'} aria-live="assertive">
            {errMsg}
          </p>
          <h1>Register Here - Smart Desk</h1>
          <form onSubmit={handleSubmit} className="form-group">
            <label htmlFor="username">
              Username:
              <FontAwesomeIcon icon={faCheck} className={validName ? 'valid' : 'hide'} />
              <FontAwesomeIcon icon={faTimes} className={validName || !user ? 'hide' : 'invalid'} />
            </label>
            <input
              type="text"
              id="username"
              ref={userRef}
              autoComplete="off"
              onChange={(e) => setUser(e.target.value)}
              value={user}
              required
              aria-invalid={validName ? 'false' : 'true'}
              aria-describedby="uidnote"
              className="form-control"
              onFocus={() => setUserFocus(true)}
              onBlur={() => setUserFocus(false)}
            />
            <p id="uidnote" className={userFocus && user && !validName ? 'instructions' : 'offscreen'}>
              <FontAwesomeIcon icon={faInfoCircle} />
              4 to 24 characters.<br />
              Must begin with a letter.<br />
              Letters, numbers, underscores, hyphens allowed.
            </p>
  
            <label htmlFor="password">
              Password:
              <FontAwesomeIcon icon={faCheck} className={validPwd ? 'valid' : 'hide'} />
              <FontAwesomeIcon icon={faTimes} className={validPwd || !pwd ? 'hide' : 'invalid'} />
            </label>
            <input
              type="password"
              id="password"
              onChange={(e) => setPwd(e.target.value)}
              value={pwd}
              required
              aria-invalid={validPwd ? 'false' : 'true'}
              aria-describedby="pwdnote"
              className="form-control"
              onFocus={() => setPwdFocus(true)}
              onBlur={() => setPwdFocus(false)}
            />
            <p id="pwdnote" className={pwdFocus && !validPwd ? 'instructions' : 'offscreen'}>
              <FontAwesomeIcon icon={faInfoCircle} />
              8 to 24 characters.<br />
              Must include uppercase and lowercase letters, a number and a special character.<br />
              Allowed special characters: <span aria-label="exclamation mark">!</span> <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span> <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
            </p>
  
            <label htmlFor="confirm_pwd">
              Confirm Password:
              <FontAwesomeIcon icon={faCheck} className={validMatch && matchPwd ? 'valid' : 'hide'} />
              <FontAwesomeIcon icon={faTimes} className={validMatch || !matchPwd ? 'hide' : 'invalid'} />
            </label>
            <input
              type="password"
              id="confirm_pwd"
				onChange={(e) => setMatchPwd(e.target.value)}
				value={matchPwd}
				required
				aria-invalid={validMatch ? 'false' : 'true'}
				aria-describedby="confirmnote"
				className="form-control"
				onFocus={() => setMatchFocus(true)}
				onBlur={() => setMatchFocus(false)}
			  />
			  <p id="confirmnote" className={matchFocus && !validMatch ? 'instructions' : 'offscreen'}>
				<FontAwesomeIcon icon={faInfoCircle} />
				Must match the first password input field.
			  </p>
  
			  <label htmlFor="role">
				Role:
			  </label>
			  <select id="role" onChange={(e) => setRole(e.target.value)} value={role} className="form-control">
				<option value="user">User</option>
				<option value="admin">Admin</option>
			  </select>
  
			  <Button type="submit" disabled={!validName || !validPwd || !validMatch ? true : false}>Sign Up</Button>
			</form>
			<p>
			  Already registered?<br />
			  <span className="line">
				<a href="/login">Sign In</a>
            </span>
          </p>
        </section>
      )}
    </ElementStyle>
  );
};

export default Register;

import React, { useState, useContext } from 'react';
import './LoginView.css';
import Axios from 'axios';
import Header from '../../components/header/Header';
import { Redirect } from 'react-router-dom';
import { Store } from '../../store';

const LoginView: React.FC<any> = props => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [redirect, setRedirect] = useState(false);
  const { state, dispatch } = useContext(Store);

  //runs when the form is submitted. GetToken() will run and then it will redirect to AlertView
  const onSubmit = async (e: any) => {
    e.preventDefault();
    await getToken();
    setRedirect(true);
  };

  //get Token and set localStorage with token, username and isloggedin
  const getToken = async () => {
    await Axios({
      url: 'http://127.0.0.1:8000/api-token-auth/',
      method: 'POST',
      data: { username: username, password: password }
    }).then(result => {
      localStorage.setItem('token', result.data.token);
      localStorage.setItem('user', result.data.token ? username : 'null');
      localStorage.setItem('loggedin', result.data.token ? 'true' : 'false');
      dispatch({ type: 'setUser', payload: username });
      dispatch({ type: 'setToken', payload: result.data.token });
      dispatch({
        type: 'setLoggedin',
        payload: result.data.token ? true : false
      });
    });
  };

  //Does the redirecting
  const renderRedirect = () => {
    if (redirect) {
      return (
        <Redirect
          to={{
            pathname: '/'
          }}
        />
      );
    }
  };
  return (
    <div>
      {renderRedirect()}
      <header>
        <Header />
      </header>
      <div className='container'>
        <div className='login-container'>
          <h1>Login</h1>
          <form onSubmit={onSubmit}>
            <div>
              <input
                name={'username'}
                value={username}
                placeholder={'Email'}
                onChange={e => setUsername(e.target.value)}
              />
            </div>
            <div>
              <input
                name='password'
                value={password}
                placeholder='Password'
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            <button type='submit'> Log in</button>
          </form>
          <a href={'http://localhost:8000/login/dataporten/'}>
            login with feide
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginView;

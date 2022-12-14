import logo from './logo.svg';
import React, { useEffect } from 'react';
import './App.css';
import { Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import * as UserService from './services/User';
import Header from './components/header/header';
import Dashboard from './components/dashboard/dashboard';
import Login from './components/auth/login';
import Register from './components/auth/register';
import { selectIsAuthenticated } from './store/selectors/user';

const App = (props) => {
  const navigate = useNavigate();
  const location = useLocation();

  const authenticate = async () => {
    if (props.isAuthenticated || ['/login', '/register'].includes(location.pathname)) {
      return;
    }
    const userMetadata = await UserService.authenticate();
    if (!userMetadata?._id) {
      navigate('/login');
    }
  }

  useEffect(() => {
    authenticate();
  }, [location]);

  let landingPage = <Dashboard />;
  if (!props.isAuthenticated) {
    landingPage = (
      <div className="App-header">
        <img className="App-logo" src={logo} alt="My logo" />
      </div>
    );
  }
  
  return (
    <div>
      { !!props.isAuthenticated && <Header /> }
      <Routes>
        <Route path="/" element={landingPage} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  );
};

const mapStateToProps = createStructuredSelector({
  isAuthenticated: selectIsAuthenticated
});
export default connect(mapStateToProps)(App);

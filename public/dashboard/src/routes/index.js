import React from 'react';
import Admin from '../pages/admin';
import Seller from '../pages/seller';
import Login from '../pages/login';
import {BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom';
import {useCookies} from 'react-cookie';
import NotFound from '../pages/notFound';
import NewPassword from '../pages/newPassword';
import jwt from 'jsonwebtoken'
import Cashier from '../pages/cashier';

const App = () => {
  const [cookies] = useCookies(['authorization']);

  const loggedIn = cookies.authorization && cookies.authorization.access_token;

  const render = () => {
    const data = loggedIn && jwt.decode(cookies.authorization.access_token);

    if(data && data.role)
      switch(data.role){
        case 'admin': return <Admin />
        case 'seller': return <Seller />
        case 'cashier': return <Cashier />
        default: return <Login />
      }

    return <Login />
  }

  return(
    <Router>
      <Switch>
        <Route path="/nova-senha" component={NewPassword} />
        <Route path="/dashboard" exact>
          {!loggedIn ? <Redirect to="/" /> : render()}
        </Route>
        <Route path="/" exact >
          {loggedIn ? <Redirect to="/dashboard" /> : <Login />}
        </Route>
        <Route path="*" component={NotFound} />
      </Switch>
    </Router>
  );
}

export default App;
import React from 'react';
import Admin from '../pages/admin';
import Seller from '../pages/seller';
import Login from '../pages/login';
import {BrowserRouter as Router, Switch, Route, useHistory} from 'react-router-dom';
import {useCookies} from 'react-cookie';
import NotFound from '../pages/notFound';
import NewPassword from '../pages/newPassword';
import jwt from 'jsonwebtoken'
import Cashier from '../pages/cashier';

const SwitchRole = () => {
    const [cookies] = useCookies();
    const history = useHistory();
    if(cookies.authorization){
        const {role} = jwt.decode(cookies.authorization.access_token);
        switch(role){
            case 'admin': return <Admin />
            case 'seller': return <Seller />
            case 'cashier': return <Cashier />
            default: return <Login />
        }
    }
    else{
        history.push('/');
        return <Login />
    }
}

const GoToLogin = () => {
    const [cookies] = useCookies();
    const history = useHistory();

    if(cookies.authorization){
        const {role} = jwt.decode(cookies.authorization.access_token);
        history.push('/dashboard');
        switch(role){
            case 'admin': return <Admin />
            case 'seller': return <Seller />
            case 'cashier': return <Cashier />
            default: return <Login />
        }
    }
    else
        return <Login />;
}

const App = () => {
  return(
    <Router>
      <Switch>
        <Route path="/" exact component={Login} />
        {/* <Route path="/dashboard" exact component={SwitchRole} /> */}
        {/* <Route path="/test" exact component={Test} /> */}
        {/* <Route path="/nova-senha" component={NewPassword} /> */}
        {/* <Route path="*" component={NotFound} /> */}
      </Switch>
    </Router>
  );
}

export default App;
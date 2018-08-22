import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import { Provider } from 'react-redux'
import { syncHistoryWithStore } from 'react-router-redux'
import { UserIsAuthenticated } from './util/wrappers.js'
import 'bootstrap/dist/css/bootstrap.css';

// Layouts
import App from './App'
import Home from './layouts/home/Home'
import Dashboard from './layouts/dashboard/Dashboard'
import License from './layouts/license/License'
import User from './layouts/user/User'
import Marketplace from './layouts/marketplace/Marketplace'
import Token from './layouts/token/Token'
import Profile from './user/layouts/profile/Profile'

// Redux Store
import store from './store'

const history = syncHistoryWithStore(browserHistory, store)

export const USER_LOGGED_IN = 'USER_LOGGED_IN'
function userLoggedIn(user) {
  return {
    type: USER_LOGGED_IN,
    payload: user
  }
}

const token = localStorage.getItem('access');

if(token){
  store.dispatch(userLoggedIn(JSON.parse(token)))
}

ReactDOM.render((
    <Provider store={store}>
      <Router history={history}>
        <Route path="/" component={App}>
          <IndexRoute component={Home} />
          <Route path="dashboard" component={UserIsAuthenticated(Dashboard)} />
          <Route path="license" component={UserIsAuthenticated(License)} />
          <Route path="profile" component={UserIsAuthenticated(Profile)} />
          <Route path="user/:address" component={UserIsAuthenticated(User)} />
          <Route path="marketplace" component={Marketplace} />
          <Route path="token/:hash" component={UserIsAuthenticated(Token)} />
        </Route>
      </Router>
    </Provider>
  ),
  document.getElementById('root')
)

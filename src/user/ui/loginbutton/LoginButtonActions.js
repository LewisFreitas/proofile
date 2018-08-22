import { uport } from './../../../util/connectors.js'
import { browserHistory } from 'react-router'

//const didJWT = require('did-jwt')

//const signer = didJWT.SimpleSigner('96106fc1af468d8f36c50aba6710da5bcee11ee23e203c215565ffb60c977fde');

export const USER_LOGGED_IN = 'USER_LOGGED_IN'
function userLoggedIn(user) {
  return {
    type: USER_LOGGED_IN,
    payload: user
  }
}

export function loginUser() {
  return function(dispatch) {
    // UPort and its web3 instance are defined in ./../../../util/wrappers.
    // Request uPort persona of account passed via QR
    uport.requestCredentials({
       requested: ['name', 'avatar', 'phone', 'country'],
       notifications: true // We want this if we want to recieve credentials
    }).then((credentials) => {
      dispatch(userLoggedIn(credentials))

      console.log(credentials)

      let jsonCreds = JSON.stringify(credentials)

      localStorage.setItem('access', jsonCreds)



      // didJWT.createJWT({aud: '2ojoJBSkNKav2rhzgtXHVo9Q4NJKbNxipy6', name: 'uPort Developer'},
      //            {issuer: '2ojoJBSkNKav2rhzgtXHVo9Q4NJKbNxipy6', signer}).then( response =>
      //            {localStorage.setItem('access', response)});


      // Used a manual redirect here as opposed to a wrapper.
      // This way, once logged in a user can still access the home page.
      var currentLocation = browserHistory.getCurrentLocation()

      if ('redirect' in currentLocation.query)
      {
        return browserHistory.push(decodeURIComponent(currentLocation.query.redirect))
      }

      return browserHistory.push('/dashboard')
    })
  }
}

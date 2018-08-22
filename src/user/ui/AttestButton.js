import React, { Component } from 'react'
import { uport } from './../../util/connectors.js'


class AttestButton extends Component {
  attest(){
      uport.requestCredentials().then((credentials) => {
          // Can verify the uport user is verified with the returned 'credentials' object.
          var d = new Date();
          var month = ['Jan', 'Feb','Mar','Apr','May','June','July','Aug','Sept','Oct','Nov', 'Dec'];
          uport.attestCredentials({
            sub: credentials.address,
            claim: {
              "Certificate": "Musician",
              "Date": month[d.getMonth()] + " " + d.getDate() + "," + d.getFullYear(),
              "Details": ""
            },
            exp: new Date().getTime() + 30 * 24 * 60 * 60 * 1000,
          })
        })
  }

    render(){
        return(
            <a href="#" className="pure-menu-link" onClick={this.attest()}>Attest</a>
          )
    }
}
export default AttestButton

import React, { Component } from 'react'
import { Link } from 'react-router'
import { Container, ListGroup, ListGroupItem} from 'reactstrap';
import { uport, web3 } from './../../util/connectors.js'
import BaseContract from './../../util/BaseContract'
import LicenseManagerContract from './../../util/LicenseManagerContract'

const mnid = require('mnid')

class License extends Component {

constructor(props, {authData}){
    super(props);
    this.state = {
      heldLicenses: []
    }

    authData = this.props

    this.checkAddressMNID = this.checkAddressMNID.bind(this)
    this.getHeldLicenses = this.getHeldLicenses.bind(this)
    this.idToHash = this.idToHash.bind(this)
}

componentWillMount(){
  this.getHeldLicenses()
}

checkAddressMNID (addr){
  if(mnid.isMNID(addr)) {
    return mnid.decode(addr).address
  }else{
    return addr
  }
}

getHeldLicenses(){
  const addr = this.checkAddressMNID(this.props.authData.address)
  LicenseManagerContract.getLicensesHeldByAddress
  .call(addr, (err, list) => {
    console.log(list)
    return this.idToHash(list)
  })
}

idToHash(list){
  var hashList = []
  list.forEach(async(licenseId)=> {
    BaseContract.deeds
    .call(web3.toDecimal(licenseId), (err, deed) => {
      hashList.push(deed[0])
      this.setState({
        heldLicenses: hashList
      })
    })
  })
}


  render() {
    return(
      <div>
        <Container>
          <ListGroup>
          {
            this.state.heldLicenses.length > 0
            ?
              this.state.heldLicenses.map((license, index) => (
                <ListGroupItem tag={Link} to={`/token/${license}`}>{license}</ListGroupItem>
              ))

            :
            <p>You have no licenses.</p>
          }
          </ListGroup>
        </Container>
      </div>
    )
  }
}

export default License

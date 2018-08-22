import React, { Component } from 'react'
import { Link } from 'react-router'

import { Container, Card, CardImg, CardText, CardBody,
  CardTitle, CardSubtitle, Button, Row, Col, Table,
  CardDeck, CardFooter, CardGroup, ListGroup, ListGroupItem, ListGroupItemHeading,
  ListGroupItemText } from 'reactstrap';

import ReactLoading from 'react-loading';

import BaseContract from './../../../util/BaseContract'
import LicenseManagerContract from './../../../util/LicenseManagerContract'

import { uport, web3 } from './../../../util/connectors.js'

const mnid = require('mnid')


import AttestButton from './../../ui/AttestButton'
import TokenCard from './../../ui/TokenCard'
import Media from './../../ui/Media'

class Profile extends Component {
  constructor(props, { authData }) {
    super(props)

    this.state = {
      ownedToken: [],
      heldLicenses: [],
      toWithdraw: 0
    }

    this.checkAddressMNID = this.checkAddressMNID.bind(this)
    this.getOwnedTokens = this.getOwnedTokens.bind(this)
    this.getOwnedTokensInfoList = this.getOwnedTokensInfoList.bind(this)
    this.withdrawPayments = this.withdrawPayments.bind(this)
    this.getPaymentInfo = this.getPaymentInfo.bind(this)

    authData = this.props
  }

  componentWillMount(){
    this.getOwnedTokens()
  }

  checkAddressMNID (addr){
    if(mnid.isMNID(addr)) {
      return mnid.decode(addr).address
    }else{
      return addr
    }
  }



  getOwnedTokensInfoList (list){
    let tokenList = []
    list.forEach(async(id) => {
      BaseContract.deeds
      .call(web3.toDecimal(id), (err,res) =>{
        tokenList.push([
          web3.toDecimal(id),
          res[0],
          res[1],
          res[2],
          res[3],
          res[4],
          res[5],
          web3.toDecimal(res[6])
        ])
        this.setState({
          ownedToken: tokenList
        })
      })
    })

    return this.getPaymentInfo()
  }

  getOwnedTokens (){
    const addr = this.checkAddressMNID(this.props.authData.address)
    var tokenInfo = []
    BaseContract.getListOfTokenIdsByOwner
    .call(addr, (err, res) => {
      if(err) throw err
      return this.getOwnedTokensInfoList(res)
    })
  }

  getPaymentInfo(){
    const addr = this.checkAddressMNID(this.props.authData.address)
    LicenseManagerContract.getPendingPayment.call(
      addr,
      {from: addr},
      (err, payment) => {
        if(err) throw err
        console.log(web3.toDecimal(web3.fromWei(payment, 'ether')))
        this.setState({
          toWithdraw: web3.toDecimal(web3.fromWei(payment, 'ether'))
        })
      }
    )
  }

  withdrawPayments(){
    const addr = this.checkAddressMNID(this.props.authData.address)
    LicenseManagerContract.withdrawPayments({from: addr}, (err, res) => {
      if(err) throw err

    })
  }

  render() {
      const addr = this.checkAddressMNID(this.props.authData.address)

      return(
        <div>
          <Container>
            <Row className="text-center">
              <Col>Total: {this.state.ownedToken.length}</Col>
              <Col></Col>
              <Col><h1>Profile</h1></Col>
              <Col></Col>
              <Col>
                <Button outline onClick={this.withdrawPayments}>Withdraw {this.state.toWithdraw} ETH</Button>
              </Col>
            </Row>
            <Row className="text-center">
              <Col><p>{addr}</p></Col>
            </Row>

            <Row className="text-center">
              <ListGroup>
                 {
                  this.state.ownedToken.length >= 0
                  ?
                    this.state.ownedToken.map((token, index) => (
                      <div>
                        <ListGroupItemHeading tag="h5">{token[2]}</ListGroupItemHeading>
                        <ListGroupItem><Media token={token} /></ListGroupItem>
                        <ListGroupItem tag={Link} to={`/token/${token[1]}`}>More...</ListGroupItem>
                      </div>
                    ))

                  :
                    <ReactLoading type="spin" color="#000" height={'5%'} width={'5%'} />
                }
              </ListGroup>
            </Row>
          </Container>
        </div>
      )

  }
}

export default Profile

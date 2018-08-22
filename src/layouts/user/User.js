import React, { Component } from 'react'

import { Link } from 'react-router'

import { Container, Card, CardImg, CardText, CardBody,
  CardTitle, CardSubtitle, Button, Row, Col, Table,
  CardDeck, CardFooter, CardGroup, ListGroup, ListGroupItem, ListGroupItemHeading,
  ListGroupItemText } from 'reactstrap';

import ReactLoading from 'react-loading';

import BaseContract from './../../util/BaseContract'
import { uport, web3 } from './../../util/connectors.js'

import Media from './../../user/ui/Media'


class User extends Component {

  constructor(){
      super();
      this.state = {
        address: null,
        ownedToken: []
      }


      this.getOwnedTokens = this.getOwnedTokens.bind(this)
      this.getOwnedTokensInfoList = this.getOwnedTokensInfoList.bind(this)
  }

  componentWillMount(){
    var parsed = this.props.params.address

    console.log(this.props)


    this.setState({
      address: parsed
    })

    return this.getOwnedTokens(parsed)
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
          res[6],
          web3.toDecimal(res[7])
        ])
        this.setState({
          ownedToken: tokenList
        })
      })
    })

    console.log(this.state.ownedToken.length)
  }

  getOwnedTokens (address){
    var tokenInfo = []
    BaseContract.getListOfTokenIdsByOwner
    .call(address, (err, res) => {
      if(err) throw err
      return this.getOwnedTokensInfoList(res)
    })
  }

  render() {
    let addressLen = this.state.address.length
      return(
        <div>
          <Container>
            <Row className="text-center">
              <Col><h1>User</h1></Col>
            </Row>
            <Row className="text-center">
              <Col><p>{this.state.address.substring(0,6)}... {this.state.address.substring(addressLen-4, addressLen)}</p></Col>
            </Row>

            <Row className="text-center">
              <ListGroup>
                 {
                  this.state.ownedToken.length >= 0
                  ?
                    this.state.ownedToken.map((token, index) => (
                      <div>
                        <ListGroupItemHeading tag="p">{token[2]}</ListGroupItemHeading>
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


export default User

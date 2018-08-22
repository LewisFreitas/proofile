import React, { Component } from 'react'
import { Link } from 'react-router'
import { Jumbotron, Col, Button, Form, FormGroup, Label, Input, FormText, Container, Row } from 'reactstrap';
import TokenCard from './../../user/ui/TokenCard'

import BaseContract from './../../util/BaseContract'

import { uport, web3 } from './../../util/connectors.js'

class Home extends Component {
  constructor(props, { authData }) {
    super(props)

    this.state = {
      verifyToken: null
    };

    this.getTokenById = this.getTokenById.bind(this)
    this.verifyHash = this.verifyHash.bind(this)
  }

  getTokenById (id){
    BaseContract.deeds
    .call(id, (err, res) => {
      if(err){
        throw err
      }

      this.setState({
        verifyToken: [
          web3.toDecimal(id),
          res[0],
          res[1],
          res[2],
          res[3],
          res[4],
          res[5],
          web3.toDecimal(res[6])
        ]
      })
      console.log(this.state.verifyToken)
    })
  }


  verifyHash(event) {
    event.preventDefault()
    const hash = event.target.value
    BaseContract.getTokenIdByDocumentHash
    .call(hash, (err, res) => {
      if(err) throw err

      return this.getTokenById(web3.toDecimal(res))
    })
  }


  render() {
    return(
      <div>
      <Container>
        <Jumbotron>
          <Container>
            <h1 className="display-3">Just had a 1,000,000$ idea?</h1>
            <p className="lead">Secure it with proofile.</p>
          </Container>
        </Jumbotron>
        <Jumbotron>
          <Container>
            <p className="lead">
              Paste an
              <a href="https://ipfs.io"> IPFS hash </a>
              to verify the existence of a file and more information.</p>
            <Form>
              <FormGroup row>
                <Col>
                  <Input type="text" onChange={this.verifyHash}/>
                </Col>
                <Col>
                  {(this.state.verifyToken === null || this.state.verifyToken[0] === 0)
                  ?
                    null
                  :
                    <Link to={`/token/${this.state.verifyToken[1]}`}>It exists!</Link>}
                </Col>
              </FormGroup>
            </Form>
          </Container>
        </Jumbotron>
      </Container>
      </div>
    )
  }
}

export default Home

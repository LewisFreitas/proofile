import React, { Component } from 'react'
import { browserHistory, Link } from 'react-router'

import BaseContract from './../../util/BaseContract'
import LicenseManagerContract from './../../util/LicenseManagerContract'
import ERC20 from './../../../build/contracts/ERC20'

import { uport, web3 } from './../../util/connectors.js'
import { waitForMined } from './../../util/wait.js'

import ReactLoading from 'react-loading';
import { Container, Row, Col, Button, Form,
  FormGroup, Label, Input, ListGroup, ListGroupItem, ListGroupItemHeading,
  ListGroupItemText } from 'reactstrap';

import LicenseHolderModal from './LicenseHoldersModal'

const mnid = require('mnid')
const queryString = require('query-string');

class Token extends Component {

constructor(props, {authData}){
    super(props);
    this.state = {
      id: null,
      token: null,
      owner: null,
      isLicensing: false,
      isLicenseHolder: false,
      updateName: null,
      updateDescription: null,
      transferToAddress: null,

      uriHash: null,

      priceLicense: null,
      erc20License: null,
      numTokensLicense: null
    }

    authData = this.props

    this.checkAddressMNID = this.checkAddressMNID.bind(this)
    this.getTokenById = this.getTokenById.bind(this)
    this.verifyHash = this.verifyHash.bind(this)

    this.getTokenOwner = this.getTokenOwner.bind(this)
    this.getDate = this.getDate.bind(this)
    this.isLicensing = this.isLicensing.bind(this)

    this.transferOwnership = this.transferOwnership.bind(this)
    this.captureName = this.captureName.bind(this)
    this.updateToken = this.updateToken.bind(this)

    this.startLicenseSale = this.startLicenseSale.bind(this)
    this.getLicenseInfo = this.getLicenseInfo.bind(this)
    this.approveTokenContract = this.approveTokenContract.bind(this)

    this.purchasedLicenseERC20 = this.purchasedLicenseERC20.bind(this)
    this.getTxCounterBeforePurchaseERC20 = this.getTxCounterBeforePurchaseERC20.bind(this)
    this.purchasedLicenseETH = this.purchasedLicenseETH.bind(this)
    this.stopLicenseSale = this.stopLicenseSale.bind(this)

    this.getTxCounterBeforePurchaseETH = this.getTxCounterBeforePurchaseETH.bind(this)
}


componentWillMount(){
  var parsed = this.props.params.hash

  console.log(this.props)
  console.log('base', BaseContract)


  this.setState({
    uriHash: parsed
  })
  this.verifyHash(parsed)
}

captureName(event){
  console.log(event.target.id, event.target.value)
  this.setState({ [event.target.id]: event.target.value });
}

verifyHash(hash){
  BaseContract.getTokenIdByDocumentHash
  .call(hash, (err, res) => {
    if(err) throw err

    return this.getTokenById(web3.toDecimal(res))
  })
}

checkAddressMNID (addr){
  if(mnid.isMNID(addr)) {
    return mnid.decode(addr).address
  }else{
    return addr
  }
}

getTokenById (id){
  BaseContract.deeds
  .call(id, (err, res) => {
    if(err){
      throw err
    }

    this.setState({
      token: [
        web3.toDecimal(id),
        res[0],
        res[1],
        res[2],
        res[3],
        res[4],
        res[5],
        web3.toDecimal(res[6])
      ],
      updateName: res[1],
      updateDescription: res[2],
      id: id
    })
  })

  this.isLicensing(id)
  this.getLicenseInfo(id)

  return this.getTokenOwner(id)
}

getTokenOwner (id){
  BaseContract.ownerOf
  .call(id, (err, res) => {
    if(err){
      throw err
    }

    this.setState({
      owner: res
    })
  })
}

getDate (timestamp){
  let date = new Date(timestamp*1000)
  return String(date)
}

isLicensing (id){
  LicenseManagerContract.isLicenseSellingByTokenId
  .call(id, (err, res) => {
    if(err) throw err
    this.setState({
      isLicensing: res
    })

    if(res === true){
      console.log('show info')
    }
    else{
      console.log('show other info')
    }
  })
}

isLicenseHolder (id){
  LicenseManagerContract.isLicenseHolder
  .call(id, (err, res) => {
    if(err) throw err
    this.setState({
      isLicenseHolder: res
    })

    if(res === true){
      console.log('show info')
    }
    else{
      console.log('show other info')
    }
  })
}

startLicenseSale (){
  event.preventDefault()
  let fromAddr = this.checkAddressMNID(this.props.authData.address)
  let abi = web3.eth.contract(ERC20.abi)
  let obj = abi.at(this.state.erc20License)

  obj.decimals.call((err, decimals) => {
    if(err) throw err;
    LicenseManagerContract.startLicenseSale(
      this.state.id,
      web3.toWei(this.state.priceLicense, 'ether'),
      this.state.erc20License,
      web3.toDecimal(this.state.numTokensLicense*(10**decimals)),
      {from: fromAddr},
      (err, res) => {
      if(err) throw err
      this.isLicensing(this.state.id)
    })
  })
}

getLicenseInfo (id){
  console.log(id)
  LicenseManagerContract.getLicense(
    id,
    (err, res) => {
    if(err) throw err

    let abi = web3.eth.contract(ERC20.abi)
    let obj = abi.at(res[4])

    this.setState({
      priceLicense: res[3],
      erc20License: res[4],
      numTokensLicense: res[5]
    })

    obj.decimals.call((err, decimals) => {
      if(err) throw err;
      this.setState({
        numTokensLicense: this.state.numTokensLicense/(10**decimals)
      })
    })
  })
}

approveTokenContract(){
  event.preventDefault()
  let fromAddr = this.checkAddressMNID(this.props.authData.address)

  let abi = web3.eth.contract(ERC20.abi)
  let obj = abi.at(this.state.erc20License)

  console.log('num tokens', this.state.numTokensLicense)

  obj.decimals.call((err, decimals) => {
    if(err) throw err;

    obj.approve(
      LicenseManagerContract.address,
      web3.toDecimal(this.state.numTokensLicense*(10**decimals)),
      {from: fromAddr},
      (error, res) => {
        if(error) throw error
      }
    )
  })
}

getTxCounterBeforePurchaseERC20(){
  event.preventDefault()
  LicenseManagerContract.getTxCounterByTokenId(
    web3.toDecimal(this.state.id),
    (err, res) => {
      if(err) throw err
      return this.purchasedLicenseERC20(web3.toDecimal(res))
  })
}

getTxCounterBeforePurchaseETH(){
  event.preventDefault()
  LicenseManagerContract.getTxCounterByTokenId(
    this.state.id,
    (err, res) => {
      if(err) throw err
      return this.purchasedLicenseETH(web3.toDecimal(res))
  })
}

purchasedLicenseERC20(txCounter){
  event.preventDefault()
  let fromAddr = this.checkAddressMNID(this.props.authData.address)

  console.log(txCounter)

  let abi = web3.eth.contract(ERC20.abi)
  let obj = abi.at(this.state.erc20License)

  obj.decimals.call((err, decimals) => {
    if(err) throw err;

    LicenseManagerContract.purchaseLicenseERC20(
      web3.toDecimal(this.state.id),
      this.state.erc20License,
      this.state.numTokensLicense*(10**decimals),
      txCounter,
      {from: fromAddr},
      (error, res) => {
        if(error) throw error
        console.log('jfjhghg',res)
      }
    )
  })
}

purchasedLicenseETH(txCounter){
  event.preventDefault()
  let fromAddr = this.checkAddressMNID(this.props.authData.address)

  console.log(this.state.id)

  LicenseManagerContract.purchaseLicenseETH(
    this.state.id,
    txCounter,
    {from: fromAddr, value: this.state.priceLicense},
    (error, res) => {
      if(error) throw error
      console.log('jfjhghg',res)
    }
  )
}

transferOwnership(){
  event.preventDefault()

  console.log(this.state.transferToAddress)

  let fromAddr = this.checkAddressMNID(this.props.authData.address)

  BaseContract.transferFrom(
    fromAddr,
    this.state.transferToAddress,
    this.state.id,
    { from: fromAddr },
    (error, res) => {
    if(error) {
      this.setState({submitting: false, submittingMsg: ""})
      throw error
    }
    waitForMined(res, { blockNumber: null }, // see next area
      function pendingCB () {
        console.log("still pending")
      },
      function successCB (data) {
        console.log("done")
        console.log(data)
        console.log(res)
        // Great Success!
        // Likely you'll call some eventPublisherMethod(txHash, data)
      }
    )
  })
}

updateToken(){
  event.preventDefault()

  let fromAddr = this.checkAddressMNID(this.props.authData.address)

  BaseContract.update(
    this.state.id,
    this.state.updateName,
    this.state.updateDescription,
    { from: fromAddr },
    (error, res) => {
    if(error) {
      this.setState({submitting: false, submittingMsg: ""})
      throw error
    }
    waitForMined(res, { blockNumber: null }, // see next area
      function pendingCB () {
        console.log("still pending")
      },
      function successCB (data) {
        console.log("tx mined")
      }
    )
  })
}

stopLicenseSale(){
  event.preventDefault()

  let fromAddr = this.checkAddressMNID(this.props.authData.address)
  LicenseManagerContract.stopLicenseSale(
    this.state.id,
    {from: fromAddr},
    (error, res) => {
      if(error) throw error;
      waitForMined(res, { blockNumber: null }, // see next area
        function pendingCB () {
          console.log("still pending")
        },
        function successCB (data) {
          console.log("tx mined")
        }
      )
    }
  )
}

  render() {

    let addr = this.checkAddressMNID(this.props.authData.address)

    let media, info
    if(this.state.token !== null){
      if(this.state.token[4] === 'image'){
        media = <img className="token-image" src={`https://ipfs.io/ipfs/${this.state.token[1]}`} />
      }
      else if(this.state.token[4] === 'video'){
        media = <video width="75%" src={`https://ipfs.io/ipfs/${this.state.token[1]}`} controls/>
      }
      else if(this.state.token[4] === 'sound'){
        media = <audio width="100%" src={`https://ipfs.io/ipfs/${this.state.token[1]}`} controls/>
      }

    }
    return(
      <div>
        <Container>
          <Row>
            <Col>
              {(this.state.token === null)
                ?
                <ReactLoading type="spin" color="#000" height={'5%'} width={'5%'} />
                :
                <div>
                  {media}
                  <h3>Info</h3>
                  <p>Name: {this.state.token[2]}</p>
                  <p>Description: {this.state.token[3]}</p>
                  <span>Registry Id:
                    <a href={`https://rinkeby.etherscan.io/token/${BaseContract.address}?a=${this.state.token[0]}`}>{this.state.token[0]}</a>
                  </span>
                  <p>Timestamp: {this.getDate(this.state.token[7])}</p>
                  <p>IPFS hash: {this.state.token[1]}</p>
                  <p>Creator: <Link to={`/user/${this.state.token[6]}`}>{this.state.token[6]}</Link></p>
                  <p>Owner: <Link to={`/user/${this.state.owner}`}>{this.state.owner}</Link></p>
                  <p>#{this.state.token[4]} #{this.state.token[5]}</p>
                  <LicenseHolderModal id={this.state.id} />
                  <a href={`https://ipfs.io/ipfs/${this.state.token[1]}`}>Download from IPFS</a>
                  {
                    (this.state.owner === addr)
                  ?
                    <div>
                      <h3>Owner functions</h3>
                      <Form inline>
                        <FormGroup>
                          <Input type="text" name="address" id="transferToAddress" placeholder="0xca35b7d915458ef540ade6068dfe2f44e8fa733c" onChange={this.captureName}/>
                        </FormGroup>
                        {' '}
                        <Button onClick={this.transferOwnership}> Transfer ownership</Button>
                      </Form>
                      <Form inline>
                        <FormGroup>
                          <Input type="text" name="name" id="updateName" placeholder="Name" onChange={this.captureName}/>
                        </FormGroup>
                        {' '}
                        <FormGroup>
                          <Input type="text" name="description" id="updateDescription" placeholder="Description" onChange={this.captureName}/>
                        </FormGroup>
                        {' '}
                        <Button onClick={this.updateToken}>Update</Button>
                      </Form>
                      {
                        (!this.state.isLicensing)
                        ?
                        <div>
                          <Form inline>
                            <FormGroup>
                              <Input type="number" name="Price" id="priceLicense" placeholder="ETH amount" onChange={this.captureName}/>
                            </FormGroup>
                            {' '}
                            <FormGroup>
                              <Input type="text" name="ERC20 Contract Token" id="erc20License" placeholder="0xca35b7d915458ef540ade6068dfe2f44e8fa733c" onChange={this.captureName}/>
                            </FormGroup>
                            {' '}
                            <FormGroup>
                              <Input type="text" name="Token Amount" id="numTokensLicense" placeholder="20 BAT" onChange={this.captureName}/>
                            </FormGroup>
                            {' '}
                            <Button onClick={this.startLicenseSale}>Start license sale</Button>
                          </Form>
                        </div>
                        :
                        <div>
                          <h3>License</h3>
                          <p>ETH price: {web3.toDecimal(web3.fromWei(this.state.priceLicense))}</p>
                          <span>ERC20 accepted:
                          <a href={`https://rinkeby.etherscan.io/address/${this.state.erc20License}`}>{this.state.erc20License}</a>
                          </span>
                          <p>ERC20 amount: {web3.toDecimal(this.state.numTokensLicense)}</p>
                          <Form inline>
                            <FormGroup>
                              <Input type="number" name="Price" id="price" placeholder="ETH amount" />
                            </FormGroup>
                            {' '}
                            <FormGroup>
                              <Input type="text" name="ERC20 Contract Token" id="ERC20contract" placeholder="0xca35b7d915458ef540ade6068dfe2f44e8fa733c" />
                            </FormGroup>
                            {' '}
                            <FormGroup>
                              <Input type="text" name="Token Amount" id="tokenAmount" placeholder="20 BAT" />
                            </FormGroup>
                            {' '}
                            <Button outline color="warning">Update license sale</Button>
                          </Form>
                          <Form inline>
                            <Button outline color="danger" onClick={this.stopLicenseSale}>Stop License sale</Button>
                          </Form>
                        </div>
                      }
                      </div>

                  :
                    <div>
                      {
                        (!this.state.isLicensing)
                        ?
                          <div>

                          </div>
                        :
                        <div>
                          <h5>License</h5>
                          <p>ETH price: {web3.toDecimal(web3.fromWei(this.state.priceLicense))}</p>
                          <span>ERC20 accepted:
                            <a href={`https://rinkeby.etherscan.io/address/${this.state.erc20License}`}>{this.state.erc20License}</a>
                          </span>
                          <p>ERC20 amount: {web3.toDecimal(this.state.numTokensLicense)}</p>

                          <Form inline>
                            <p>1.</p><Button onClick={this.approveTokenContract}>Approve ERC20 transfer</Button>
                            <p>2.</p><Button onClick={this.getTxCounterBeforePurchaseERC20}>Buy with ERC20 token</Button>
                          </Form>
                          <p>OR</p>
                          <Form inline>
                            <Button onClick={this.getTxCounterBeforePurchaseETH}>Buy {web3.toDecimal(web3.fromWei(this.state.priceLicense))} ETH</Button>
                          </Form>
                        </div>
                      }
                    </div>
                  }

                </div>
              }
            </Col>
          </Row>
        </Container>
      </div>
    )
  }
}

export default Token

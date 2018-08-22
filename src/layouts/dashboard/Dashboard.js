import React, { Component } from 'react'
import { Col, Button, Form, FormGroup, Label, Input, FormText, Container, Row } from 'reactstrap'
import ReactLoading from 'react-loading'
import {browserHistory} from 'react-router'

import BaseContract from './../../util/BaseContract'
import { uport, web3 } from './../../util/connectors.js'
import { waitForMined } from './../../util/wait.js'
import { isValidFileType } from './../../util/fileformat.js'

const mnid = require('mnid')

import ipfs from './../../ipfs'

class Dashboard extends Component {
  constructor(props, { authData }) {
    super(props)

    this.state = {
      ipfsHash: '',
      web3: null,
      buffer: null,
      documentFileFormat: null,
      account: null,
      ownedTokenIds: [],
      name: 'default',
      description: 'default',
      tag1: 'image',
      tag2: 'default',

      submitting: false
    }

    this.getTokenById = this.getTokenById.bind(this)
    this.checkAddressMNID = this.checkAddressMNID.bind(this)

    authData = this.props
    this.captureFile = this.captureFile.bind(this)
    this.captureName = this.captureName.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.verifyHash = this.verifyHash.bind(this)
    this.onClick = this.onClick.bind(this)
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

      console.log(res[0])
      this.setState({
        ipfsHash: res[0]
      })
    })
  }

  componentWillMount(){
    this.getTokenById(1)
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

  captureFile(event) {
    event.preventDefault()
    const file = event.target.files[0]
    const reader = new window.FileReader()

    let typeFile

    if(isValidFileType(file.name, 'image')){
      typeFile = 'image'
    }
    else if(isValidFileType(file.name, 'video')){
      typeFile = 'video'
    }
    else if(isValidFileType(file.name, 'sound')){
      typeFile = 'sound'
    }
    else if(isValidFileType(file.name, 'document')){
      typeFile = 'document'
    }

    reader.readAsArrayBuffer(file)
    reader.onloadend = () => {
      this.setState({
        buffer: Buffer(reader.result),
        documentFileFormat: typeFile
      })
      console.log('buffer', this.state.buffer)
    }
  }

  captureName(event){
    this.setState({ [event.target.id]: event.target.value });
  }


  onClick(event){
    event.preventDefault();
  }

  onSubmit(event) {
    event.preventDefault()

    this.setState({
      submitting: true
    })

    const addr = this.checkAddressMNID(this.props.authData.address)
    console.log(addr)
    ipfs.files.add(this.state.buffer, (error, result) => {
      if(error) {
        console.error(error)
        this.setState({submitting: false})

        return
      }
      BaseContract.createDeed(
        result[0].hash,
        this.state.name,
        this.state.description,
        this.state.documentFileFormat,
        this.state.tag2,
        `https://ipfs.io/ipfs/${result[0].hash}`,
        { from: addr },
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

            browserHistory.push('/profile');


            // Great Success!
            // Likely you'll call some eventPublisherMethod(txHash, data)
          }
        )
      })
    })
  }

  render() {
    return(
      <div>
        <Container className="text-center">
          {
            this.state.submitting
            ?
              <div>
                <ReactLoading type="spin" color="#000" height={'5%'} width={'5%'} />
                <p>Uploading file to IPFS...</p>
                <p>After that you will be requested to sign a transaction using your uPort app.</p>
                <p>Be patient.</p>
              </div>
            :
            <div>
              <Row className="text-center">
                <Col><h1>Upload a file</h1></Col>
              </Row>
              <Row className="text-center">
                <Col></Col>
                <Col><p>Here you can upload your files</p></Col>
                <Col></Col>
              </Row>
              <Row className="text-center">
                <Form>
                  <FormGroup row>
                    <Label for="exampleFile" sm={2}>File</Label>
                    <Col sm={10}>
                      <Input type="file" name="file" id="exampleFile" onChange={this.captureFile}/>
                    </Col>
                  </FormGroup>
                  <FormGroup>
                    <Label for="name">Name</Label>
                    <Input type="textarea" name="text" id="name" onChange={this.captureName}/>
                  </FormGroup>
                  <FormGroup>
                    <Label for="description">Description</Label>
                    <Input type="textarea" name="text" id="description" onChange={this.captureName}/>
                  </FormGroup>
                  <FormGroup>
                    <Label for="tag2">Tag</Label>
                    <Input type="select" id="tag2" onChange={this.captureName}>
                      <option>test1</option>
                      <option>test2</option>
                      <option>test3</option>
                      <option>test4</option>
                      <option>test5</option>
                    </Input>
                  </FormGroup>
                  <Input type="submit" onClick={this.onSubmit}/>
                </Form>
              </Row>
            </div>
          }

        </Container>
      </div>
    )
  }
}

export default Dashboard

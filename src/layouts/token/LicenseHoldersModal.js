import React from 'react';
import { Link } from 'react-router'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, ListGroup, ListGroupItem } from 'reactstrap';
import { uport, web3 } from './../../util/connectors.js'
import LicenseManagerContract from './../../util/LicenseManagerContract'

class LicenseHoldersModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      holders: null
    };

    this.toggle = this.toggle.bind(this)
    this.getLicenseHoldersById = this.getLicenseHoldersById.bind(this)
  }

  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }

  componentWillMount(){
    var id = this.props.id

    this.getLicenseHoldersById(id)
  }

  getLicenseHoldersById(id){
    LicenseManagerContract.getLicenseHoldersByTokenId
    .call(id, (err, list) => {
      if(err) throw err
      this.setState({
        holders: list
      })
    })
  }

  render() {
    return (
      <div>
        <Button outline size="sm" onClick={this.toggle}>Check license holders</Button>
        <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
          <ModalBody>
            <h3>License Holders</h3>
            {
              this.state.holders !== null
              ?
              <p>{this.state.holders.length} licenses sold.</p>
              :
              null

            }
            {
              this.state.holders !== null
              ?
                this.state.holders.map((address, index) => (
                  <ListGroupItem><p><Link to={`/user/${address}`}>{address}</Link></p></ListGroupItem>
                ))
              :
              <p>Loading...</p>
            }
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

export default LicenseHoldersModal;

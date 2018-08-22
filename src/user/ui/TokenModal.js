import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

class TokenModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false
    };

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }

  render() {
    return (
      <div>
        <Button outline size="sm" onClick={this.toggle}>See more</Button>
        <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
          <ModalHeader toggle={this.toggle}>
            <img src={`https://ipfs.io/ipfs/${this.props.token[1]}`} className="card-image"/>
          </ModalHeader>
          <ModalBody>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

export default TokenModal;

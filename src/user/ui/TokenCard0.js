import React from 'react';
import { Container, Card, CardImg, CardText, CardBody,
  CardTitle, CardSubtitle, Button, Row, Col, Table, CardDeck, CardFooter, Badge } from 'reactstrap';
import CopyToClipboard from 'react-copy-to-clipboard';


import TokenModal from './TokenModal'

class TokenCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      copied: false
    };

    this.getDate = this.getDate.bind(this)
  }

  getDate(timestamp){
    let months = ['January', 'February', 'March',
                  'April', 'May', 'June',
                  'July', 'August', 'September',
                  'October', 'November', 'December']

    let d = new Date(timestamp*1000); // The 0 there is the key, which sets the date to the epoch
    let dateString = `${d.getHours()}:${d.getMinutes()} ${months[d.getMonth()]} ${d.getDate()},  ${d.getFullYear()}`
    return dateString;
  }

  render() {

    let media
    if(this.props.token[5] === 'image'){
      media = <CardImg top width="100%" src={`https://ipfs.io/ipfs/${this.props.token[1]}`} alt="Card image cap" />
    }
    else if(this.props.token[5] === 'video'){
      media = <video width="100%" src={`https://ipfs.io/ipfs/${this.props.token[1]}`} controls/>
    }
    else if(this.props.token[5] === 'audio'){
      media = <audio width="100%" src={`https://ipfs.io/ipfs/${this.props.token[1]}`} controls/>
    }


    return (
      <div>
        <Card key={`${this.props.token[0]}`} className="card text-center">
          {media}
          <CardBody>
            <CardTitle>{this.props.token[2]}</CardTitle>
            <CardSubtitle>{this.props.token[3]}</CardSubtitle>
            <CardText>
              <small className="text-muted">
                Created by
                <a href={`https://rinkeby.etherscan.io/address/${this.props.token[7]}`}>
                  {this.props.token[7].substring(0,6)}...
                </a>
                &#9679;
                {this.getDate(this.props.token[8])}
              </small>
            </CardText>
            <a href={`/token?h=${this.props.token[1]}`}/>
            <CopyToClipboard text={this.props.token[1]}
              onCopy={() => this.setState({copied: true})}>
              <button>Copy to clipboard with span</button>
            </CopyToClipboard>
          </CardBody>
        </Card>


      </div>
    );
  }
}

export default TokenCard;

import React from 'react';
import { Container, Card, CardImg, CardText, CardBody,
  CardTitle, CardSubtitle, Button, Row, Col, Table, CardDeck, CardFooter } from 'reactstrap';


import TokenModal from './TokenModal'

class TokenCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

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
    return (
      <div>
        <Card key={`${this.props.token[0]}`} className="card text-center">
          <CardImg top width="100%" src={`https://ipfs.io/ipfs/${this.props.token[1]}`} alt="Card image cap" />
          <CardBody>
            <CardTitle>{this.props.token[2]}</CardTitle>
            <CardSubtitle>{this.props.token[3]}</CardSubtitle>
            <CardText>
              <small className="text-muted">
                Created by
                <a href={`https://rinkeby.etherscan.io/address/${this.props.token[7]}`}>
                  {this.props.token[7].substring(0,6)}
                </a>
                &#9679;
                {this.getDate(this.props.token[8])}
              </small>
            </CardText>
            <TokenModal token={this.props.token}/>
          </CardBody>
          <CardFooter className="card-footer">
            <small className="text-muted">
              #{this.props.token[5]}
            </small>
            ` `
            <small className="text-muted">
              #{this.props.token[6]}
            </small>
          </CardFooter>
        </Card>


      </div>
    );
  }
}

export default TokenCard;

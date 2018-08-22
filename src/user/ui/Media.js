import React from 'react';

class Media extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {

    let media
    if(this.props.token[4] === 'image'){
      media = <img className="list-media" src={`https://ipfs.io/ipfs/${this.props.token[1]}`} />
    }
    else if(this.props.token[4] === 'video'){
      media = <video className="list-media" src={`https://ipfs.io/ipfs/${this.props.token[1]}`} controls/>
    }
    else if(this.props.token[4] === 'sound'){
      media = <audio className="list-media" src={`https://ipfs.io/ipfs/${this.props.token[1]}`} controls/>
    }


    return (
      <div>
        {media}
      </div>
    );
  }
}

export default Media;

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

class FashionSetContainer extends Component {
  constructor(props){
    super(props);

    this.state = {

    };
  }
  render(){
    return (
      <div>

      </div>
    );
  }
}

FashionSetContainer.propTypes = {
  //myProp: PropTypes.object.isRequired
};

FashionSetContainer.defaultProps = {
  //myProp: <defaultValue>
};

function mapStateToProps(state, ownProps){
  return {
    state: state
  };
}

const connectedFashionSetContainer = connect(mapStateToProps)(FashionSetContainer);
export {connectedFashionSetContainer as FashionSetContainer};
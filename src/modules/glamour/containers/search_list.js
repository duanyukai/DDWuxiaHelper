import React, {Component} from 'react';
import {connect} from 'react-redux';

class SearchList extends Component {
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

SearchList.propTypes = {
  //myProp: PropTypes.object.isRequired
};

SearchList.defaultProps = {
  //myProp: <defaultValue>
};

function mapStateToProps(state, ownProps){

  return {
    state: state
  };
}

const connectedSearchList = connect(mapStateToProps)(SearchList);
export {connectedSearchList as SearchList};
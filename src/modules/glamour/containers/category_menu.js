import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Menu from 'antd/es/menu';

class CategoryMenu extends Component {
  constructor(props){
    super(props);

    this.state = {

    };
  }
  render(){
    return (
      <div>
        <Menu
          onClick={this.handleClick}
          style={{ width: 80, height: '100%', float: 'left' }}
          defaultSelectedKeys={['all']}
          defaultOpenKeys={['all']}
          mode="inline"
          theme="dark"
        >
          {
            this.props.menuList.map(({key, name}) =>
              <Menu.Item key={key}>{name}</Menu.Item>
            )
          }
        </Menu>
      </div>
    );
  }
}

CategoryMenu.propTypes = {
  menuList: PropTypes.array.isRequired
};

CategoryMenu.defaultProps = {
  menuList: [{key: 'all', name: '全部'}]
};

function mapStateToProps(state, ownProps){
  return {
    state: state
  };
}

const connectedCategoryMenu = connect(mapStateToProps)(CategoryMenu);
export {connectedCategoryMenu as CategoryMenu};
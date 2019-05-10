import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import { Scrollbars } from 'react-custom-scrollbars';
import LazyLoad from 'react-lazyload';

import {CategoryMenu} from './category_menu';
import Input from 'antd/es/input/Input';

import './css/fashion_set_container.css';

import fashionSetData from '../assets/json/set.json';
import Carousel from 'antd/es/carousel';


import {ICON_URL_PREFIX} from '../utils/consts';

class FashionSetContainer extends Component {
  constructor(props){
    super(props);

    this.state = {

    };
  }
  render(){
    return (
      <div styleName="three-col-wrapper">
        {/*分类列表*/}
        <div styleName="category-col">
          <CategoryMenu menuList={[
            {key: 'all', name: '全部'},
            {key: 'shop', name: '商城'},
            {key: 'menpai', name: '门派'},
            {key: 'manu', name: '制造'},
          ]} />
        </div>
        {/*筛选结果列表*/}
        <div styleName="search-list-col">
          <div styleName="search-bar">
            <Input placeholder="Basic usage" />
          </div>
          <div styleName="search-list">
            <Scrollbars
              style={{ width: '100%', height: 'calc(100% - 100px)' }}
            >
              <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center'}}>
                {
                  Object.keys(fashionSetData).map(key => {
                    return <div key={key} style={{width: 120, height: 150, border: '1px solid #e8e8e8', background: '#fff', margin: '5px', borderRadius: '3px', textAlign: 'center'}}>
                      <LazyLoad height={123} overflow >
                        <img src={`${ICON_URL_PREFIX}${fashionSetData[key].card[0]}.png`} />
                      </LazyLoad>
                      <p>{fashionSetData[key].name}</p>
                    </div>;
                  })
                }
              </div>
            </Scrollbars>
          </div>
        </div>
        {/*详细信息列表*/}
        <div style={{float: 'none', width: 'auto', height: '100%', background: '#001529', marginLeft: 'calc(45% + 80px)',  position: 'relative'}}>
          <div style={{width: '100%'}}>
            <Carousel effect="fade" dots arrows draggable style={{height: 300}}>
              <div><h3>1</h3><h3>1</h3><h3>1</h3><h3>1</h3><h3>1</h3></div>
              <div><h3>1</h3><h3>1</h3><h3>1</h3><h3>1</h3><h3>1</h3></div>
              <div><h3>1</h3><h3>1</h3><h3>1</h3><h3>1</h3><h3>1</h3></div>
              <div><h3>1</h3><h3>1</h3><h3>1</h3><h3>1</h3><h3>1</h3></div>
              <div><h3>1</h3><h3>1</h3><h3>1</h3><h3>1</h3><h3>1</h3></div>
            </Carousel>
            <div style={{width: '100%', background: '#fff', height: 200, position: 'absolute', bottom: 0}}>
              工具
            </div>
          </div>
        </div>
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
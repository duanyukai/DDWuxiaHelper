import React, {Component} from 'react';
import Slider from 'antd/es/slider/index';

import './css/vertical_slider_range.css';

export default class VSliderRange extends Component {

  render() {
    const {min, max,marks,defaultValue, value} = this.props;
    let newMarks = {};
    Object.keys(marks).forEach(key => {
      newMarks[key] = (min + max) - key + '级';
    });

    return <React.Fragment>
      <Slider
        styleName="slider"
        range
        vertical min={min} max={max}
        tipFormatter={(x) => (min + max) - x + ''}
        defaultValue={defaultValue.map((x) => (min + max) - x).reverse()}
        marks={newMarks}
        value={value.map((x) => (min + max) - x).reverse()}
        onChange={(arr) => {
          this.props.onChange(arr.map(x => (min + max) - x).reverse());
        }
        }
      />
    </React.Fragment>;
  }
}
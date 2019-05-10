import React, {Component} from 'react';
import Slider from 'antd/es/slider/index';

import './css/vertical_slider_single.css';

export default class VSliderSingle extends Component {

  render() {
    const {min, max,marks,defaultValue, value} = this.props;
    let newMarks = {};
    Object.keys(marks).forEach(key => {
      newMarks[key] = (min + max) - key + '级';
    });

    return <React.Fragment>
      <Slider
        styleName="slider"
        vertical min={min} max={max}
        tipFormatter={(x) => (min + max) - x + ''}
        defaultValue={(min + max) - defaultValue}
        marks={newMarks}
        value={(min + max) - value}
        onChange={(x) => {
          this.props.onChange((min + max) - x);
        }}
      />
    </React.Fragment>;
  }
}
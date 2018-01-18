import React from 'react';

import './css/panel.css';
import {Glyphicon} from "react-bootstrap";

export default (props) => {
  return (
    <div styleName='panel'>
      { props.title &&
        <div styleName='panel-title'>
          {props.title}
        </div>
      }

      { props.closeBtn &&
        <div
          styleName='close-btn'
          onClick={props.onClose}
        >
          <Glyphicon glyph='remove' />
        </div>
      }

      <div styleName='panel-body'>
        <div styleName='panel-body-wrapper'>
          {props.children}
        </div>
      </div>
    </div>
  );
}
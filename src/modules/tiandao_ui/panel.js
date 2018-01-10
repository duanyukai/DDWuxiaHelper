import React from 'react';

import './css/panel.css';

export default (props) => {
  return (
    <div styleName='panel'>
      {props.title &&
        <div styleName='panel-title'>
          {props.title}
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
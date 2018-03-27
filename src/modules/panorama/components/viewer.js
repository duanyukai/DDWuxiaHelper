import React, { Component } from 'react';
import 'pannellum/build/pannellum'; // todo

import 'pannellum/build/pannellum.css';
import viewerCss from './css/viewer.css';

class Viewer extends Component {
  constructor(props) {
    super(props);

    this.state = {

    };
  }

  componentDidMount() {
    console.log(this.viewerDOM);
    console.log(pannellum.viewer);

    this.viewer = pannellum.viewer(this.viewerDOM, {
      'type': 'equirectangular',
      'panorama': this.props.url,
      'autoLoad': true
    });

  }

  componentWillReceiveProps(newProps) {
    if(newProps.url !== this.props.url) {
      if(this.viewer)
        this.viewer.destroy();
      this.viewer = pannellum.viewer(this.viewerDOM, {
        'type': 'equirectangular',
        'panorama': newProps.url,
        'autoLoad': true
      });
    }
  }

  render() {
    return(
      <div style={{width: '100%', paddingBottom: '56.25%', position: 'relative'}}>
        <div style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%'}}>
          <div ref={(m) => this.viewerDOM = m} />
        </div>
      </div>
    );
  }
}

export default Viewer;
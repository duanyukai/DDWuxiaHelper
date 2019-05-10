import React from 'react';

export default class Adsense extends React.Component {
  componentDidMount () {
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  }

  render () {
    return (
      <div className='ad'>
        <ins className='adsbygoogle'
          style={{ display: 'block' }}
          data-ad-client="ca-pub-9742451422065878"
          data-ad-slot="7713597043"
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    );
  }
}
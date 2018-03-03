import React, { Component } from 'react';

const appId = 'cyttjkkHc';
const conf = 'prod_afce39920f4f4287e79c1554d056fe9b';

class ChangYanComment extends Component {
  constructor(props) {
    super(props);

    this.state = {
      shouldUpdate: false
    }
  }

  componentDidMount() {
    this.updateComment();
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.sourceId !== nextProps.sourceId)
      this.setState({
        shouldUpdate: true
      });
  }

  componentDidUpdate() {
    if(this.state.shouldUpdate === true) {
      this.updateComment();
      this.setState({
        shouldUpdate: false
      });
    }
  }

  componentWillUnmount() {
    this.removeJs();
  }

  removeJs() {
    // 删除旧js标签
    let changyanMobileJs = document.getElementById('changyan_mobile_js');
    if(changyanMobileJs)
      changyanMobileJs.innerHTML = '';
    let changyanJs = document.getElementById('changyan-js');
    if(changyanJs)
      changyanJs.innerHTML = '';
  }

  updateComment() {
    this.removeJs();
    // 添加新js标签
    let width = window.innerWidth || document.documentElement.clientWidth;
    if (width < 960) {
      let doc = document,
        s = doc.createElement('script'),
        h = doc.getElementsByTagName('head')[0] || doc.head || doc.documentElement;
      s.type = 'text/javascript';
      s.id = 'changyan_mobile_js';
      s.charset = 'utf-8';
      s.src = 'https://changyan.sohu.com/upload/mobile/wap-js/changyan_mobile.js?client_id=' + appId + '&conf=' + conf;
      h.insertBefore(s,h.firstChild);
    } else {
      // let loadJs = function(d, a) {
      //   let c = document.getElementsByTagName("head")[0] || document.head || document.documentElement;
      //   let b = document.createElement("script");
      //   b.setAttribute("type", "text/javascript");
      //   b.setAttribute("charset", "UTF-8");
      //   b.setAttribute("id", "changyan-js");
      //   b.setAttribute("src", d);
      //   if (typeof a === "function") {
      //     if (window.attachEvent) {
      //       b.onreadystatechange = function() {
      //         let e = b.readyState;
      //         if (e === "loaded" || e === "complete") {
      //           b.onreadystatechange = null;
      //           a()
      //         }
      //       }
      //     } else {
      //       b.onload = a
      //     }
      //   }
      //   c.appendChild(b)
      // };
      // loadJs("https://changyan.sohu.com/upload/changyan.js", () => {
      //   window.changyan.api.config({
      //     appid: appId,
      //     conf: conf
      //   });
      // });

      let doc = document,
        s = doc.createElement('script'),
        h = doc.getElementsByTagName('head')[0] || doc.head || doc.documentElement;
      s.type = 'text/javascript';
      s.id = 'changyan-js';
      s.charset = 'utf-8';
      s.src = 'http://assets.changyan.sohu.com/upload/changyan.js?conf='+ conf +'&appid=' + appId;
      h.insertBefore(s,h.firstChild);
    }
  }

  render() {
    return(
      <div>
        <div id='SOHUCS' sid={this.props.sourceId} />
      </div>
    );
  }
}

export default ChangYanComment;

import React from "react";
import Loadable from "react-loadable";
import {Route} from "react-router-dom";


const GemWiki = Loadable({
  loader: () => import('./components/gem.js'),
  loading: () => <div>加载中……</div>
});

const AffixWiki = Loadable({
  loader: () => import('./components/affix.js'),
  loading: () => <div>加载中……</div>
});

export function DataWikiRouter(props) {
  return (
    <div>
      <Route path='/data-wiki/gem' component={GemWiki}/>
      <Route path='/data-wiki/affix' component={AffixWiki}/>
    </div>
  );
}
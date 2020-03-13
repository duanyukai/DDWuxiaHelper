import React, { Component } from 'react';

import './css/app.css';
import {BrowserRouter, Link, Route, Switch} from 'react-router-dom';
import {Helmet} from 'react-helmet';
const imgPath = require.context('../../portal/assets/imgs/', true);
import Loadable from "react-loadable";
import Loading from '../../tiandao_ui/components/loading';
import NotFoundPage from '../../portal/components/404';

const WikiPortal = Loadable({
  loader: () => import('./portal.js'),
  loading: () => <Loading />
});

const GemWiki = Loadable({
  loader: () => import('../modules/gem/gem.js'),
  loading: () => <Loading />
});

const AffixWiki = Loadable({
  loader: () => import('../modules/affix/affix.js'),
  loading: () => <Loading />
});

const ItemWiki = Loadable({
  loader: () => import('../modules/item/item.js'),
  loading: () => <Loading />
});

const YouliWiki = Loadable({
  loader: () => import('../modules/youli/youli.js'),
  loading: () => <Loading />
});
const SkillWiki = Loadable({
  loader: () => import('../modules/skill/skill.js'),
  loading: () => <Loading />
});
const CookWiki = Loadable({
  loader: () => import('../modules/cook/cook.js'),
  loading: () => <Loading />
});

class DataWikiRouter extends Component {
  render() {
    return(
      <div>
        <Helmet defer={false}>
          <meta charSet="utf-8" />
          <title>天刀数据百科 | 段段天刀综合助手</title>
          <meta name="keywords" content="天刀数据百科" />
          <meta name="viewport" content="width=device-width"/>
        </Helmet>

        <div>
          <Switch>
            <Route path='/data' exact component={WikiPortal}/>
            <Route path='/data/gem' component={GemWiki}/>
            <Route path='/data/affix' component={AffixWiki}/>
            <Route path='/data/item' component={ItemWiki}/>
            <Route path='/data/tour/:id?/:name?' component={YouliWiki}/>
            <Route path='/data/skill' component={SkillWiki}/>
            <Route path='/data/cook' component={CookWiki}/>
            <Route component={NotFoundPage}/>
          </Switch>
        </div>
      </div>
    );
  }
}

export default DataWikiRouter;
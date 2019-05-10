import React, { Component } from 'react';

import 'react-datepicker/dist/react-datepicker.css';
import {Helmet} from 'react-helmet';

import {BrowserRouter, Route, Switch} from 'react-router-dom';
import MainList from './main_list';
import SingleServerList from './single_server_list';
import SingleRoleList from './single_role_list';
import TextAd from '../../_commons/ad/components/text_ad';
import BannerAd from '../../_commons/ad/components/banner_ad';

class GongliRankApp extends Component {
  constructor(props) {
    super(props);
  }

  
  render() {
    return(
      <BrowserRouter>
        <div>
          <Helmet defer={false}>
            <meta charSet="utf-8" />
            <title>天刀功力排行榜，每日最新排名、历史排名查询 | 段段天刀综合助手</title>
            <meta name="keywords" content="天刀功力排行榜,天刀历史功力排名" />
            <meta name="description" content="天刀功力排行榜给您提供每日的所有天刀服务器的最新功力排名数据，同时支持选择日期查询历史功力排名。" />
            <meta name="viewport" content="width=device-width"/>
          </Helmet>

          <div>
            <div style={{height: 15}} />
            <TextAd />
            <Switch>
              <Route exact path='/rank' component={MainList}/>
              <Route exact path='/rank/:serverId' component={SingleServerList}/>
              <Route path='/rank/:serverId/:roleName' component={SingleRoleList}/>
            </Switch>
            <BannerAd />
          </div>
        </div>
      </BrowserRouter>
    );
  }
}

export default GongliRankApp;

/*

SELECT role_id, MAX(gongli) as gongli_max FROM `rank` group by role_id order by gongli_max desc
 */
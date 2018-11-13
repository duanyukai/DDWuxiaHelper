import React, { Component } from 'react';
import {Button, Col, Grid, PageHeader, Panel, Row, Table} from 'react-bootstrap';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import moment from 'moment';

import 'react-datepicker/dist/react-datepicker.css';
import {Helmet} from 'react-helmet';

import areaList from '../assets/json/area.json';
import serverList from '../assets/json/server.json';
import {BrowserRouter, Route, Switch} from 'react-router-dom';

class GongliRankApp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      date: moment(),
      serverRankData: null,
      top20Data: null
    };

    this.handleDateChange = this.handleDateChange.bind(this);
    this.updateRankData = this.updateRankData.bind(this);
  }

  componentDidMount() {
    this.updateRankData();
  }

  updateRankData() {
    let url = 'https://wuxia.duan.sh/api/rank.php';
    // 获取时间
    let startDate = this.state.date.format('YYYY-MM-DD');
    let endDate = this.state.date.clone().add(1, 'd').format('YYYY-MM-DD');
    // 获取全大区top20
    let postData = `action=all-top20&startDate=${startDate}&endDate=${endDate}`;
    axios.post(url, postData).then((response) => {
      console.log(response);
      this.setState({
        top20Data: response.data
      });
    });
    // 获取服务器列表
    let serverIdList = Object.keys(serverList).join(',');
    postData = `action=each-top&startDate=${startDate}&endDate=${endDate}&serverIdList=${serverIdList}`;
    axios.post(url, postData).then((response) => {
      console.log(response);
      this.setState({
        serverRankData: response.data
      });
    });
  }

  handleDateChange(date) {
    this.setState({
      date: date
    }, () => {
      this.updateRankData();
    });
  }

  renderTop20List() {
    let rankList;
    if(this.state.top20Data) {
      rankList = this.state.top20Data.map(({server_id, rank, role_id, school, gongli}, i) => {
        return(
          <tr key={i}><td>{server_id}</td><td>{rank}</td><td>{role_id}</td><td>{school}</td><td>{gongli}</td></tr>
        );
      });
    } else {
      rankList = <tr><td colSpan={4}>暂无数据，每日凌晨1-4点为当日数据更新时段</td></tr>;
    }

    return(
      <Col md={12}>
        <Panel bsStyle='success'>
          <Panel.Heading>全大区功力排行榜</Panel.Heading>
          <Panel.Body>
            <Table striped bordered condensed hover>
              <thead>
                <tr>
                  <th>服务器</th>
                  <th>服务器排名</th>
                  <th>昵称</th>
                  <th>门派</th>
                  <th>功力</th>
                </tr>
              </thead>
              <tbody>
                {rankList}
              </tbody>
            </Table>
          </Panel.Body>
        </Panel>
      </Col>
    );
  }
  
  renderServerTop10List() {
    let data = this.state.serverRankData;
    let date = this.state.date.format('YYYY-MM-DD');
    return(
      Object.keys(areaList).map((areaName) => {
        let serverList = areaList[areaName];

        let serverListDiv = Object.keys(serverList).map((serverName) => {
          let serverId = serverList[serverName];
          let rankList;
          if(data && data[serverId] && data[serverId][date]) {
            rankList = data[serverId][date].map(({server_id, rank, role_id, school, gongli}, i) => {
              return(
                <tr key={i}><td>{rank}</td><td>{role_id}</td><td>{school}</td><td>{gongli}</td></tr>
              );
            });
          } else {
            rankList = <tr><td colSpan={4}>暂无数据，每日凌晨1-4点为当日数据更新时段</td></tr>;
          }

          return(
            <Col md={6} lg={4} key={serverName}>
              <Panel bsStyle='success'>
                <Panel.Heading>{serverName}</Panel.Heading>
                <Panel.Body>
                  <Table striped bordered condensed hover>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>昵称</th>
                        <th>门派</th>
                        <th>功力</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rankList}
                    </tbody>
                  </Table>
                  <div>
                    <Button bsStyle='success'>查看更多</Button>
                  </div>
                </Panel.Body>
              </Panel>
            </Col>
          );
        });
        return(
          <div key={areaName}>
            <h2>{areaName}</h2>
            <Row>
              {serverListDiv}
            </Row>
          </div>
        );
      })
    );
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
            <Switch>
              <Route path='/rank/aaa' component={() => <div>aaa</div>}/>
              <Route path='/rank/:serverId' component={(props) => <div>{props.match.params.serverId}</div>}/>
              <Route path='/rank/role/:roleName' component={() => <div>bbb</div>}/>
            </Switch>
          </div>
          <Grid>
            <Row>
              <Col md={10} mdOffset={1}>
                <Col md={6}>
                  <PageHeader>天刀功力排行榜</PageHeader>
                  <h3>日期选择</h3>
                  <h3>{this.state.date.format('YYYY-MM-DD')}</h3>
                  <DatePicker selected={this.state.date}
                    onChange={this.handleDateChange}
                    locale='zh-cn'
                    readOnly
                    inline
                  />
                  <h3>说明</h3>
                  <p>啊啊啊</p>
                </Col>
                <Col md={6}>
                  <PageHeader>全大区功力排行榜Top20</PageHeader>
                  {this.renderTop20List()}
                </Col>
              </Col>
            </Row>
            <Row>
              <Col xs={12}>
                <PageHeader>各大区各服功力排行榜</PageHeader>
                {this.renderServerTop10List()}
              </Col>
            </Row>
          </Grid>
        </div>
      </BrowserRouter>
    );
  }
}

export default GongliRankApp;
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
import Link from 'react-router-dom/es/Link';

class MainList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      date: moment().add(-4, 'hours'),
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
          <tr key={i}>
            <td>{serverList[server_id]}</td><td>{rank}</td>
            <td><Link to={`/rank/${server_id}/${role_id}`}>{role_id}</Link></td>
            <td>{school}</td><td>{gongli}</td>
          </tr>
        );
      });
    } else {
      rankList = <tr><td colSpan={5}>该日暂无数据，每日凌晨1-4点为当日数据更新时段</td></tr>;
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
                <tr key={i}>
                  <td>{rank}</td>
                  <td><Link to={`/rank/${server_id}/${role_id}`}>{role_id}</Link></td>
                  <td>{school}</td>
                  <td>{gongli}</td>
                </tr>
              );
            });
          } else {
            rankList = <tr><td colSpan={4}>该日暂无数据，每日凌晨1-4点为当日数据更新时段</td></tr>;
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
                    <Link to={`/rank/${serverId}`}><Button bsStyle='success'>查看更多</Button></Link>
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
      <div>
        <Helmet defer={false}>
          <meta charSet="utf-8" />
          <title>天刀功力排行榜，每日最新排名、历史排名查询 | 段段天刀综合助手</title>
          <meta name="keywords" content="天刀功力排行榜,天刀历史功力排名" />
          <meta name="description" content="天刀功力排行榜给您提供每日的所有天刀服务器的最新功力排名数据，同时支持选择日期查询历史功力排名。" />
          <meta name="viewport" content="width=device-width"/>
        </Helmet>

        <Grid>
          <Row>
            <Col xs={12}>
              <Col md={6}>
                <PageHeader>天刀功力排行榜</PageHeader>
                <h3>日期选择</h3>
                <h3>{this.state.date.format('YYYY-MM-DD')}</h3>
                <DatePicker selected={this.state.date.toDate()}
                  onChange={this.handleDateChange}
                  maxDate={moment().add(0, 'days').toDate()}
                  locale='zh-cn'
                  readOnly
                  inline
                />
                <h3>说明</h3>
                <p>本工具记录了2018年2月以来每一天凌晨1点到3点期间抓取的功力排行榜。可以查询区服历史功力排行以及单角色历史排行。
                  受到服务器维护等情况影响，期间有若干天数据缺失还请谅解。由于抓取数据不稳定，功力排行榜出现数据异常时可联系反馈给站长段段解决。</p>
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
    );
  }
}

export default MainList;
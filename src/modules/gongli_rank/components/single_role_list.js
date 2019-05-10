import React, { Component } from 'react';
import {Button, Col, Grid, PageHeader, Panel, Row, Table} from 'react-bootstrap';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import moment from 'moment';

import 'react-datepicker/dist/react-datepicker.css';
import {Helmet} from 'react-helmet';

import serverList from '../assets/json/server.json';
import Link from 'react-router-dom/es/Link';

class SingleRoleList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // date: moment().add(-4, 'hours'),
      serverId: null,
      roleName: null,
      singleRoleData: null,
      startDate: moment().add(-7, 'days'),
      endDate: moment().add(-4, 'hours')
    };

    this.handleDateChange = this.handleDateChange.bind(this);
    this.updateRankData = this.updateRankData.bind(this);
    this.handleChangeStart = this.handleChangeStart.bind(this);
    this.handleChangeEnd = this.handleChangeEnd.bind(this);
  }

  componentDidMount() {
    this.setState({
      serverId: this.props.match.params.serverId,
      roleName: this.props.match.params.roleName
    }, () => {
      this.updateRankData();
    });
  }

  updateRankData() {
    let url = 'https://wuxia.duan.sh/api/rank.php';
    // 获取时间
    let startDate = this.state.startDate.format('YYYY-MM-DD');
    let endDate = this.state.endDate.format('YYYY-MM-DD');
    let postData = `action=role&startDate=${startDate}&endDate=${endDate}&serverIdList=${this.state.serverId}&roleName=${this.state.roleName}`;
    axios.post(url, postData).then((response) => {
      console.log(response);
      this.setState({
        singleRoleData: response.data
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

  renderSingleServerAll() {
    let rankList;
    if(this.state.singleRoleData) {
      rankList = this.state.singleRoleData.map(({date, server_id, rank, role_id, school, gongli}, i) => {
        return(
          <tr key={i}>
            <td>{date}</td>
            <td>{rank}</td>
            <td><Link to={`/rank/role/${role_id}`}>{role_id}</Link></td>
            <td>{school}</td>
            <td>{gongli}</td></tr>
        );
      });
    } else {
      rankList = <tr><td colSpan={4}>暂无数据，每日凌晨1-4点为当日数据更新时段</td></tr>;
    }

    return(
      <Col md={12}>
        <Panel bsStyle='success'>
          <Panel.Body>
            <Table striped bordered condensed hover>
              <thead>
                <tr>
                  <th>日期</th>
                  <th>当日排名</th>
                  <th>昵称</th>
                  <th>门派</th>
                  <th>当日功力</th>
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

  handleChangeStart(date) {
    this.setState({
      startDate: moment(date)
    }, () => {
      this.updateRankData();
    });

  }

  handleChangeEnd(date) {
    this.setState({
      endDate: moment(date)
    }, () => {
      this.updateRankData();
    });

  }

  render() {
    return(
      <div>
        <Helmet defer={false}>
          <meta charSet="utf-8" />
          {/*<title>{serverList[this.state.serverId]}“{this.state.roleName}”玩家历史功力排行 | 天刀功力排行榜，每日最新排名、历史排名查询 | 段段天刀综合助手</title>*/}
          <title>{`${serverList[this.state.serverId]}“${this.state.roleName}”玩家历史功力排行 | 天刀功力排行榜，每日最新排名、历史排名查询 | 段段天刀综合助手`}</title>
          <meta name="keywords" content="天刀功力排行榜,天刀历史功力排名" />
          <meta name="description" content="天刀功力排行榜给您提供每日的所有天刀服务器的最新功力排名数据，同时支持选择日期查询历史功力排名。" />
          <meta name="viewport" content="width=device-width"/>
        </Helmet>
        <Grid>
          <Row>
            <Col xs={12}>
              <PageHeader>天刀功力排行榜<small><Link to="/rank">返回功力榜首页</Link></small></PageHeader>
              <h3>日期选择</h3>
              <h3>{this.state.startDate.format('YYYY-MM-DD')}至{this.state.endDate.format('YYYY-MM-DD')}</h3>
              <h3>说明</h3>
              <p>等待补充</p>
              <Col md={6} style={{textAlign: 'center'}}>
                <h4>选择开始日期</h4>
                <DatePicker
                  selected={this.state.startDate.toDate()}
                  maxDate={moment().add(0, 'days').toDate()}
                  selectsStart
                  startDate={this.state.startDate.toDate()}
                  endDate={this.state.endDate.toDate()}
                  onChange={this.handleChangeStart}
                  inline
                />
              </Col>
              <Col md={6} style={{textAlign: 'center'}}>
                <h4>选择结束日期</h4>
                <DatePicker
                  selected={this.state.endDate.toDate()}
                  maxDate={moment().add(0, 'days').toDate()}
                  selectsEnd
                  startDate={this.state.startDate.toDate()}
                  endDate={this.state.endDate.toDate()}
                  onChange={this.handleChangeEnd}
                  inline
                />
              </Col>
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <PageHeader>{serverList[this.state.serverId]}“{this.state.roleName}”玩家功力历史数据</PageHeader>
              {this.renderSingleServerAll()}
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default SingleRoleList;
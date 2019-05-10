import React, { Component } from 'react';
import {Button, Col, Grid, PageHeader, Panel, Row, Table} from 'react-bootstrap';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import moment from 'moment';

import 'react-datepicker/dist/react-datepicker.css';
import {Helmet} from 'react-helmet';

import serverList from '../assets/json/server.json';
import Link from 'react-router-dom/es/Link';

class SingleServerList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      date: moment().subtract(4, 'hours'),
      serverId: null,
      singleServerData: null
    };

    this.handleDateChange = this.handleDateChange.bind(this);
    this.updateRankData = this.updateRankData.bind(this);
  }

  componentDidMount() {
    this.setState({
      serverId: this.props.match.params.serverId
    }, () => {
      this.updateRankData();
    });
  }

  updateRankData() {
    let url = 'https://wuxia.duan.sh/api/rank.php';
    // 获取时间
    let startDate = this.state.date.format('YYYY-MM-DD');
    let endDate = this.state.date.clone().add(1, 'd').format('YYYY-MM-DD');
    // 获取全大区top20
    let postData = `action=each-top&startDate=${startDate}&endDate=${endDate}&start=0&num=1000&serverIdList=${this.state.serverId}`;
    axios.post(url, postData).then((response) => {
      console.log(response);
      this.setState({
        singleServerData: response.data[this.state.serverId][startDate]
      });
    });
  }

  handleDateChange(date) {
    this.setState({
      date: moment(date)
    }, () => {
      this.updateRankData();
    });
  }

  renderSingleServerAll() {
    let rankList;
    if(this.state.singleServerData) {
      rankList = this.state.singleServerData.map(({server_id, rank, role_id, school, gongli}, i) => {
        return(
          <tr key={i}>
            <td>{rank}</td>
            <td><Link to={`/rank/${server_id}/${role_id}`}>{role_id}</Link></td>
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

  render() {
    return(
      <div>
        <Helmet defer={false}>
          <meta charSet="utf-8" />
          <title>{`天刀${serverList[this.state.serverId]}服务器历史功力排行 | 天刀功力排行榜，每日最新排名、历史排名查询 | 段段天刀综合助手`}</title>
          <meta name="keywords" content="天刀功力排行榜,天刀历史功力排名" />
          <meta name="description" content="天刀功力排行榜给您提供每日的所有天刀服务器的最新功力排名数据，同时支持选择日期查询历史功力排名。" />
          <meta name="viewport" content="width=device-width"/>
        </Helmet>
        <Grid>
          <Row>
            <Col xs={12}>
              <Col md={6}>
                <PageHeader>天刀功力排行榜<small><Link to="/rank">返回功力榜首页</Link></small></PageHeader>
                <h3>日期选择</h3>
                <h3>{this.state.date.format('YYYY-MM-DD')}</h3>
                <DatePicker
                  selected={this.state.date.toDate()}
                  onChange={this.handleDateChange}
                  maxDate={moment().add(0, 'days').toDate()}
                  locale='zh-cn'
                  readOnly
                  inline
                />
                <h3>说明</h3>
                <p>等待补充</p>
              </Col>
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <PageHeader>{serverList[this.state.serverId]}服务器功力排行榜</PageHeader>
              {this.renderSingleServerAll()}
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default SingleServerList;
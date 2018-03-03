import React, { Component } from 'react';
import {Button, Col, Grid, PageHeader, Panel, Row, Table} from "react-bootstrap";
import axios from 'axios';
import DatePicker from 'react-datepicker';
import moment from 'moment';

import 'react-datepicker/dist/react-datepicker.css';

let areaList = {
  "青龙乱舞": {
    "长生剑": 1001,
    "孔雀翎": 1002,
    "情人箭": 1003,
    "多情环": 1006
  },
  "大地飞鹰": {
    "凤凰集": 2001,
    "藏锋谷": 2002
  },
  "血海飘香": {
    "蔷薇": 3002,
    "吹雪": 3009,
    "弧光": 3001
  },
  "陌上花开": {
    "彼岸花": 1101,
    "月见草": 1104
  },
  "天命风流": {
    "锦鲤抄": 1201,
    "千秋月": 1202,
    "如梦令": 1204,
    "凤求凰": 1206,
    "寒梅雪": 1207,
    "梦回还": 1211,
    "观沧海": 1214
  },
  "沧海云帆": {
    "时光沧海": 1301,
    "青龙永夜": 1302,
    "今夕何夕": 1303,
    "长风破浪": 1304,
    "潜龙之渊": 1305
  }
};

let serverList = [
  1001,
  1002,
  1003,
  1006,
  2001,
  2002,
  3002,
  3009,
  3001,
  1101,
  1104,
  1201,
  1202,
  1204,
  1206,
  1207,
  1211,
  1214,
  1301,
  1302,
  1303,
  1304,
  1305
];

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
    let url = `http://wuxia.duan.sh/api/rank.php`;
    // 获取时间
    let startDate = this.state.date.format("YYYY-MM-DD");
    let endDate = this.state.date.clone().add(1, 'd').format("YYYY-MM-DD");
    // 获取全大区top20
    let postData = `action=all-top20&startDate=${startDate}&endDate=${endDate}`;
    axios.post(url, postData).then((response) => {
      console.log(response);
      this.setState({
        top20Data: response.data
      });
    });
    // 获取服务器列表
    let serverIdList = serverList.join(',');
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
      rankList = <tr><td colSpan={4}>暂无数据，每日凌晨1-4点为当日数据更新时段</td></tr>
    }

    return(
      <Col md={12}>
        <Panel header='全大区功力排行榜' bsStyle='success'>
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
        </Panel>
      </Col>
    );
  }
  
  renderServerTop10List() {
    let data = this.state.serverRankData;
    let date = this.state.date.format("YYYY-MM-DD");
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
            rankList = <tr><td colSpan={4}>暂无数据，每日凌晨1-4点为当日数据更新时段</td></tr>
          }

          return(
            <Col md={6} lg={4} key={serverName}>
              <Panel header={serverName} bsStyle='success'>
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
    )
  }
  
  render() {
    return(
      <div>
        <Grid>
          <Row>
            <Col md={10} mdOffset={1}>
              <Col md={6}>
                <PageHeader>天刀功力排行榜</PageHeader>
                <h3>日期选择</h3>
                <h3>{this.state.date.format("YYYY-MM-DD")}</h3>
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
    );
  }
}

export default GongliRankApp;
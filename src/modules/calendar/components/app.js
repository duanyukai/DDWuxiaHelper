import React, { Component } from 'react';
import range from 'lodash/range';
import {
  Checkbox,
  Col, DropdownButton, Grid, MenuItem, Panel, Row,
  Table
} from 'react-bootstrap';
import Timeline from './timeline';

import './css/app.css';
import RealTimeClock from './real_time_clock';
import GameTimeClock from './game_time_clock';
import {dateToShichenDetail, dateToShichenId, getShichenName} from '../utils/shichen';
import moment from 'moment';
import RadioGroup from "./RadioGroup";

class CalendarApp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      realTime: new Date(),
      // realTime: this.getTimezoneDate(),
      gameTime: dateToShichenDetail(new Date()),
      // gameTime: dateToShichenDetail(this.getTimezoneDate()),
      timezoneSign: 1,
      timezoneValue: 8,
      showSecondHand: true,
      useTransition: true
    };
  }

  componentDidMount() {
    // 更新时间
    this.interval = setInterval(() => {
      this.setState({
        // realTime: new Date(),
        realTime: this.getTimezoneDate(),
        // gameTime: dateToShichenDetail(new Date())
        gameTime: dateToShichenDetail(this.getTimezoneDate())
      });
    }, 250);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  getTimezoneDate() {
    let date = new Date();
    let offset = this.state.timezoneSign * this.state.timezoneValue;
    const oneHour = 1000 * 60 * 60;
    let utc = date.getTime() - offset * oneHour;

    return new Date(utc + oneHour * 8);
  }

  render() {
    return (
      <div styleName='container'>
        <Grid>
          <Row>
            <Col md={12} lg={10} lgOffset={1}>
              <Panel header='天涯时刻吉凶预测系统' bsStyle='success'>
                {/*<D3Chart />*/}
                <Row>
                  <Col md={6}>
                    <h3>现实时间模拟时钟</h3>
                    <RealTimeClock
                      showSecondHand={this.state.showSecondHand}
                      getBeijingDate={this.getTimezoneDate.bind(this)}
                      useTransition={this.state.useTransition}
                    />
                    <h3>&nbsp;</h3>
                    <h3>{moment(this.state.realTime).format('YYYY-MM-DD HH:mm:ss')}</h3>
                  </Col>
                  <Col md={6}>
                    <h3>游戏时间模拟时钟</h3>
                    <GameTimeClock
                      showSecondHand={this.state.showSecondHand}
                      getBeijingDate={this.getTimezoneDate.bind(this)}
                      useTransition={this.state.useTransition}
                    />
                    <h3>{getShichenName(dateToShichenId(this.state.realTime))}时</h3>
                    <h3>{moment(this.state.gameTime).format('YYYY-MM-DD HH:mm:ss')}</h3>
                  </Col>
                </Row>
                <Timeline
                  getBeijingDate={this.getTimezoneDate.bind(this)}
                />
                <hr />
                <h4>设置</h4>
                {/*时区控制*/}
                <div>
                  <span>时区设置</span>{' '}
                  <RadioGroup
                    name='timezone-radio'
                    onChange={(e) => this.setState({timezoneSign: e.target.value})}
                    options={[
                      ['1', '+'],
                      ['-1', '-']
                    ]}
                    value={this.state.timezoneSign}
                  />{' '}
                  <DropdownButton
                    bsStyle='default'
                    title={this.state.timezoneValue}
                    id='timezone-dropdown'
                  >
                    {
                      range(13).map((i) => (
                        <MenuItem
                          eventKey={i}
                          key={i}
                          onSelect={(e) => this.setState({
                            timezoneValue: e
                          })}
                        >{i}</MenuItem>
                      ))
                    }
                  </DropdownButton>{' '}
                  <Checkbox
                    checked={this.state.showSecondHand}
                    onChange={(e) => this.setState({
                      showSecondHand: e.target.checked
                    })}
                    style={{display: 'inline-block'}}
                  >
                    显示秒针（卡顿时可关闭）
                  </Checkbox>{' '}
                  <Checkbox
                    checked={this.state.useTransition}
                    onChange={(e) => this.setState({
                      useTransition: e.target.checked
                    })}
                    style={{display: 'inline-block'}}
                  >
                    使用动画效果（卡顿时可关闭）
                  </Checkbox>
                </div>
                <hr />
                <h4>使用帮助</h4>
                <p>本工具上方分别为现实时间、游戏时间为主的模拟时钟，刻度圈皆是以游戏内十二时辰为准。通过此工具可方便地得知当前时间。</p>
                <p>下方时间轴工具分为吉凶预测轴和游戏时间轴，鼠标停留可以显示具体的吉凶信息和游戏时辰的精确到秒的开始与结束时间。</p>
              </Panel>
            </Col>
            <Col md={12} lg={10} lgOffset={1}>
              <Panel header='天刀游戏现实时间对照表（精确到秒）' bsStyle='success'>
                <h4>说明</h4>
                <hr styleName='header-hr' />
                <p>
                  网络上现存的其他数据误差一般在2~3分钟之间，萌新们在等待书画所需时辰时往往因误差有所耽搁。段段研究后发现了天刀时间的精准算法，
                  理论上误差在1秒以内，游戏内实际测试效果也很好。下面对算法进行详细说明。
                </p>
                <p>
                  天刀内的一天是4个小时，这一点大家都是清楚的。事实上一天也的确是整整4个小时，一秒不差，这样现实的一天在游戏内便对应6个游戏日。
                  但是十二个时辰的现实时长便各有不同了。网络上的数据多有将子时和午时都标记为5分钟，但事实上子时是4分48秒，午时是7分12秒。
                  原理就是将一天的4个小时（14400秒）等分为100份，每份即144秒。从子时起十二个时辰分别对应[2, 3, 4, 10, 17, 10, 3, 6, 19, 14, 8, 4]份。
                  这样的话子时两份为288秒，即总时长4分48秒，其他同理。
                </p>
                <p>
                  根据游戏内实际测量的子时开始时间（精确到秒）为02点04分48秒，便可以推算出整天的时间对应表。可以发现戌时的开始秒数在36分的00秒。
                  所以也许天刀时间是从某日这一刻的戌时开始算起的。
                </p>
                <p>
                  根据以上简单的算法，便可以推测出如下的天涯明月刀游戏现实时间对照表（精确到秒）。
                </p>
                <h4>数据</h4>
                <hr styleName='header-hr' />
                <Table striped bordered condensed responsive hover>
                  <thead>
                  <tr>
                    <th>时辰</th>
                    <th>游戏时间</th>
                    <th>现实时长</th>
                    <th>现实时间1</th>
                    <th>现实时间2</th>
                    <th>现实时间3</th>
                    <th>现实时间4</th>
                    <th>现实时间5</th>
                    <th>现实时间6</th>
                    <th>昼夜</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr><td>子时</td><td>23:00:00~00:59:59</td><td>04分48秒</td><td>02:04:48</td><td>06:04:48</td><td>10:04:48</td><td>14:04:48</td><td>18:04:48</td><td>23:04:48</td><td>黑夜</td></tr>
                  <tr><td>丑时</td><td>01:00:00~02:59:59</td><td>07分12秒</td><td>02:09:36</td><td>06:09:36</td><td>10:09:36</td><td>14:09:36</td><td>18:09:36</td><td>01:09:36</td><td>黑夜</td></tr>
                  <tr><td>寅时</td><td>03:00:00~04:59:59</td><td>09分36秒</td><td>02:16:48</td><td>06:16:48</td><td>10:16:48</td><td>14:16:48</td><td>18:16:48</td><td>03:16:48</td><td>黑夜</td></tr>
                  <tr><td>卯时</td><td>05:00:00~06:59:59</td><td>24分00秒</td><td>03:26:24</td><td>07:26:24</td><td>11:26:24</td><td>15:26:24</td><td>19:26:24</td><td>05:26:24</td><td>日出</td></tr>
                  <tr><td>辰时</td><td>07:00:00~08:59:59</td><td>40分48秒</td><td>03:50:24</td><td>07:50:24</td><td>11:50:24</td><td>15:50:24</td><td>19:50:24</td><td>07:50:24</td><td>白天</td></tr>
                  <tr><td>巳时</td><td>09:00:00~10:59:59</td><td>24分00秒</td><td>03:31:12</td><td>07:31:12</td><td>11:31:12</td><td>15:31:12</td><td>19:31:12</td><td>09:31:12</td><td>白天</td></tr>
                  <tr><td>午时</td><td>11:00:00~12:59:59</td><td>07分12秒</td><td>04:55:12</td><td>08:55:12</td><td>12:55:12</td><td>16:55:12</td><td>20:55:12</td><td>11:55:12</td><td>白天</td></tr>
                  <tr><td>未时</td><td>13:00:00~14:59:59</td><td>14分24秒</td><td>04:02:24</td><td>08:02:24</td><td>12:02:24</td><td>16:02:24</td><td>20:02:24</td><td>13:02:24</td><td>白天</td></tr>
                  <tr><td>申时</td><td>15:00:00~16:59:59</td><td>45分36秒</td><td>04:16:48</td><td>08:16:48</td><td>12:16:48</td><td>16:16:48</td><td>20:16:48</td><td>15:16:48</td><td>白天</td></tr>
                  <tr><td>酉时</td><td>17:00:00~18:59:59</td><td>33分36秒</td><td>05:02:24</td><td>09:02:24</td><td>13:02:24</td><td>17:02:24</td><td>21:02:24</td><td>17:02:24</td><td>日落</td></tr>
                  <tr><td>戌时</td><td>19:00:00~20:59:59</td><td>19分12秒</td><td>05:36:00</td><td>09:36:00</td><td>13:36:00</td><td>17:36:00</td><td>21:36:00</td><td>19:36:00</td><td>黑夜</td></tr>
                  <tr><td>亥时</td><td>21:00:00~22:59:59</td><td>09分36秒</td><td>05:55:12</td><td>09:55:12</td><td>13:55:12</td><td>17:55:12</td><td>21:55:12</td><td>21:55:12</td><td>黑夜</td></tr>
                  </tbody>
                </Table>
              </Panel>
            </Col>
            <Col md={12} lg={10} lgOffset={1}>
              <Panel header='天刀吉凶黄历循环表（匹配青龙换世版本）' bsStyle='success'>
                <h4>说明</h4>
                <hr styleName='header-hr' />
                <p>
                  吉凶系统恐怕是大家都喜欢吐槽的一个系统，打本求出金、盖房子求好风水、挖宝出大铁等种种，有些人难免想根据吉凶系统来决定做的任务。
                  虽然想来各种概率应该与吉凶系统无关，但大家往往都有自己的一套规律，类似如大凶挖宝出好货等等。
                </p>
                <p>
                  段段通过研究客户端发现，
                  天刀的吉凶系统算法实际上极其简单，当然吉凶计算仅与当前时间有关。每次子时更新当个游戏日的吉凶数据，而数据实际上就是轮换一张包括
                  360条数据的吉凶列表。当前版本（青龙换世版本）的吉凶系统明显经过过改造，不会再出现以往可能有的每日宜和忌相同的情况。
                </p>
                <p>
                  吉凶轮换的位移等细节这里就不过多描述，仅仅想查看吉凶的朋友可以通过上方的数据可视化非常轻松地看到未来几日的详细吉凶变化。
                  下面的数据给出的是360条吉凶轮换的原始数据，也就是说60个现实日是一个大的吉凶循环长度。
                </p>
                <h4>数据</h4>
                <hr styleName='header-hr' />
                <div style={{height: '500px', overflowY: 'scroll'}}>
                  <Table striped bordered condensed responsive hover>
                    <thead>
                    <tr>
                      <th>id</th>
                      <th>吉凶</th>
                      <th>宜</th>
                      <th>忌</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr><td>1</td><td>大吉</td><td>宜 诸事皆宜</td><td>忌 百无禁忌</td></tr>
                    <tr><td>2</td><td>大吉</td><td>宜 诸事皆宜</td><td>忌 百无禁忌</td></tr>
                    <tr><td>3</td><td>大吉</td><td>宜 诸事皆宜</td><td>忌 百无禁忌</td></tr>
                    <tr><td>4</td><td>吉</td><td>宜 出火 祈福 沐浴</td><td>忌 暗杀</td></tr>
                    <tr><td>5</td><td>小吉</td><td>宜 纳婿 缉盗</td><td>忌 沐浴</td></tr>
                    <tr><td>6</td><td>吉</td><td>宜 塑绘 冠笄</td><td>忌 竖柱</td></tr>
                    <tr><td>7</td><td>小凶</td><td>宜 缉盗</td><td>忌 纳婿 上梁</td></tr>
                    <tr><td>8</td><td>大吉</td><td>宜 诸事皆宜</td><td>忌 百无禁忌</td></tr>
                    <tr><td>9</td><td>末凶</td><td>宜 起基</td><td>忌 解除 竖柱</td></tr>
                    <tr><td>10</td><td>中吉</td><td>宜 入宅 酝酿 造库 见闻</td><td>忌 暗杀</td></tr>
                    <tr><td>11</td><td>末凶</td><td>宜 缉盗</td><td>忌 纳婿 上梁</td></tr>
                    <tr><td>12</td><td>末凶</td><td>宜 开柱眼</td><td>忌 纳采</td></tr>
                    <tr><td>13</td><td>吉</td><td>宜 求嗣 齐醮 纳婿</td><td>忌 求医</td></tr>
                    <tr><td>14</td><td>半凶</td><td>宜 上梁</td><td>忌 齐醮 出火 进人口</td></tr>
                    <tr><td>15</td><td>凶</td><td>宜 暗杀</td><td>忌 酝酿 交易 作陂 塞穴</td></tr>
                    <tr><td>16</td><td>吉</td><td>宜 开光 剃头</td><td>忌 上梁</td></tr>
                    <tr><td>17</td><td>中吉</td><td>宜 交易 捕捉 开井 扫洒</td><td>忌 盖屋</td></tr>
                    <tr><td>18</td><td>小凶</td><td>宜 竖柱</td><td>忌 解除</td></tr>
                    <tr><td>19</td><td>凶</td><td>宜 求医</td><td>忌 移徙 入宅 见闻 纳畜</td></tr>
                    <tr><td>20</td><td>末凶</td><td>宜 求嗣</td><td>忌 求医</td></tr>
                    <tr><td>21</td><td>中吉</td><td>宜 酝酿 作陂 扫洒</td><td>忌 修造</td></tr>
                    <tr><td>22</td><td>小吉</td><td>宜 冠笄 修造</td><td>忌 修造</td></tr>
                    <tr><td>23</td><td>末吉</td><td>宜 缉盗</td><td>忌 纳婿 上梁</td></tr>
                    <tr><td>24</td><td>小吉</td><td>宜 纳婿 起基</td><td>忌 安门</td></tr>
                    <tr><td>25</td><td>小凶</td><td>宜 求医</td><td>忌 嫁娶 缉盗</td></tr>
                    <tr><td>26</td><td>末凶</td><td>宜 修造</td><td>忌 捕捉 安床</td></tr>
                    <tr><td>27</td><td>半凶</td><td>宜 开柱眼</td><td>忌 纳采 裁衣 解除</td></tr>
                    <tr><td>28</td><td>末吉</td><td>宜 修造</td><td>忌 造库 作陂</td></tr>
                    <tr><td>29</td><td>凶</td><td>宜 安门</td><td>忌 栽种 移徙 畋猎 造库</td></tr>
                    <tr><td>30</td><td>末吉</td><td>宜 开柱眼</td><td>忌 纳采 裁衣 解除</td></tr>
                    <tr><td>31</td><td>凶</td><td>宜 修造</td><td>忌 捕捉 安床 造库 作陂</td></tr>
                    <tr><td>32</td><td>大凶</td><td>宜 无</td><td>忌 诸事不宜</td></tr>
                    <tr><td>33</td><td>小吉</td><td>宜 分居 开柱眼</td><td>忌 求医</td></tr>
                    <tr><td>34</td><td>半吉</td><td>宜 合帐 修造</td><td>忌 上梁</td></tr>
                    <tr><td>35</td><td>小吉</td><td>宜 合帐 修造</td><td>忌 上梁</td></tr>
                    <tr><td>36</td><td>小凶</td><td>宜 安门</td><td>忌 剃头</td></tr>
                    <tr><td>37</td><td>小吉</td><td>宜 冠笄 盖屋</td><td>忌 上梁</td></tr>
                    <tr><td>38</td><td>半凶</td><td>宜 上梁</td><td>忌 齐醮 求嗣 分居</td></tr>
                    <tr><td>39</td><td>末凶</td><td>宜 上梁</td><td>忌 齐醮 求嗣 分居</td></tr>
                    <tr><td>40</td><td>大凶</td><td>宜 无</td><td>忌 诸事不宜</td></tr>
                    <tr><td>41</td><td>半凶</td><td>宜 起基</td><td>忌 裁衣 出火 解除</td></tr>
                    <tr><td>42</td><td>末凶</td><td>宜 起基</td><td>忌 裁衣 出火 解除</td></tr>
                    <tr><td>43</td><td>吉</td><td>宜 塑绘 纳采 纳婿</td><td>忌 求医</td></tr>
                    <tr><td>44</td><td>末凶</td><td>宜 塑绘 纳采 纳婿</td><td>忌 求医</td></tr>
                    <tr><td>45</td><td>末吉</td><td>宜 嫁娶 安门</td><td>忌 上梁</td></tr>
                    <tr><td>46</td><td>小吉</td><td>宜 嫁娶 安门</td><td>忌 上梁</td></tr>
                    <tr><td>47</td><td>吉</td><td>宜 出火 裁衣 剃头</td><td>忌 开柱眼</td></tr>
                    <tr><td>48</td><td>大凶</td><td>宜 无</td><td>忌 诸事不宜</td></tr>
                    <tr><td>49</td><td>半吉</td><td>宜 开柱眼</td><td>忌 上梁</td></tr>
                    <tr><td>50</td><td>凶</td><td>宜 缉盗</td><td>忌 栽种 围猎 作陂</td></tr>
                    <tr><td>51</td><td>小凶</td><td>宜 开柱眼</td><td>忌 嫁娶 修造</td></tr>
                    <tr><td>52</td><td>大吉</td><td>宜 诸事皆宜</td><td>忌 百无禁忌</td></tr>
                    <tr><td>53</td><td>吉</td><td>宜 出行 裁衣 结拜</td><td>忌 起基</td></tr>
                    <tr><td>54</td><td>小吉</td><td>宜 冠笄</td><td>忌 上梁</td></tr>
                    <tr><td>55</td><td>小凶</td><td>宜 起基</td><td>忌 进人口</td></tr>
                    <tr><td>56</td><td>末吉</td><td>宜 裁衣 结拜</td><td>忌 上梁</td></tr>
                    <tr><td>57</td><td>末吉</td><td>宜 冠笄</td><td>忌 上梁</td></tr>
                    <tr><td>58</td><td>小吉</td><td>宜 嫁娶 缉盗</td><td>忌 暗杀</td></tr>
                    <tr><td>59</td><td>半吉</td><td>宜 冠笄</td><td>忌 上梁</td></tr>
                    <tr><td>60</td><td>末凶</td><td>宜 嫁娶 缉盗</td><td>忌 暗杀</td></tr>
                    <tr><td>61</td><td>小吉</td><td>宜 合帐</td><td>忌 竖柱</td></tr>
                    <tr><td>62</td><td>半吉</td><td>宜 嫁娶 缉盗</td><td>忌 暗杀</td></tr>
                    <tr><td>63</td><td>小凶</td><td>宜 起基</td><td>忌 剃头</td></tr>
                    <tr><td>64</td><td>大吉</td><td>宜 诸事皆宜</td><td>忌 百无禁忌</td></tr>
                    <tr><td>65</td><td>小吉</td><td>宜 合帐 竖柱</td><td>忌 上梁</td></tr>
                    <tr><td>66</td><td>吉</td><td>宜 祈福 求嗣 进人口</td><td>忌 上梁</td></tr>
                    <tr><td>67</td><td>半凶</td><td>宜 安门</td><td>忌 祭祀 出行 分居</td></tr>
                    <tr><td>68</td><td>大凶</td><td>宜 无</td><td>忌 诸事不宜</td></tr>
                    <tr><td>69</td><td>半吉</td><td>宜 祈福 求嗣 进人口</td><td>忌 上梁</td></tr>
                    <tr><td>70</td><td>末凶</td><td>宜 盖屋</td><td>忌 塑绘 纳采 冠笄</td></tr>
                    <tr><td>71</td><td>半凶</td><td>宜 盖屋</td><td>忌 塑绘 纳采 冠笄</td></tr>
                    <tr><td>72</td><td>大吉</td><td>宜 诸事皆宜</td><td>忌 百无禁忌</td></tr>
                    <tr><td>73</td><td>大凶</td><td>宜 无</td><td>忌 诸事不宜</td></tr>
                    <tr><td>74</td><td>中吉</td><td>宜 捕捉 交易 作陂 见闻</td><td>忌 求医</td></tr>
                    <tr><td>75</td><td>吉</td><td>宜 祈福 祭祀 进人口</td><td>忌 盖屋</td></tr>
                    <tr><td>76</td><td>凶</td><td>宜 竖柱</td><td>忌 安床 捕捉 拆卸 扫洒</td></tr>
                    <tr><td>77</td><td>大吉</td><td>宜 诸事皆宜</td><td>忌 百无禁忌</td></tr>
                    <tr><td>78</td><td>中吉</td><td>宜 捕捉 纳财 开井 纳畜</td><td>忌 盖屋</td></tr>
                    <tr><td>79</td><td>中吉</td><td>宜 纳财 开市 见闻</td><td>忌 暗杀</td></tr>
                    <tr><td>80</td><td>半凶</td><td>宜 安门</td><td>忌 求嗣 祈福 进人口</td></tr>
                    <tr><td>81</td><td>吉</td><td>宜 祭祀 纳采 纳婿</td><td>忌 修造</td></tr>
                    <tr><td>82</td><td>小吉</td><td>宜 解除 安门</td><td>忌 盖屋</td></tr>
                    <tr><td>83</td><td>半吉</td><td>宜 解除 安门</td><td>忌 盖屋</td></tr>
                    <tr><td>84</td><td>大吉</td><td>宜 诸事皆宜</td><td>忌 百无禁忌</td></tr>
                    <tr><td>85</td><td>中吉</td><td>宜 栽种 交易 纳畜 畋猎</td><td>忌 安门</td></tr>
                    <tr><td>86</td><td>吉</td><td>宜 齐醮 纳婿</td><td>忌 开柱眼</td></tr>
                    <tr><td>87</td><td>小吉</td><td>宜 进人口 起基</td><td>忌 安门</td></tr>
                    <tr><td>88</td><td>半吉</td><td>宜 进人口 起基</td><td>忌 安门</td></tr>
                    <tr><td>89</td><td>小吉</td><td>宜 解除 竖柱</td><td>忌 安门</td></tr>
                    <tr><td>90</td><td>大凶</td><td>宜 无</td><td>忌 诸事不宜</td></tr>
                    <tr><td>91</td><td>末凶</td><td>宜 纳婿 开柱眼</td><td>忌 竖柱</td></tr>
                    <tr><td>92</td><td>小吉</td><td>宜 纳婿 开柱眼</td><td>忌 竖柱</td></tr>
                    <tr><td>93</td><td>小凶</td><td>宜 开柱眼</td><td>忌 合帐</td></tr>
                    <tr><td>94</td><td>半吉</td><td>宜 进人口 起基</td><td>忌 上梁</td></tr>
                    <tr><td>95</td><td>小吉</td><td>宜 进人口 起基</td><td>忌 上梁</td></tr>
                    <tr><td>96</td><td>中吉</td><td>宜 交易 移徙 扫洒 见闻</td><td>忌 竖柱</td></tr>
                    <tr><td>97</td><td>大凶</td><td>宜 无</td><td>忌 诸事不宜</td></tr>
                    <tr><td>98</td><td>大吉</td><td>宜 诸事皆宜</td><td>忌 百无禁忌</td></tr>
                    <tr><td>99</td><td>中吉</td><td>宜 移徙 栽种 塞穴 作陂</td><td>忌 暗杀</td></tr>
                    <tr><td>100</td><td>小凶</td><td>宜 上梁</td><td>忌 分居 求医</td></tr>
                    <tr><td>101</td><td>半吉</td><td>宜 上梁</td><td>忌 分居 求医</td></tr>
                    <tr><td>102</td><td>大吉</td><td>宜 诸事皆宜</td><td>忌 百无禁忌</td></tr>
                    <tr><td>103</td><td>末吉</td><td>宜 上梁</td><td>忌 分居 求医</td></tr>
                    <tr><td>104</td><td>吉</td><td>宜 开光 裁衣 剃头</td><td>忌 修造</td></tr>
                    <tr><td>105</td><td>末吉</td><td>宜 解除 起基</td><td>忌 缉盗</td></tr>
                    <tr><td>106</td><td>大吉</td><td>宜 诸事皆宜</td><td>忌 百无禁忌</td></tr>
                    <tr><td>107</td><td>小吉</td><td>宜 解除 起基</td><td>忌 缉盗</td></tr>
                    <tr><td>108</td><td>小吉</td><td>宜 冠笄 开柱眼</td><td>忌 盖屋</td></tr>
                    <tr><td>109</td><td>小凶</td><td>宜 起基</td><td>忌 分居 缉盗</td></tr>
                    <tr><td>110</td><td>中吉</td><td>宜 栽种 入宅 塞穴 围猎</td><td>忌 盖屋</td></tr>
                    <tr><td>111</td><td>凶</td><td>宜 起基</td><td>忌 挂匾 安床 畋猎 畋猎</td></tr>
                    <tr><td>112</td><td>中吉</td><td>宜 纳财 开市 造库 开井</td><td>忌 起基</td></tr>
                    <tr><td>113</td><td>小吉</td><td>宜 分居 盖屋</td><td>忌 竖柱</td></tr>
                    <tr><td>114</td><td>末吉</td><td>宜 分居 盖屋</td><td>忌 竖柱</td></tr>
                    <tr><td>115</td><td>小凶</td><td>宜 暗杀</td><td>忌 沐浴 缉盗</td></tr>
                    <tr><td>116</td><td>小吉</td><td>宜 进人口 安门</td><td>忌 开柱眼</td></tr>
                    <tr><td>117</td><td>大吉</td><td>宜 诸事皆宜</td><td>忌 百无禁忌</td></tr>
                    <tr><td>118</td><td>末吉</td><td>宜 分居 盖屋</td><td>忌 竖柱</td></tr>
                    <tr><td>119</td><td>末凶</td><td>宜 暗杀</td><td>忌 沐浴 缉盗</td></tr>
                    <tr><td>120</td><td>大吉</td><td>宜 诸事皆宜</td><td>忌 百无禁忌</td></tr>
                    <tr><td>121</td><td>凶</td><td>宜 开柱眼</td><td>忌 酝酿 开市 围猎 扫洒</td></tr>
                    <tr><td>122</td><td>末吉</td><td>宜 暗杀</td><td>忌 沐浴 缉盗</td></tr>
                    <tr><td>123</td><td>凶</td><td>宜 起基</td><td>忌 开市 入宅 扫洒 拆卸</td></tr>
                    <tr><td>124</td><td>末吉</td><td>宜 开光 祭祀 冠笄</td><td>忌 盖屋</td></tr>
                    <tr><td>125</td><td>末凶</td><td>宜 开柱眼</td><td>忌 齐醮 求嗣 冠笄</td></tr>
                    <tr><td>126</td><td>吉</td><td>宜 开光 祭祀 冠笄</td><td>忌 盖屋</td></tr>
                    <tr><td>127</td><td>大吉</td><td>宜 诸事皆宜</td><td>忌 百无禁忌</td></tr>
                    <tr><td>128</td><td>大凶</td><td>宜 无</td><td>忌 诸事不宜</td></tr>
                    <tr><td>129</td><td>半吉</td><td>宜 开光 祭祀 冠笄</td><td>忌 盖屋</td></tr>
                    <tr><td>130</td><td>半凶</td><td>宜 开柱眼</td><td>忌 齐醮 求嗣 冠笄</td></tr>
                    <tr><td>131</td><td>吉</td><td>宜 开光 出行 嫁娶</td><td>忌 上梁</td></tr>
                    <tr><td>132</td><td>末凶</td><td>宜 分居 盖屋</td><td>忌 竖柱</td></tr>
                    <tr><td>133</td><td>小凶</td><td>宜 盖屋</td><td>忌 冠笄 安门</td></tr>
                    <tr><td>134</td><td>小凶</td><td>宜 盖屋</td><td>忌 分居 安门</td></tr>
                    <tr><td>135</td><td>末凶</td><td>宜 盖屋</td><td>忌 求医</td></tr>
                    <tr><td>136</td><td>大凶</td><td>宜 无</td><td>忌 诸事不宜</td></tr>
                    <tr><td>137</td><td>吉</td><td>宜 出行 求嗣 结拜</td><td>忌 求医</td></tr>
                    <tr><td>138</td><td>小凶</td><td>宜 开柱眼</td><td>忌 结拜 修造</td></tr>
                    <tr><td>139</td><td>末吉</td><td>宜 开柱眼</td><td>忌 结拜 修造</td></tr>
                    <tr><td>140</td><td>末吉</td><td>宜 纳婿 起基</td><td>忌 修造</td></tr>
                    <tr><td>141</td><td>小吉</td><td>宜 解除</td><td>忌 盖屋</td></tr>
                    <tr><td>142</td><td>大吉</td><td>宜 诸事皆宜</td><td>忌 百无禁忌</td></tr>
                    <tr><td>143</td><td>半吉</td><td>宜 开柱眼</td><td>忌 解除 竖柱</td></tr>
                    <tr><td>144</td><td>小凶</td><td>宜 开柱眼</td><td>忌 解除 竖柱</td></tr>
                    <tr><td>145</td><td>中吉</td><td>宜 酝酿 捕捉 扫洒</td><td>忌 开柱眼</td></tr>
                    <tr><td>146</td><td>小吉</td><td>宜 纳婿 起基</td><td>忌 修造</td></tr>
                    <tr><td>147</td><td>吉</td><td>宜 出火 祭祀 合帐</td><td>忌 暗杀</td></tr>
                    <tr><td>148</td><td>吉</td><td>宜 裁衣 出火 嫁娶</td><td>忌 盖屋</td></tr>
                    <tr><td>149</td><td>末吉</td><td>宜 出火 祭祀 合帐</td><td>忌 暗杀</td></tr>
                    <tr><td>150</td><td>小吉</td><td>宜 沐浴 起基</td><td>忌 求医</td></tr>
                    <tr><td>151</td><td>凶</td><td>宜 求医</td><td>忌 移徙 开市 开井 围猎</td></tr>
                    <tr><td>152</td><td>半吉</td><td>宜 沐浴 起基</td><td>忌 求医</td></tr>
                    <tr><td>153</td><td>半吉</td><td>宜 沐浴 起基</td><td>忌 求医</td></tr>
                    <tr><td>154</td><td>吉</td><td>宜 开光 出火 合帐</td><td>忌 起基</td></tr>
                    <tr><td>155</td><td>半吉</td><td>宜 沐浴 起基</td><td>忌 求医</td></tr>
                    <tr><td>156</td><td>吉</td><td>宜 出火 出火 沐浴</td><td>忌 起基</td></tr>
                    <tr><td>157</td><td>小吉</td><td>宜 沐浴 开柱眼</td><td>忌 竖柱</td></tr>
                    <tr><td>158</td><td>半凶</td><td>宜 上梁</td><td>忌 出行 祈福 合帐</td></tr>
                    <tr><td>159</td><td>半吉</td><td>宜 沐浴 起基</td><td>忌 求医</td></tr>
                    <tr><td>160</td><td>大凶</td><td>宜 无</td><td>忌 诸事不宜</td></tr>
                    <tr><td>161</td><td>小吉</td><td>宜 剃头 安门</td><td>忌 修造</td></tr>
                    <tr><td>162</td><td>小吉</td><td>宜 嫁娶 起基</td><td>忌 竖柱</td></tr>
                    <tr><td>163</td><td>中吉</td><td>宜 开市 酝酿 塞穴 拆卸</td><td>忌 上梁</td></tr>
                    <tr><td>164</td><td>大吉</td><td>宜 诸事皆宜</td><td>忌 百无禁忌</td></tr>
                    <tr><td>165</td><td>大凶</td><td>宜 无</td><td>忌 诸事不宜</td></tr>
                    <tr><td>166</td><td>末凶</td><td>宜 沐浴 起基</td><td>忌 求医</td></tr>
                    <tr><td>167</td><td>小凶</td><td>宜 修造</td><td>忌 合帐 缉盗</td></tr>
                    <tr><td>168</td><td>末凶</td><td>宜 沐浴 起基</td><td>忌 求医</td></tr>
                    <tr><td>169</td><td>小凶</td><td>宜 盖屋</td><td>忌 解除 缉盗</td></tr>
                    <tr><td>170</td><td>末吉</td><td>宜 沐浴 起基</td><td>忌 求医</td></tr>
                    <tr><td>171</td><td>吉</td><td>宜 开光 齐醮 解除</td><td>忌 上梁</td></tr>
                    <tr><td>172</td><td>末吉</td><td>宜 沐浴 起基</td><td>忌 求医</td></tr>
                    <tr><td>173</td><td>半凶</td><td>宜 安门</td><td>忌 塑绘 求嗣 纳婿</td></tr>
                    <tr><td>174</td><td>末吉</td><td>宜 沐浴 起基</td><td>忌 求医</td></tr>
                    <tr><td>175</td><td>小吉</td><td>宜 纳婿 安门</td><td>忌 开柱眼</td></tr>
                    <tr><td>176</td><td>中吉</td><td>宜 移徙 栽种 拆卸 见闻</td><td>忌 起基</td></tr>
                    <tr><td>177</td><td>吉</td><td>宜 祭祀 齐醮 剃头</td><td>忌 盖屋</td></tr>
                    <tr><td>178</td><td>凶</td><td>宜 上梁</td><td>忌 安床 栽种 围猎 见闻</td></tr>
                    <tr><td>179</td><td>吉</td><td>宜 祈福 祭祀 合帐</td><td>忌 修造</td></tr>
                    <tr><td>180</td><td>小吉</td><td>宜 冠笄 盖屋</td><td>忌 竖柱</td></tr>
                    <tr><td>181</td><td>半凶</td><td>宜 起基</td><td>忌 祭祀 出行 冠笄</td></tr>
                    <tr><td>182</td><td>吉</td><td>宜 求嗣 祭祀 结拜</td><td>忌 竖柱</td></tr>
                    <tr><td>183</td><td>半凶</td><td>宜 修造</td><td>忌 出行 出火 剃头</td></tr>
                    <tr><td>184</td><td>小凶</td><td>宜 暗杀</td><td>忌 冠笄 上梁</td></tr>
                    <tr><td>185</td><td>末吉</td><td>宜 沐浴 起基</td><td>忌 求医</td></tr>
                    <tr><td>186</td><td>中吉</td><td>宜 开市 安床 造库 见闻</td><td>忌 求医</td></tr>
                    <tr><td>187</td><td>大凶</td><td>宜 无</td><td>忌 诸事不宜</td></tr>
                    <tr><td>188</td><td>中吉</td><td>宜 入宅 栽种 畋猎 塞穴</td><td>忌 求医</td></tr>
                    <tr><td>189</td><td>小凶</td><td>宜 求医</td><td>忌 结拜 盖屋</td></tr>
                    <tr><td>190</td><td>小吉</td><td>宜 嫁娶 竖柱</td><td>忌 求医</td></tr>
                    <tr><td>191</td><td>末吉</td><td>宜 嫁娶 竖柱</td><td>忌 求医</td></tr>
                    <tr><td>192</td><td>小凶</td><td>宜 竖柱</td><td>忌 冠笄 上梁</td></tr>
                    <tr><td>193</td><td>半凶</td><td>宜 上梁</td><td>忌 纳采 求嗣 解除</td></tr>
                    <tr><td>194</td><td>小吉</td><td>宜 解除 求医</td><td>忌 安门</td></tr>
                    <tr><td>195</td><td>中吉</td><td>宜 捕捉 开市 扫洒 纳畜</td><td>忌 修造</td></tr>
                    <tr><td>196</td><td>小吉</td><td>宜 进人口 起基</td><td>忌 上梁</td></tr>
                    <tr><td>197</td><td>半吉</td><td>宜 进人口 起基</td><td>忌 上梁</td></tr>
                    <tr><td>198</td><td>末吉</td><td>宜 捕捉 开市 扫洒 纳畜</td><td>忌 修造</td></tr>
                    <tr><td>199</td><td>末吉</td><td>宜 暗杀</td><td>忌 入宅 移徙 纳畜 造库</td></tr>
                    <tr><td>200</td><td>凶</td><td>宜 起基</td><td>忌 安床 交易 拆卸 围猎</td></tr>
                    <tr><td>201</td><td>凶</td><td>宜 暗杀</td><td>忌 入宅 移徙 纳畜 造库</td></tr>
                    <tr><td>202</td><td>小吉</td><td>宜 纳婿 暗杀</td><td>忌 求医</td></tr>
                    <tr><td>203</td><td>凶</td><td>宜 开柱眼</td><td>忌 移徙 纳财 拆卸 围猎</td></tr>
                    <tr><td>204</td><td>末凶</td><td>宜 暗杀</td><td>忌 入宅 移徙 纳畜 造库</td></tr>
                    <tr><td>205</td><td>中吉</td><td>宜 安床 栽种 拆卸 开井</td><td>忌 暗杀</td></tr>
                    <tr><td>206</td><td>中吉</td><td>宜 栽种 围猎 作陂</td><td>忌 起基</td></tr>
                    <tr><td>207</td><td>吉</td><td>宜 齐醮 开光 冠笄</td><td>忌 缉盗</td></tr>
                    <tr><td>208</td><td>小凶</td><td>宜 开柱眼</td><td>忌 结拜 起基</td></tr>
                    <tr><td>209</td><td>小吉</td><td>宜 分居 竖柱</td><td>忌 缉盗</td></tr>
                    <tr><td>210</td><td>凶</td><td>宜 竖柱</td><td>忌 安床 纳财 畋猎 扫洒</td></tr>
                    <tr><td>211</td><td>末吉</td><td>宜 分居 竖柱</td><td>忌 缉盗</td></tr>
                    <tr><td>212</td><td>凶</td><td>宜 安门</td><td>忌 挂匾 栽种 纳畜 畋猎</td></tr>
                    <tr><td>213</td><td>小吉</td><td>宜 分居 起基</td><td>忌 上梁</td></tr>
                    <tr><td>214</td><td>大凶</td><td>宜 无</td><td>忌 诸事不宜</td></tr>
                    <tr><td>215</td><td>半吉</td><td>宜 分居 竖柱</td><td>忌 缉盗</td></tr>
                    <tr><td>216</td><td>中吉</td><td>宜 开市 入宅 扫洒 开井</td><td>忌 盖屋</td></tr>
                    <tr><td>217</td><td>半凶</td><td>宜 修造</td><td>忌 开光 剃头</td></tr>
                    <tr><td>218</td><td>小吉</td><td>宜 沐浴</td><td>忌 暗杀</td></tr>
                    <tr><td>219</td><td>吉</td><td>宜 祈福 开光 纳婿</td><td>忌 开柱眼</td></tr>
                    <tr><td>220</td><td>末吉</td><td>宜 分居 竖柱</td><td>忌 缉盗</td></tr>
                    <tr><td>221</td><td>小吉</td><td>宜 沐浴 求医</td><td>忌 盖屋</td></tr>
                    <tr><td>222</td><td>小凶</td><td>宜 暗杀</td><td>忌 剃头</td></tr>
                    <tr><td>223</td><td>半凶</td><td>宜 盖屋</td><td>忌 开光 齐醮 剃头</td></tr>
                    <tr><td>224</td><td>末凶</td><td>宜 沐浴 求医</td><td>忌 盖屋</td></tr>
                    <tr><td>225</td><td>大吉</td><td>宜 诸事皆宜</td><td>忌 百无禁忌</td></tr>
                    <tr><td>226</td><td>大凶</td><td>宜 无</td><td>忌 诸事不宜</td></tr>
                    <tr><td>227</td><td>末凶</td><td>宜 沐浴 求医</td><td>忌 盖屋</td></tr>
                    <tr><td>228</td><td>末凶</td><td>宜 沐浴 求医</td><td>忌 盖屋</td></tr>
                    <tr><td>229</td><td>大吉</td><td>宜 诸事皆宜</td><td>忌 百无禁忌</td></tr>
                    <tr><td>230</td><td>小吉</td><td>宜 沐浴 暗杀</td><td>忌 起基</td></tr>
                    <tr><td>231</td><td>小吉</td><td>宜 纳婿 盖屋</td><td>忌 暗杀</td></tr>
                    <tr><td>232</td><td>凶</td><td>宜 竖柱</td><td>忌 纳财 开市 塞穴 拆卸</td></tr>
                    <tr><td>233</td><td>大凶</td><td>宜 无</td><td>忌 诸事不宜</td></tr>
                    <tr><td>234</td><td>中吉</td><td>宜 挂匾 开市 扫洒 纳畜</td><td>忌 修造</td></tr>
                    <tr><td>235</td><td>凶</td><td>宜 起基</td><td>忌 交易 交易 见闻 拆卸</td></tr>
                    <tr><td>236</td><td>末凶</td><td>宜 沐浴 求医</td><td>忌 盖屋</td></tr>
                    <tr><td>237</td><td>末凶</td><td>宜 剃头 起基</td><td>忌 上梁</td></tr>
                    <tr><td>238</td><td>小吉</td><td>宜 剃头 起基</td><td>忌 上梁</td></tr>
                    <tr><td>239</td><td>大凶</td><td>宜 无</td><td>忌 诸事不宜</td></tr>
                    <tr><td>240</td><td>大凶</td><td>宜 无</td><td>忌 诸事不宜</td></tr>
                    <tr><td>241</td><td>末吉</td><td>宜 剃头 起基</td><td>忌 上梁</td></tr>
                    <tr><td>242</td><td>半凶</td><td>宜 安门</td><td>忌 齐醮 出行 剃头</td></tr>
                    <tr><td>243</td><td>大吉</td><td>宜 诸事皆宜</td><td>忌 百无禁忌</td></tr>
                    <tr><td>244</td><td>小吉</td><td>宜 沐浴 竖柱</td><td>忌 起基</td></tr>
                    <tr><td>245</td><td>小吉</td><td>宜 解除 安门</td><td>忌 开柱眼</td></tr>
                    <tr><td>246</td><td>半吉</td><td>宜 剃头 起基</td><td>忌 上梁</td></tr>
                    <tr><td>247</td><td>半吉</td><td>宜 剃头 起基</td><td>忌 上梁</td></tr>
                    <tr><td>248</td><td>大凶</td><td>宜 无</td><td>忌 诸事不宜</td></tr>
                    <tr><td>249</td><td>凶</td><td>宜 缉盗</td><td>忌 开市 开市 拆卸 见闻</td></tr>
                    <tr><td>250</td><td>小凶</td><td>宜 开柱眼</td><td>忌 嫁娶 竖柱</td></tr>
                    <tr><td>251</td><td>大吉</td><td>宜 诸事皆宜</td><td>忌 百无禁忌</td></tr>
                    <tr><td>252</td><td>大凶</td><td>宜 无</td><td>忌 诸事不宜</td></tr>
                    <tr><td>253</td><td>小吉</td><td>宜 剃头 求医</td><td>忌 开柱眼</td></tr>
                    <tr><td>254</td><td>凶</td><td>宜 求医</td><td>忌 移徙 开市 纳畜 扫洒</td></tr>
                    <tr><td>255</td><td>半凶</td><td>宜 安门</td><td>忌 齐醮 祭祀 结拜</td></tr>
                    <tr><td>256</td><td>大凶</td><td>宜 无</td><td>忌 诸事不宜</td></tr>
                    <tr><td>257</td><td>半吉</td><td>宜 剃头 起基</td><td>忌 上梁</td></tr>
                    <tr><td>258</td><td>半凶</td><td>宜 起基</td><td>忌 出火 出火 纳婿</td></tr>
                    <tr><td>259</td><td>小凶</td><td>宜 上梁</td><td>忌 嫁娶 求医</td></tr>
                    <tr><td>260</td><td>大凶</td><td>宜 无</td><td>忌 诸事不宜</td></tr>
                    <tr><td>261</td><td>小吉</td><td>宜 结拜 求医</td><td>忌 盖屋</td></tr>
                    <tr><td>262</td><td>吉</td><td>宜 祭祀 裁衣 进人口</td><td>忌 盖屋</td></tr>
                    <tr><td>263</td><td>小吉</td><td>宜 进人口 修造</td><td>忌 上梁</td></tr>
                    <tr><td>264</td><td>小凶</td><td>宜 缉盗</td><td>忌 剃头 起基</td></tr>
                    <tr><td>265</td><td>中吉</td><td>宜 安床 开市 畋猎 作陂</td><td>忌 竖柱</td></tr>
                    <tr><td>266</td><td>中吉</td><td>宜 纳财 酝酿 开井 畋猎</td><td>忌 修造</td></tr>
                    <tr><td>267</td><td>末吉</td><td>宜 剃头 起基</td><td>忌 上梁</td></tr>
                    <tr><td>268</td><td>凶</td><td>宜 缉盗</td><td>忌 酝酿 捕捉 围猎 扫洒</td></tr>
                    <tr><td>269</td><td>小凶</td><td>宜 起基</td><td>忌 进人口 求医</td></tr>
                    <tr><td>270</td><td>凶</td><td>宜 竖柱</td><td>忌 捕捉 入宅 见闻 扫洒</td></tr>
                    <tr><td>271</td><td>末凶</td><td>宜 剃头 起基</td><td>忌 上梁</td></tr>
                    <tr><td>272</td><td>小凶</td><td>宜 竖柱</td><td>忌 嫁娶 修造</td></tr>
                    <tr><td>273</td><td>半凶</td><td>宜 修造</td><td>忌 齐醮 纳采 合帐</td></tr>
                    <tr><td>274</td><td>末凶</td><td>宜 剃头 起基</td><td>忌 上梁</td></tr>
                    <tr><td>275</td><td>凶</td><td>宜 上梁</td><td>忌 移徙 酝酿 作陂 见闻</td></tr>
                    <tr><td>276</td><td>小吉</td><td>宜 沐浴 缉盗</td><td>忌 求医</td></tr>
                    <tr><td>277</td><td>半凶</td><td>宜 暗杀</td><td>忌 祭祀 开光 冠笄</td></tr>
                    <tr><td>278</td><td>大吉</td><td>宜 诸事皆宜</td><td>忌 百无禁忌</td></tr>
                    <tr><td>279</td><td>小吉</td><td>宜 嫁娶 缉盗</td><td>忌 盖屋</td></tr>
                    <tr><td>280</td><td>小吉</td><td>宜 嫁娶 安门</td><td>忌 暗杀</td></tr>
                    <tr><td>281</td><td>半吉</td><td>宜 剃头 起基</td><td>忌 上梁</td></tr>
                    <tr><td>282</td><td>半吉</td><td>宜 祈福 出火 解除</td><td>忌 竖柱</td></tr>
                    <tr><td>283</td><td>大吉</td><td>宜 诸事皆宜</td><td>忌 百无禁忌</td></tr>
                    <tr><td>284</td><td>吉</td><td>宜 祈福 出火 解除</td><td>忌 竖柱</td></tr>
                    <tr><td>285</td><td>大凶</td><td>宜 无</td><td>忌 诸事不宜</td></tr>
                    <tr><td>286</td><td>小吉</td><td>宜 嫁娶 起基</td><td>忌 求医</td></tr>
                    <tr><td>287</td><td>大吉</td><td>宜 诸事皆宜</td><td>忌 百无禁忌</td></tr>
                    <tr><td>288</td><td>大凶</td><td>宜 无</td><td>忌 诸事不宜</td></tr>
                    <tr><td>289</td><td>半凶</td><td>宜 盖屋</td><td>忌 塑绘 纳采 进人口</td></tr>
                    <tr><td>290</td><td>半凶</td><td>宜 缉盗</td><td>忌 塑绘 求嗣 嫁娶</td></tr>
                    <tr><td>291</td><td>半吉</td><td>宜 祈福 出火 解除</td><td>忌 竖柱</td></tr>
                    <tr><td>292</td><td>末凶</td><td>宜 挂匾 栽种</td><td>忌 开柱眼</td></tr>
                    <tr><td>293</td><td>大凶</td><td>宜 无</td><td>忌 诸事不宜</td></tr>
                    <tr><td>294</td><td>大吉</td><td>宜 诸事皆宜</td><td>忌 百无禁忌</td></tr>
                    <tr><td>295</td><td>末吉</td><td>宜 挂匾 栽种</td><td>忌 开柱眼</td></tr>
                    <tr><td>296</td><td>中吉</td><td>宜 挂匾 栽种 围猎 造库</td><td>忌 开柱眼</td></tr>
                    <tr><td>297</td><td>半吉</td><td>宜 祈福 出火 解除</td><td>忌 竖柱</td></tr>
                    <tr><td>298</td><td>大吉</td><td>宜 诸事皆宜</td><td>忌 百无禁忌</td></tr>
                    <tr><td>299</td><td>小吉</td><td>宜 合帐</td><td>忌 起基</td></tr>
                    <tr><td>300</td><td>半吉</td><td>宜 祈福 出火 解除</td><td>忌 竖柱</td></tr>
                    <tr><td>301</td><td>小吉</td><td>宜 剃头 开柱眼</td><td>忌 竖柱</td></tr>
                    <tr><td>302</td><td>中吉</td><td>宜 挂匾 酝酿 纳畜 造库</td><td>忌 缉盗</td></tr>
                    <tr><td>303</td><td>凶</td><td>宜 安门</td><td>忌 开市 交易 围猎 开井</td></tr>
                    <tr><td>304</td><td>小吉</td><td>宜 解除 安门</td><td>忌 盖屋</td></tr>
                    <tr><td>305</td><td>半吉</td><td>宜 解除 安门</td><td>忌 盖屋</td></tr>
                    <tr><td>306</td><td>小吉</td><td>宜 沐浴 修造</td><td>忌 竖柱</td></tr>
                    <tr><td>307</td><td>半吉</td><td>宜 挂匾 栽种</td><td>忌 开柱眼</td></tr>
                    <tr><td>308</td><td>末凶</td><td>宜 挂匾 栽种 围猎 造库</td><td>忌 开柱眼</td></tr>
                    <tr><td>309</td><td>小凶</td><td>宜 开柱眼</td><td>忌 合帐 起基</td></tr>
                    <tr><td>310</td><td>小吉</td><td>宜 嫁娶 缉盗</td><td>忌 安门</td></tr>
                    <tr><td>311</td><td>半凶</td><td>宜 竖柱</td><td>忌 出火 出行 剃头</td></tr>
                    <tr><td>312</td><td>中吉</td><td>宜 挂匾 入宅 作陂 见闻</td><td>忌 盖屋</td></tr>
                    <tr><td>313</td><td>末吉</td><td>宜 嫁娶 缉盗</td><td>忌 安门</td></tr>
                    <tr><td>314</td><td>末凶</td><td>宜 挂匾 栽种</td><td>忌 开柱眼</td></tr>
                    <tr><td>315</td><td>大吉</td><td>宜 诸事皆宜</td><td>忌 百无禁忌</td></tr>
                    <tr><td>316</td><td>末吉</td><td>宜 挂匾 栽种</td><td>忌 开柱眼</td></tr>
                    <tr><td>317</td><td>大凶</td><td>宜 无</td><td>忌 诸事不宜</td></tr>
                    <tr><td>318</td><td>大吉</td><td>宜 诸事皆宜</td><td>忌 百无禁忌</td></tr>
                    <tr><td>319</td><td>吉</td><td>宜 齐醮 开光 结拜</td><td>忌 起基</td></tr>
                    <tr><td>320</td><td>中吉</td><td>宜 开市 安床 开井 围猎</td><td>忌 修造</td></tr>
                    <tr><td>321</td><td>大凶</td><td>宜 无</td><td>忌 诸事不宜</td></tr>
                    <tr><td>322</td><td>凶</td><td>宜 缉盗</td><td>忌 开市 纳财 塞穴 造库</td></tr>
                    <tr><td>323</td><td>半凶</td><td>宜 求医</td><td>忌 纳采 出火 冠笄</td></tr>
                    <tr><td>324</td><td>大吉</td><td>宜 诸事皆宜</td><td>忌 百无禁忌</td></tr>
                    <tr><td>325</td><td>吉</td><td>宜 祈福 祈福 结拜</td><td>忌 竖柱</td></tr>
                    <tr><td>326</td><td>小吉</td><td>宜 沐浴 起基</td><td>忌 竖柱</td></tr>
                    <tr><td>327</td><td>中吉</td><td>宜 捕捉 酝酿 开井 塞穴</td><td>忌 安门</td></tr>
                    <tr><td>328</td><td>半凶</td><td>宜 竖柱</td><td>忌 开光 纳采 沐浴</td></tr>
                    <tr><td>329</td><td>中吉</td><td>宜 移徙 交易 拆卸 见闻</td><td>忌 起基</td></tr>
                    <tr><td>330</td><td>吉</td><td>宜 祈福 出火 冠笄</td><td>忌 暗杀</td></tr>
                    <tr><td>331</td><td>小吉</td><td>宜 结拜 暗杀</td><td>忌 缉盗</td></tr>
                    <tr><td>332</td><td>小吉</td><td>宜 结拜 盖屋</td><td>忌 起基</td></tr>
                    <tr><td>333</td><td>大凶</td><td>宜 无</td><td>忌 诸事不宜</td></tr>
                    <tr><td>334</td><td>中吉</td><td>宜 酝酿 捕捉 纳畜 塞穴</td><td>忌 求医</td></tr>
                    <tr><td>335</td><td>半吉</td><td>宜 祈福 出火 冠笄</td><td>忌 暗杀</td></tr>
                    <tr><td>336</td><td>大吉</td><td>宜 诸事皆宜</td><td>忌 百无禁忌</td></tr>
                    <tr><td>337</td><td>凶</td><td>宜 开柱眼</td><td>忌 挂匾 酝酿 拆卸 围猎</td></tr>
                    <tr><td>338</td><td>半吉</td><td>宜 祈福 出火 冠笄</td><td>忌 暗杀</td></tr>
                    <tr><td>339</td><td>半凶</td><td>宜 盖屋</td><td>忌 出行 分居</td></tr>
                    <tr><td>340</td><td>大吉</td><td>宜 诸事皆宜</td><td>忌 百无禁忌</td></tr>
                    <tr><td>341</td><td>末吉</td><td>宜 祈福 出火 冠笄</td><td>忌 暗杀</td></tr>
                    <tr><td>342</td><td>小吉</td><td>宜 嫁娶 求医</td><td>忌 上梁</td></tr>
                    <tr><td>343</td><td>凶</td><td>宜 求医</td><td>忌 栽种 安床 扫洒 围猎</td></tr>
                    <tr><td>344</td><td>半凶</td><td>宜 盖屋</td><td>忌 裁衣 祈福 分居</td></tr>
                    <tr><td>345</td><td>小吉</td><td>宜 结拜</td><td>忌 修造</td></tr>
                    <tr><td>346</td><td>凶</td><td>宜 开柱眼</td><td>忌 酝酿 栽种 造库 畋猎</td></tr>
                    <tr><td>347</td><td>半吉</td><td>宜 盖屋</td><td>忌 裁衣 祈福 分居</td></tr>
                    <tr><td>348</td><td>大凶</td><td>宜 无</td><td>忌 诸事不宜</td></tr>
                    <tr><td>349</td><td>小凶</td><td>宜 缉盗</td><td>忌 冠笄 上梁</td></tr>
                    <tr><td>350</td><td>半凶</td><td>宜 修造</td><td>忌 祭祀 祈福 合帐</td></tr>
                    <tr><td>351</td><td>半凶</td><td>宜 求医</td><td>忌 祭祀 纳采 进人口</td></tr>
                    <tr><td>352</td><td>小吉</td><td>宜 沐浴 安门</td><td>忌 起基</td></tr>
                    <tr><td>353</td><td>凶</td><td>宜 盖屋</td><td>忌 移徙 挂匾 围猎 塞穴</td></tr>
                    <tr><td>354</td><td>凶</td><td>宜 竖柱</td><td>忌 酝酿 栽种 围猎 见闻</td></tr>
                    <tr><td>355</td><td>大吉</td><td>宜 诸事皆宜</td><td>忌 百无禁忌</td></tr>
                    <tr><td>356</td><td>末凶</td><td>宜 合帐 开柱眼</td><td>忌 求医</td></tr>
                    <tr><td>357</td><td>大吉</td><td>宜 诸事皆宜</td><td>忌 百无禁忌</td></tr>
                    <tr><td>358</td><td>小吉</td><td>宜 合帐 开柱眼</td><td>忌 求医</td></tr>
                    <tr><td>359</td><td>末凶</td><td>宜 缉盗</td><td>忌 冠笄 上梁</td></tr>
                    <tr><td>360</td><td>大凶</td><td>宜 无</td><td>忌 诸事不宜</td></tr>
                    </tbody>
                  </Table>
                </div>
              </Panel>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default CalendarApp;
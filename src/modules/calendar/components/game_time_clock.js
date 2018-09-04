import React, { Component } from 'react';
import * as d3 from 'd3';

import './css/game_time_clock.css';
import {dateToShichenDetail, genDataForGameClock} from "../utils/shichen";

class GameTimeClock extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // 渲染svg
    this.initD3Clock(this.svgDOM, {});
  }

  shouldComponentUpdate() {
    return false;
  }

  initD3Clock() {
    let self = this;
    let totalWidth = 640;
    let totalHeight = 640;
    let outerMargin = 20;
    let donutWidth = 140;

    let cx = totalWidth / 2;
    let cy = totalHeight / 2;
    // let clockRadius = totalWidth / 2 - outerMargin - donutWidth;
    let clockRadius = totalWidth / 2 - outerMargin - 36;
    let donutRadius = totalWidth / 2 - outerMargin;

    let svg = d3.select(this.svgDOM)
      .attr('class', 'clock')
      .attr('width', '100%')
      .attr('viewBox', `0 0 ${totalWidth} ${totalHeight}`);

    /************** 环状图 ***************/
      // 外围环状图
    let svgPie = svg.append('g')
      .attr('transform', `translate(${cx},${cy})`);

    let data = genDataForGameClock();

    let arc = d3.arc();
      // .outerRadius(donutRadius)
      // .innerRadius(donutRadius - donutWidth);

    let labelArc = d3.arc()
      .outerRadius(donutRadius - 8)
      .innerRadius(donutRadius - 24);

    let pieLayout = d3.pie()
      .sort(null)
      .value((d) => d.value)
      .startAngle(data.startAngle / 2);

    let pie = svgPie.selectAll('.arc')
      .data(pieLayout(data.data))
      .enter().append('g')
      .attr('class', 'arc');

    // 环状填充
    pie.append('path')
      // .attr('d', arc)
      .attr('d', (d) => {
        let level = d.data.shichenId < 6 ? 0 : 1;
        return arc
          .innerRadius(donutRadius - donutWidth * (level + 1) / 2)
          .outerRadius(donutRadius - donutWidth * level / 2)
          .startAngle(d.startAngle * 2)
          .endAngle(d.endAngle * 2)
          (d);
      })
      .style('fill', (d) => d.data.color);

    // 标签
    pie.append('text')
      .attr('class', 'pie-label')
      .attr('dy', '7')
      .attr('transform', (d) => {
        let level = d.data.shichenId < 6 ? 0 : 1;
        let newArc = labelArc
          .innerRadius(donutRadius - level * donutWidth + (level % 2 ? 1 : -1) * 24)
          .outerRadius(donutRadius - level * donutWidth + (level % 2 ? 1 : -1) * 8)
          .startAngle(d.startAngle * 2)
          .endAngle(d.endAngle * 2);
        return `translate(${newArc.centroid(d)})`;
      })
      .text((d) => d.data.shortName);

    /************** 钟表 ***************/
    // 表盘
    makeClockFace();

    // 三种指针，顺序时分秒
    let handGroup = svg.append('g');
    let hands = handGroup
      .attr('transform', `translate(${cx}, ${cy})`)
      .selectAll('line.hand')
      .data(getTimeOfDay());
    hands.enter()
      .append('line')
      .attr('class',  (d) => d[0] + ' hand')
      // .attr('x1', cx)
      .attr('x1', 0)
      .attr('y1', (d) => handBackLength(d))    // 延长指针尾部一部分
      .attr('x2', 0)
      .attr('y2', (d) => - handLength(d))
      .attr('transform', rotationTransform);

    // 每秒更新指针位置
    setInterval(updateHands, 1000);

    function makeClockFace() {
      let hourTickLength = Math.round(clockRadius * 0.2);
      let minuteTickLength = Math.round(clockRadius * 0.075);
      for (let i = 0; i < 60; i++) {
        let tickLength, tickClass;
        if (i % 5) {
          tickLength = minuteTickLength;
          tickClass = 'minute-tick';
        }
        else {
          tickLength = hourTickLength;
          tickClass = 'hour-tick';
        }
        // 表线
        svg.append('line')
          .attr('class', tickClass + ' face')
          .attr('x1', cx)
          .attr('y1', cx - clockRadius)
          .attr('x2', cx)
          .attr('y2', cx - clockRadius + tickLength)
          .attr('transform', `rotate(${i * 6}, ${cx}, ${cy})`);
        // 表面数字
        if(i % 5 === 0) {
          svg.append('g')
            .attr('transform', `rotate(${i * 6}, ${cx}, ${cy})`)
            .append('text')
            .attr('class', 'clock-digit')
            .attr('x', cx)
            .attr('y', cx - clockRadius + tickLength + 12)
            .text(i / 5 === 0 ? 12 : i / 5)
            .attr('transform', `rotate(${-i * 6},${cx},${cx - clockRadius + tickLength + 12})`);
        }
      }
      // 表圈
      svg.append('circle')
        .attr('cx', cx)
        .attr('cy', cy)
        .attr('r', clockRadius)
        .attr('stroke', '#fff')
        .attr('fill', 'transparent')
        .attr('stroke-width', '1');
    }

    // 从现实时间到天刀时间做映射，日期无意义，主要是时分秒
    function getTimeOfDay() {
      // let now = dateToShichenDetail(new Date());
      let now = dateToShichenDetail(self.props.getBeijingDate());
      let hr = now.getHours();
      let min = now.getMinutes();
      let sec = now.getSeconds();

      let data = [
        [ 'hour',   hr + (min / 60) + (sec / 3600) ],
        [ 'minute', min + (sec / 60) ]
      ];
      if(self.props.showSecondHand) {
        data.push([ 'second', sec ]);
      }
      return data;
    }

    function handLength(d) {
      if (d[0] === 'hour')
        return Math.round(0.45 * clockRadius);
      else
        return Math.round(0.90 * clockRadius)
    }

    function handBackLength(d) {
      if (d[0] === 'second')
        return Math.round(0.25 * clockRadius);
      else
        return Math.round(0.10 * clockRadius)
    }

    function rotationTransform(d) {
      let angle;
      if (d[0] === 'hour')
        angle = (d[1] % 12) * 30;
      else
        angle = d[1] * 6;
      return 'rotate(' + angle + ')'
    }

    function updateHands() {
      let hands = handGroup.selectAll('line.hand').data(getTimeOfDay());
      hands.enter()
        .append('line')
        .attr('class',  (d) => d[0] + ' hand')
        .attr('x1', 0)
        .attr('y1', (d) => handBackLength(d))    // 延长指针尾部一部分
        .attr('x2', 0)
        .attr('y2', (d) => - handLength(d))
        .attr('transform', rotationTransform);
      hands.exit().remove();
      if(self.props.useTransition) {
        hands
        .transition()
        .ease(d3.easeLinear)
        .duration(1000)
          .attr('transform', rotationTransform)
      } else {
        hands.attr('transform', rotationTransform)
      }
    }
  }

  render() {
    return(
      <div>
        <svg
          ref={(svg) => this.svgDOM = svg}
          preserveAspectRatio='xMidYMid meet'
          viewBox='0 0 640 640'
        />
      </div>
    );
  }
}

export default GameTimeClock;
import React, { Component } from 'react';
import * as d3 from "d3";
import debounce from 'lodash/debounce';

import { jixiong, jixiongToColor } from '../utils/jixiong';

import './css/timeline.css';
import Measure from "react-measure";
import moment from "moment";
import {genShichenData, getShichenName, shichenToColor} from "../utils/shichen";


class Timeline extends Component {
  constructor(props) {
    super(props);

    this.state = {
      chartWidth: 0
    };
    this.debounceResize = debounce(() => {
      this.resizeD3();
    }, 100);
  }
  componentDidMount() {
    // 渲染svg
    this.initD3Chart(this.svgDOM, {});
  }

  // componentWillReceiveProps(nextProps) {
  //
  // }

  shouldComponentUpdate(nextProps, nextState) {
    // 判断宽度变化，更新d3图像
    if(nextState.chartWidth !== this.state.chartWidth) {
      this.debounceResize();
    }
    return false;
  }



  // 生成每日时间段数据
  genDailyData(startDate, endDate) {
    const twoHours = 1000 * 60 * 60 * 2;
    const fourHours = 1000 * 60 * 60 * 4;

    startDate = new Date(startDate.getTime() - twoHours - startDate.getTime() % fourHours);
    endDate = new Date(endDate.getTime() - twoHours - endDate.getTime() % fourHours + fourHours);

    let data = [];
    for(let i = new Date(startDate); i <= endDate; i.setTime(i.getTime() + fourHours)) {
      data.push({
        start: new Date(i),
        end: new Date(i.getTime() + fourHours)
      });
    }
    return data;
  }

  // D3渲染
  initD3Chart(dom, props) {
    let self = this;
    this.svg = d3.select(dom);

    // 参数准备
    // 图像坐标
    this.margin = props.margin || {top: 20, right: 20, bottom: 40, left: 50};
    this.chartWidth = this.state.chartWidth;
    this.timelineHeight = props.timelineHeight || 60;
    this.timelineMargin = props.timelineMargin || 10;
    this.timelineCount = props.timelineCount || 2;

    this.innerWidth = this.chartWidth - this.margin.left - this.margin.right;
    this.innerHeight = (this.timelineHeight + this.timelineMargin) * this.timelineCount - this.timelineMargin;
    if(this.innerWidth < 0) this.innerWidth = 0;
    this.chartHeight = this.innerHeight + this.margin.top + this.margin.bottom;

    // 清空svg
    // this.svg.selectAll("*").remove();

    // x轴，当前日期倒退2天，当前日期前推5天
    this.x = d3.scaleTime()
      // .domain([new Date().setDate(new Date().getDate() - 1), new Date().setDate(new Date().getDate() + 2)])
      .domain([new Date().setDate(this.props.getBeijingDate().getDate() - 1), new Date().setDate(this.props.getBeijingDate().getDate() + 2)])
      .range([0, this.innerWidth]);

    // 临时使用y
    this.y = d3.scaleOrdinal()
      .domain(["吉凶", "时辰"])
      .range([this.innerHeight * 0.25, this.innerHeight * 0.75]);

    this.xAxis = d3.axisBottom()
      .scale(this.x)
      .tickSize(-this.innerHeight)
      .tickFormat(d3.timeFormat("%m-%d %H:%M"));

    this.yAxis = d3.axisLeft()
      .scale(this.y)
      .ticks(2);

    // 缩放
    this.zoom = d3.zoom()
      .scaleExtent([0.25, 40])
      // .translateExtent([this.x(new Date(1900, 0, 1)), 0], [this.x(new Date(2030, 12, 31)), 0])
      .on("zoom", zoomed);

    // 主要画布
    this.gMain = this.svg
      .attr("width", this.innerWidth + this.margin.left + this.margin.right)
      .attr("height", this.innerHeight + this.margin.top + this.margin.bottom)
      .append("g")
      .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")")
      .call(this.zoom);

    // 图像背景
    this.background = this.gMain.append("rect")
      .attr("class", "background")
      .attr("width", this.innerWidth)
      .attr("height", this.innerHeight)
      .on('mousemove', () => {
        d3.select("#tooltip").style('display', 'none');
      });

    // clipPath
    this.clipPath = this.gMain.append("clipPath")
      .attr("id", "timeline-clip")
      .append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", this.innerWidth)
      .attr("height", this.innerHeight);

    // x轴元素
    this.gX = this.gMain.append("g")
      .attr("class", "x axis")
      .attr("transform", `translate(0,${this.innerHeight})`)
      .call(this.xAxis);

    this.gX.selectAll('.x .tick text')
      .call(this.reformatAxisLabel);

    // y轴元素
    this.gY = this.gMain.append("g")
      .attr("class", "y axis")
      .call(this.yAxis);

    // 缩放过小隐藏提示
    this.tooSmallHint = this.gMain.append('text')
      .text('放大以查看详细数据')
      .attr('class','too-small-hint')
      .attr('x', this.chartWidth / 2)
      .attr('y', this.timelineHeight * 1.5 + this.timelineMargin);

    // 吉凶轴
    this.jixiongGroups  = this.gMain.append("g")
      .attr("class", "jixiong")
      .attr('transform', `translate(0,0)`)
      .attr("clip-path", "url(#timeline-clip)");
    // 时辰轴
    this.shichenGroups  = this.gMain.append("g")
      .attr("class", "shichen")
      .attr('transform', `translate(0,${this.timelineHeight + this.timelineMargin})`)
      .attr("clip-path", "url(#timeline-clip)");

    // 当前现实时间线
    this.currentTimeline = this.gMain.append('g')
      .attr('transform', `translate(${this.x(this.props.getBeijingDate())},0)`);
    this.currentTimeline.append('line')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', 0)
      .attr('y2', this.chartHeight - 35)
      .attr('stroke', 'steelblue')
      .attr('stroke-width', '2');
    this.currentTimeline.append('text')
      .text('当前时间')
      .attr('x', 0)
      .attr('class', 'current-time-text')
      .attr('y', this.chartHeight - 25);
    // 当前指示时间线
    // todo

    // 更新数据
    // 吉凶轴
    let jixiongData = self.genDailyData(this.xAxis.scale().domain()[0], this.xAxis.scale().domain()[1]);
    this.updateJixiongD3(jixiongData);
    // 时辰轴
    let shichenData = genShichenData(this.xAxis.scale().domain()[0], this.xAxis.scale().domain()[1]);
    this.updateShichenD3(shichenData);

    function zoomed() {
      let t = d3.event.transform;
      let newX = t.rescaleX(self.x);
      // 更新坐标轴显示
      self.gX.call(self.xAxis.scale(newX));
      // 更新数据
      let jixiongData = self.genDailyData(self.xAxis.scale().domain()[0], self.xAxis.scale().domain()[1]);
      self.updateJixiongD3(jixiongData);
      let shichenData = genShichenData(self.xAxis.scale().domain()[0], self.xAxis.scale().domain()[1]);
      self.updateShichenD3(shichenData);
      // 更新x轴显示
      self.gX.selectAll('.x .tick text').call(self.reformatAxisLabel);
      // 更新时间线位置
      self.currentTimeline
        .attr('transform', `translate(${newX(self.props.getBeijingDate())},0)`);
    }
    // 1s更新一次当前时间轴
    setTimeout(() => {
      self.currentTimeline.attr('transform', `translate(${self.x(self.props.getBeijingDate())},0)`);
    }, 1000);
  }

  updateJixiongD3(data) {
    // 当无宽度时不进行更新显示
    if(!this.chartWidth)
      return;

    let self = this;
    let transform = d3.zoomTransform(this.gMain.node());
    // 使用坐标变换和xScale复合
    let transFunc  = (x) => transform.applyX(self.x(x));
    // 更新吉凶数据
    let jixiongGroupsAll = this.jixiongGroups.selectAll("g").data(data, (d) => d.start.getTime());
    // 删除吉凶数据
    jixiongGroupsAll.exit().remove();
    // 新增吉凶数据
    let jixiongGroupsEnter = jixiongGroupsAll.enter().append("g");
    jixiongGroupsEnter.append('rect')
      .attr("height", self.timelineHeight)
      .attr("fill", (d) => jixiongToColor(jixiong(d.start).jixiong));
    jixiongGroupsEnter.append('text')
      .attr('class', 'jixiong-label')
      .attr('y', self.timelineHeight / 2)
      .attr('fill', 'black');
    // merge后一起更新数据
    jixiongGroupsEnter = jixiongGroupsEnter.merge(jixiongGroupsAll);
    jixiongGroupsEnter.selectAll('rect')
      .attr("x", (d) => transFunc(d.start))
      .attr("y", 0)
      .attr("width", (d) => transFunc(d.end) - transFunc(d.start));
    jixiongGroupsEnter.selectAll('text')
      .text((d) => {
      if(transFunc(d.end) - transFunc(d.start) > 30)
        return jixiong(d.start).jixiong;
      else
        return '';
    })
      .attr('x', (d) => (transFunc(d.start) + transFunc(d.end)) / 2);
    // 更新tooltip
    jixiongGroupsEnter
      .on("mouseover", (d) => {
        let xPos = (transFunc(d.start) + transFunc(d.end)) / 2 + self.margin.left;
        let yPos = self.chartHeight - self.margin.top + 14;
        let jixiongHint = jixiong(d.start);
        d3.select("#tooltip")
          .style("left", xPos + "px")
          .style('bottom', yPos + "px")
          .html(
            `
              <p style='text-align: center'>${jixiongHint.jixiong}</p>
              <hr />
              <p>${jixiongHint.yi}</p>
              <p>${jixiongHint.ji}</p>
              <hr />
              <p>${moment(d.start).format('MM-DD HH:mm')}至${moment(d.end).format('MM-DD HH:mm')}</p>
            `
          );
        d3.select("#tooltip").style('display', 'block');
      })
      .on("mouseout", () => {
        d3.select("#tooltip").style('display', 'none');
      });
  }

  updateShichenD3(data) {
    // 当无宽度时不进行更新显示
    if(!this.chartWidth)
      return;
    let self = this;
    let transform = d3.zoomTransform(this.gMain.node());
    // 当缩放过小时，不显示
    if(transform.k < 0.75) {
      data = [];
      this.tooSmallHint.style('visibility', 'visible');
    } else {
      this.tooSmallHint.style('visibility', 'hidden');

    }

    // 使用坐标变换和xScale复合
    let transFunc  = (x) => transform.applyX(self.x(x));
    // 更新时辰数据
    let shichenGroupsAll = this.shichenGroups.selectAll("g").data(data, (d) => d.start.getTime());
    // 删除时辰数据
    shichenGroupsAll.exit().remove();
    // 新增时辰数据
    let shichenGroupsEnter = shichenGroupsAll.enter().append("g");
    shichenGroupsEnter.append('rect')
      .attr("height", self.timelineHeight)
      .attr("fill", (d) => shichenToColor(d.shichenId));
    shichenGroupsEnter.append('text')
      .attr('class', 'shichen-label')
      .attr('y', self.timelineHeight / 2);
    // merge后一起更新数据
    shichenGroupsEnter = shichenGroupsEnter.merge(shichenGroupsAll);
    shichenGroupsEnter.selectAll('rect')
      .attr("x", (d) => transFunc(d.start))
      .attr("y", 0)
      .attr("width", (d) => transFunc(d.end) - transFunc(d.start));
    shichenGroupsEnter.selectAll('text')
      .text((d) => {
        if(transFunc(d.end) - transFunc(d.start) > 15)
          return getShichenName(d.shichenId);
        else
          return '';
      })
      .attr('x', (d) => (transFunc(d.start) + transFunc(d.end)) / 2);
    // 更新tooltip
    shichenGroupsEnter
      .on("mouseover", function(d) {
        let xPos = (transFunc(d.start) + transFunc(d.end)) / 2 + self.margin.left;
        let yPos = self.chartHeight - self.margin.top - self.timelineHeight - self.timelineMargin + 14;
        let totalSeconds = (d.end - d.start) / 1000 + 1;
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = totalSeconds % 60;
        d3.select("#tooltip")
          .style("left", xPos + "px")
          .style('bottom', yPos + "px")
          .html(
            `
              <p style='text-align: center'>${getShichenName(d.shichenId)}</p>
              <hr />
              <p>${moment(d.start).format('MM-DD HH:mm:ss')}至${moment(d.end).format('MM-DD HH:mm:ss')}</p>
              <p style='text-align: center'>全长${minutes}分${seconds}秒</p>

            `
          );
        d3.select("#tooltip").style('display', 'block');
      })
      .on("mouseout", function() {
        d3.select("#tooltip").style('display', 'none');
      });
  }

  resizeD3() {
    // 获取新总宽度
    this.chartWidth = this.state.chartWidth;
    // 计算内部画布大小
    this.innerWidth = this.chartWidth - this.margin.left - this.margin.right;
    this.svg.attr("width", this.chartWidth);
    this.background.attr('width', this.innerWidth);
    this.clipPath.attr('width', this.innerWidth);
    // 更新x轴大小
    this.x.range([0, this.innerWidth]);
    this.xAxis.scale(this.x);
    this.gX.call(this.xAxis);
    // 更新x轴显示
    this.gX.selectAll('.x .tick text').call(this.reformatAxisLabel);

    // 更新缩放提示信息
    this.tooSmallHint.attr('x', this.chartWidth / 2);
    // 获取新坐标极值，更新timeline显示
    let jixiongData = this.genDailyData(this.xAxis.scale().domain()[0], this.xAxis.scale().domain()[1]);
    this.updateJixiongD3(jixiongData);
    let shichenData = genShichenData(this.xAxis.scale().domain()[0], this.xAxis.scale().domain()[1]);
    this.updateShichenD3(shichenData);
    // 更新x轴显示
    this.gX.selectAll('.x .tick text').call(this.reformatAxisLabel);
    // 更新当前时间线位置
    this.currentTimeline
      .attr('transform', `translate(${this.x(this.props.getBeijingDate())},0)`);
  }

  reformatAxisLabel(t) {
    t.each(function (d) {
      let self = d3.select(this);
      if(!self.text().includes(' '))
        return;
      let s = self.text().split(' ');
      self.text('');
      self.append("tspan")
        .attr("x", 0)
        .attr("dy", "1em")
        .text(s[0]);
      self.append("tspan")
        .attr("x", 0)
        .attr("dy", "1em")
        .text(s[1]);
    });
  }

  render() {
    return (
      <div>
        <Measure
          bounds
          onResize={(contentRect) => {
            this.setState({
              chartWidth: contentRect.bounds.width
            });
            // console.log('缩放', contentRect.bounds.width);
          }}
        >
          {({ measureRef }) =>
            <div ref={measureRef}>
              <div style={{ position: 'relative' }}>
                <div id='tooltip' styleName='timeline-tooltip' />
                <svg ref={(svg) => this.svgDOM = svg} />
              </div>
            </div>
          }
        </Measure>
      </div>
    );
  }
}

export default Timeline;
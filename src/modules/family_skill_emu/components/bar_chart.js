import React, {Component} from 'react';
import range from 'lodash/range';
import propTypes from 'prop-types';
import Chart from 'chart.js';
class BarChart extends Component {
  constructor(props) {
    super(props);


  }

  componentDidMount() {
    let data = this.props.data;
    let hlRange = this.props.hightlightRange;
    let format = this.props.format;
    let log = this.props.log;
    let bgColors = range(data.length).map((i) => {
      if(i < hlRange[0] || i > hlRange[1]) {
        return 'rgba(255, 99, 132, 0.2)';
      } else {
        return this.props.color;
      }
    });
    this.chart = new Chart(this.ChartDOM, {
      type: 'bar',
      data: {
        labels: range(data.length),
        datasets: [{
          label: this.props.unit,
          data: data,
          borderWidth: 0,
          backgroundColor: bgColors,
        }]
      },
      options: {
        tooltips: {
          callbacks: {
            label: function(tooltipItem, data) {
              return format(tooltipItem.yLabel);
            }
          }
        },
        scales: {
          xAxes: [{
            barPercentage: 1,
            categorySpacing: 0
          }],
          yAxes: [{
            type: log ? 'logarithmic' : 'linear'
          }]
        },
        legend: {
          display: false
        }

      }
    });
  }

  componentWillReceiveProps(newProps) {
    // 数据更新
    if(this.props.data !== newProps.data || this.props.hightlightRange !== newProps.hightlightRange) {
      let data = newProps.data;
      let hlRange = newProps.hightlightRange;
      let bgColors = range(data.length).map((i) => {
        if(i <= hlRange[0] || i > hlRange[1])
          return 'rgba(255, 99, 132, 0.4)';
        else
          return this.props.color;
      });
      this.chart.data = {
        labels: range(data.length),
        datasets: [{
          label: newProps.unit,
          data: data,
          borderWidth: 0,
          backgroundColor: bgColors
        }]
      };
      this.chart.update();
    }
    // 更新log轴
    if(this.props.log !== newProps.log) {
      this.chart.options.scales.yAxes[0].type = newProps.log ? 'logarithmic' : 'linear';
      this.chart.update();
    }
  }

  render() {
    let self = this;
    return(
      <div>
        123
        <canvas width={100} height={30} ref={(d) => self.ChartDOM = d} />
      </div>
    );
  }
}

export default BarChart;
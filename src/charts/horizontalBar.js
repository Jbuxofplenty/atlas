import config from './config';
const colors = config.chartColors;

export const horizontalBarOptions = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  grid: {
    top: 80,
    bottom: 30
  },
  xAxis: {
    type: 'value',
    position: 'top',
    name: '',
    nameGap: 35,
    nameLocation: 'middle',
    nameTextStyle: {
      color: '#fff'
    },
    axisLabel: {
      color: colors.textColor,
    },
    splitLine: {
      lineStyle: {
        type: 'dashed'
      }
    }
  },
  yAxis: {
    type: 'category',
    axisLine: {show: false},
    axisLabel: {show: false},
    axisTick: {show: false},
    splitLine: {show: false},
    data: []
  },
  series: [{
    type: 'bar',
    label: {
      show: true,
      formatter: '{b}'
    },
      data: []
  }]
}

export const defaultBarDatum = {
  value: null, 
  itemStyle: {
    color: ''
  },
  label: {
    position: '',
    color: '#000'
  }
}
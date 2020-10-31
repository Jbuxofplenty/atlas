import config from './config';
const colors = config.chartColors;

export const riverOptions = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'line',
      lineStyle: {
        color: 'rgba(0,0,0,0.2)',
        width: 1,
        type: 'solid'
      }
    }
  },
  dataZoom: [
    {
      type: 'inside',
      start: 0,
      end: 100
    },
  ],
  legend: {
    data: [],
    textStyle: {
      color: colors.textColor
    }
  },
  color: [],
  singleAxis: {
    top: 50,
    bottom: 50,
    axisTick: {},
    axisLabel: {
      color: colors.textColor,
    },
    type: 'time',
    axisPointer: {
      animation: true,
      label: {
        show: true,
        color: colors.dark
      }
    },
    splitLine: {
      show: true,
      lineStyle: {
        color: [colors.gridLineColor],
        type: 'dashed',
        opacity: 0.2
      }
    },
    axisLine: {
      lineStyle: {
        color: colors.textColor
      }
    },
    name: 'adsfasdf',
    nameGap: 35,
    nameLocation: 'middle',
    nameRotation: 90,
    nameTextStyle: {
      color: '#fff'
    },
  },

  series: [
    {
      type: 'themeRiver',
      itemStyle: {
        emphasis: {
          shadowBlur: 20,
          shadowColor: 'rgba(0, 0, 0, 0.8)'
        }
      },
      label: {
        show: false
      },
      data: []
    }
  ]
}
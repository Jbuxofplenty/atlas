import { widgetConstants } from '../constants';
import { initialState } from '../reducers/widget.reducer';
import { db, auth } from 'helpers/firebase';
import { store, asyncForEach } from 'helpers';
import { 
  candleStickOptions, 
  defaultXAxis, 
  defaultSeries, 
  riverOptions, 
  lineOptions,
  horizontalBarOptions,
  defaultBarDatum,
  accountsPieOptions,
} from 'charts';
import { dataActions } from './';

export const widgetActions = {
  addWidget,
  deleteWidget,
  saveFirebaseWidgets,
  resetWidgets,
  updateWidgets,
  updateWidget,
  getFirebaseWidgets,
  getOpenSlot,
  getAllFirebaseWidgets,
  saveAllFirebaseWidgets,
  updateChartWidget,
};

function addWidget(key, widget, view) {
  return { type: widgetConstants.ADD_WIDGET, key, widget, view };
}

function updateWidget(key, widget, view) {
  return { type: widgetConstants.UPDATE_WIDGET, key, widget, view };
}

function updateWidgets(widgets, view) {
  return { type: widgetConstants.UPDATE_WIDGETS, widgets, view };
}

function deleteWidget(key, view) {
  return { type: widgetConstants.DELETE_WIDGET, key, view };
}

async function updateChartWidget(key, widget, view) {
  if(widget.widgetType === 'candleStick') updateCandleStick(key, widget, view);
  if(widget.widgetType === 'river') updateRiver(key, widget, view);
  if(widget.widgetType === 'horizontalBar') updateHorizontalBar(key, widget, view);
  if(widget.widgetType === 'line') updateLine(key, widget, view);
  if(widget.widgetType === 'accountsPie') updateAccountsPie(key, widget, view);
}

async function updateAccountsPie(key, widget, view) {
  var accounts = await dataActions.getFinancialData("accounts");
  let legendData = [];
  let accountData = [];
  let walletData = [];
  Object.keys(accounts).forEach(accountKey => {
    var account = accounts[accountKey];
    var finnhubTickerBalanceMap = account.finnhubTickerBalanceMap;
    var totalBalance = 0;
    legendData.push(accountKey);
    Object.keys(finnhubTickerBalanceMap).forEach(walletKey => {
      var amount = finnhubTickerBalanceMap[walletKey].amount;
      var color = finnhubTickerBalanceMap[walletKey].color;
      var name = finnhubTickerBalanceMap[walletKey].name + ' (' + accountKey + ')';
      totalBalance += amount;
      walletData.push({value: amount, name, itemStyle: { color }});
      legendData.push(name);
    })
    accountData.push({value: totalBalance, name: accountKey, itemStyle: { color: account.color }});
  })
  var chartOptions = JSON.parse(JSON.stringify(accountsPieOptions));
  chartOptions.legend.data = legendData;
  chartOptions.series[0].data = accountData;
  chartOptions.series[1].data = walletData;
  widget.chartOptions = chartOptions;
  store.dispatch(updateWidget(key, widget, view));
}

async function updateLine(key, widget, view) {
  var timeScale = widget.timeScale;
  var tickers = widget.tickers;
  var yType = widget.yType;
  var units = widget.units;
  var stockData = await candleStickStockData(tickers, timeScale, yType);
  var chartOptions = JSON.parse(JSON.stringify(lineOptions));
  var balanceMap = {};
  if(units === 'AccountsBalance') {
    var accounts = await dataActions.getFinancialData("accounts");
    Object.keys(accounts).forEach(accountKey => {
      var account = accounts[accountKey];
      var finnhubTickerBalanceMap = account.finnhubTickerBalanceMap;
      balanceMap = {
        ...balanceMap,
        ...finnhubTickerBalanceMap,
      }
    })
  }
  if(stockData.length > 0 && stockData[0]) {
    var timeStamps = [];
    stockData[0].t.forEach(timeStamp => {
      timeStamps.push(new Date(timeStamp*1000).toLocaleString('en-US'));
    })
    chartOptions.xAxis.push(JSON.parse(JSON.stringify(defaultXAxis)));
    chartOptions.xAxis[0].data = timeStamps;
  }
  var totalBalances = [];
  Object.keys(tickers).forEach((tickerKey, index) => {
    var ticker = tickers[tickerKey];
    chartOptions.legend.data.push(ticker[1]);
    var data = [];
    var candleStickData = stockData[index];
    if(candleStickData) {
      for(var i=0; i < candleStickData.o.length; i++) {
        if(units === 'Shares') {
          data.push(candleStickData.v[i]);
        }
        if(units === 'AccountsBalance') {
          var amount = 0;
          if(balanceMap[ticker[0]]) amount = balanceMap[ticker[0]].amount;
          data.push(candleStickData.o[i]*amount);
          if(index === 0) {
            totalBalances.push(candleStickData.o[i]*amount);
          }
          else {
            totalBalances[i] += candleStickData.o[i]*amount;
          }
        }
        else {
          data.push(candleStickData.o[i]);
        }
      }
    }
    chartOptions.series.push(JSON.parse(JSON.stringify(defaultSeries)));
    chartOptions.series[index].itemStyle.color = ticker[2];
    chartOptions.series[index].data = data;
    chartOptions.series[index].name = ticker[1];
    chartOptions.series[index].type = 'line';
  });
  if(units === 'Percent') {
    chartOptions.yAxis[0].name = "Percent Change (%)";
  }
  else if(units === 'Price' || units === 'AccountsBalance') {
    chartOptions.yAxis[0].name = "Price per Share ($)";
  }
  else {
    chartOptions.yAxis[0].name = "Volume (Shares)";
    chartOptions.yAxis[0].nameLocation = "end";
    chartOptions.yAxis[0].nameRotation = 0;
    chartOptions.yAxis[0].nameGap = 20;
  }
  if(units === 'AccountsBalance' && chartOptions.series.length) {
    chartOptions.series.push(JSON.parse(JSON.stringify(defaultSeries)));
    chartOptions.legend.data.push("Total Balance of Tickers");
    chartOptions.series[chartOptions.series.length-1].itemStyle.color = '#fff';
    chartOptions.series[chartOptions.series.length-1].data = totalBalances;
    chartOptions.series[chartOptions.series.length-1].name = "Total Balance of Tickers";
    chartOptions.series[chartOptions.series.length-1].type = 'line';
  }
  widget.chartOptions = chartOptions;
  store.dispatch(updateWidget(key, widget, view));
}

async function updateHorizontalBar(key, widget, view) {
  var timeScale = widget.timeScale;
  var tickers = widget.tickers;
  var yType = widget.yType;
  var units = widget.units;
  var stockData = await candleStickStockData(tickers, timeScale, yType);
  var chartOptions = JSON.parse(JSON.stringify(horizontalBarOptions));
  if(stockData.length > 0 && stockData[0]) {
    Object.keys(tickers).forEach(tickerKey => {
      var ticker = tickers[tickerKey];
      chartOptions.yAxis.data.push(ticker[1]);
    });
    var data = [];
    Object.keys(tickers).forEach((tickerKey, index) => {
      var horizontalBarData = stockData[index];
      if(horizontalBarData) {
        let datum = JSON.parse(JSON.stringify(defaultBarDatum));
        var lastDatumIndex = horizontalBarData.c.length - 1;
        if(units === 'Percent') {
          datum.value = horizontalBarData.c[lastDatumIndex];
        }
        else if(units === 'Price') {
          datum.value = horizontalBarData.o[0] - horizontalBarData.c[lastDatumIndex];
        }
        else {
          let summedVolume = 0;
          for(var i in horizontalBarData.v) {
            summedVolume += horizontalBarData.v[i];
          }
          datum.value = summedVolume;
        }
        datum.itemStyle.color = '#00ff80';
        if(datum.value < 0) {
          datum.itemStyle.color = '#ff8080';
        }
        data.push(datum);
      }
    });
    chartOptions.series[0].data = data;
    if(units === 'Percent') {
      chartOptions.xAxis.name = "Percent Change (%)";
    }
    else if(units === 'Price' || units === 'AccountsBalance') {
      chartOptions.xAxis.name = "Change in Price ($)";
    }
    else {
      chartOptions.xAxis.name = "Volume (Shares)";
    }
  }
  widget.chartOptions = chartOptions;
  store.dispatch(updateWidget(key, widget, view));
}

async function updateRiver(key, widget, view) {
  var timeScale = widget.timeScale;
  var tickers = widget.tickers;
  var yType = widget.yType;
  var stockData = await candleStickStockData(tickers, timeScale, yType);
  var chartOptions = JSON.parse(JSON.stringify(riverOptions));
  if(stockData.length > 0 && stockData[0]) {
    var timeStamps = [];
    stockData[0].t.forEach(timeStamp => {
      timeStamps.push(new Date(timeStamp*1000));
    })
    Object.keys(tickers).forEach(tickerKey => {
      var ticker = tickers[tickerKey];
      chartOptions.legend.data.push(ticker[1]);
      chartOptions.color.push(ticker[2]);
    });
    var data = [];
    Object.keys(tickers).forEach((tickerKey, index) => {
      var riverData = stockData[index];
      if(riverData) {
        for(var i=0; i < riverData.v.length; i++) {
          var datum = [];
          var ticker = tickers[tickerKey];
          datum.push(timeStamps[i]);
          datum.push(riverData.v[i]);
          datum.push(ticker[1]);
          data.push(datum);
        }
      }
    });
    chartOptions.series[0].data = data;
    chartOptions.series[0].type = 'themeRiver';
  }
  widget.chartOptions = chartOptions;
  store.dispatch(updateWidget(key, widget, view));
}

async function updateCandleStick(key, widget, view) {
  var timeScale = widget.timeScale;
  var tickers = widget.tickers;
  var yType = widget.yType;
  var units = widget.units;
  var stockData = await candleStickStockData(tickers, timeScale, yType);
  var chartOptions = JSON.parse(JSON.stringify(candleStickOptions));
  if(stockData.length > 0 && stockData[0]) {
    var timeStamps = [];
    stockData[0].t.forEach(timeStamp => {
      timeStamps.push(new Date(timeStamp*1000).toLocaleString('en-US'));
    })
    chartOptions.xAxis.push(JSON.parse(JSON.stringify(defaultXAxis)));
    chartOptions.xAxis[0].data = timeStamps;
  }
  Object.keys(tickers).forEach((tickerKey, index) => {
    var ticker = tickers[tickerKey];
    chartOptions.legend.data.push(ticker[1]);
    var data = [];
    var candleStickData = stockData[index];
    if(candleStickData) {
      for(var i=0; i < candleStickData.o.length; i++) {
        var datum = [];
        datum.push(candleStickData.o[i]);
        datum.push(candleStickData.c[i]);
        datum.push(candleStickData.l[i]);
        datum.push(candleStickData.h[i]);
        data.push(datum);
      }
    }
    chartOptions.series.push(JSON.parse(JSON.stringify(defaultSeries)));
    chartOptions.series[index].itemStyle.color = ticker[2];
    chartOptions.series[index].data = data;
    chartOptions.series[index].name = ticker[1];
    chartOptions.series[index].type = 'candlestick';
  });
  if(units === 'Percent') {
    chartOptions.yAxis[0].name = "Percent Change (%)";
  }
  else if(units === 'Price' || units === 'AccountsBalance') {
    chartOptions.yAxis[0].name = "Price per Share ($)";
  }
  else {
    chartOptions.yAxis[0].name = "Volume (Shares)";
  }
  widget.chartOptions = chartOptions;
  store.dispatch(updateWidget(key, widget, view));
}

async function candleStickStockData(tickers, timeScale, yType) {
  var { stockData } = store.getState().data;
  var tickersToPull = [];
  var timeScales = [];
  if(tickers) {
    Object.keys(tickers).forEach(tickerKey => {
      var ticker = tickers[tickerKey];
      if(stockData 
          && stockData[ticker[0]] 
          && stockData[ticker[0]]["candleStickPrice"] 
          && stockData[ticker[0]]["candleStickPrice"][timeScale]) {
      }
      else {
        var unique = true;
        for(var i in tickersToPull) { 
          if(tickersToPull[i][0].includes(ticker[0]) && timeScales[i] === timeScale) {
            unique = false;
            break;
          }
        }
        if(unique) {
          tickersToPull.push(ticker);
          timeScales.push(timeScale);
        }
      }
    });
    stockData = await store.dispatch(dataActions.retrieveBatchStockData(tickersToPull, 'candleStick', timeScales));
    var series = [];
    Object.keys(tickers).forEach(tickerKey => {
      var ticker = tickers[tickerKey];
      if(stockData[ticker[0]] && stockData[ticker[0]]['candleStick'+yType]) {
        series.push(stockData[ticker[0]]['candleStick'+yType][timeScale])
      }
    });
    return cleanStockData(series)
  }
  return [];
}

function cleanStockData(series) {
  if(series.length > 0 && series[0]) {
    let newSeries = [];
    var firstSharedTime = 0;
    var lastSharedTime = series[0].t[series[0].t.length-1];
    series.forEach(stock => {
      if(stock && firstSharedTime < stock.t[0]) {
        firstSharedTime = stock.t[0];
      }
      if(stock && lastSharedTime > stock.t[stock.t.length-1]) {
        lastSharedTime = stock.t[stock.t.length-1];
      }
    })
    series.forEach((stock, index) => {
      if(stock) {
        newSeries.push({
          t: [],
          c: [],
          h: [],
          l: [],
          o: [],
          v: []
        })
        for(var i in stock.t) {
          if(firstSharedTime <= stock.t[i] && lastSharedTime >= stock.t[i]) {
            newSeries[index].t.push(stock.t[i]);
            newSeries[index].c.push(stock.c[i]);
            newSeries[index].h.push(stock.h[i]);
            newSeries[index].l.push(stock.l[i]);
            newSeries[index].o.push(stock.o[i]);
            newSeries[index].v.push(stock.v[i]);
          }
        }
      }
      // FIXME: There is a bug where finnhub does not return all elements with equal time step
      // This causes series to be offset slightly.  Will fix in the future.
      // console.log(newSeries[index].t[newSeries[index].t.length-1], stock.t[stock.t.length-1])
    })
    return newSeries;
  }
  return series;
}

// Firebase
const views = ['dashboard', 'charts'];

async function saveAllFirebaseWidgets() {
  await asyncForEach(views, async view => {
    await saveFirebaseWidgets(view);
  })
}

function purgeWidgets(widgets) {
  var newWidgets = JSON.parse(JSON.stringify(widgets));
  Object.keys(newWidgets).forEach(widgetKey => {
    if(newWidgets[widgetKey].widgetType === 'candleStick'
        || newWidgets[widgetKey].widgetType === 'line') {
      newWidgets[widgetKey].chartOptions.xAxis = [];
      newWidgets[widgetKey].chartOptions.series = [];
      newWidgets[widgetKey].chartOptions.legend.data = [];
      delete newWidgets[widgetKey].chartOptions.tooltip.position;
    }
    if(newWidgets[widgetKey].widgetType === 'river') {
      newWidgets[widgetKey].chartOptions.color = [];
      newWidgets[widgetKey].chartOptions.series[0].data = [];
      newWidgets[widgetKey].chartOptions.legend.data = [];
    }
    if(newWidgets[widgetKey].widgetType === 'horizontalBar') {
      newWidgets[widgetKey].chartOptions.series[0].data = [];
      newWidgets[widgetKey].chartOptions.yAxis.data = [];
    }
    if(newWidgets[widgetKey].widgetType === 'accountsPie') {
      newWidgets[widgetKey].chartOptions.series[0].data = [];
      newWidgets[widgetKey].chartOptions.series[1].data = [];
      newWidgets[widgetKey].chartOptions.legend.data = [];
    }
  })
  return newWidgets;
}

async function saveFirebaseWidgets(view) {
  var allWidgets = store.getState().widget;
  var widgets = purgeWidgets(allWidgets[view], view);
  const user = auth.currentUser;
  if(user && widgets) {
    const uid = user.uid;
    await db.collection("users").doc(uid).update({
      [`widgets.${view}`]: widgets,
    });
  }
}

function getAllFirebaseWidgets() {
  return async dispatch => {
    views.forEach(view => {
      dispatch(getFirebaseWidgets(view));
    })
  }
}

function getFirebaseWidgets(view) {
  const user = auth.currentUser;
  if(user) {
    return async dispatch => {
      const uid = user.uid;
      var widgets = await db.collection("users").doc(uid).get().then(async function(snapshot) {
        var widgets = snapshot.data().widgets;
        if(!widgets) widgets = initialState;
        return widgets[view];
      });
      Object.keys(widgets).forEach(widgetKey => {
        var widget = widgets[widgetKey];
        if(widget.widgetType === 'candleStick'
          || widget.widgetType === 'river'
          || widget.widgetType === 'horizontalBar'
          || widget.widgetType === 'line'
          || widget.widgetType === 'accountsPie') updateChartWidget(widgetKey, widget, view)
        else dispatch(updateWidget(widgetKey, widget, view))
      })
    }
  }
}

// Utility
function getOpenSlot(w, h, view) {
  // TODO: make more efficient
  // This will work for now
  var allWidgets = store.getState().widget;
  var widgets = allWidgets[view];
  var maxY = 0;
  var maxYMaxH = 0;
  Object.keys(widgets).forEach(key => {
    var y = widgets[key].dataGrid.y;
    if(y > maxY) {
      maxY = y;
      var h = widgets[key].dataGrid.h;
      if(h > maxYMaxH) {
        maxYMaxH = h;
      }
    }
  })
  return {x: 0, y: maxY+maxYMaxH};
}

function resetWidgets() {
  return dispatch => {
    dispatch(reset());
  }
  function reset() { return { type: widgetConstants.RESET } }
}
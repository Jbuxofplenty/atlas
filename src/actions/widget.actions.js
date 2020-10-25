import { widgetConstants } from '../constants';
import { initialState } from '../reducers/widget.reducer';
import { db, auth } from 'helpers/firebase';
import { store, asyncForEach } from 'helpers';
import { candleStickOptions, defaultXAxis, defaultSeries } from 'charts';
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
  var timeScale = widget.timeScale;
  var tickers = widget.tickers;
  var yType = widget.yType;
  var stockData = await candleStickStockData(tickers, timeScale, yType);
  var chartOptions = JSON.parse(JSON.stringify(candleStickOptions));
  if(stockData.length > 0 && stockData[0]) {
    var timeStamps = [];
    stockData[0].t.forEach(timeStamp => {
      timeStamps.push(new Date(timeStamp*1000).toLocaleString('en-US'));
    })
    chartOptions.xAxis.push(defaultXAxis);
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
    if(newWidgets[widgetKey].widgetType === 'candleStick') {
      newWidgets[widgetKey].chartOptions.xAxis = [];
      newWidgets[widgetKey].chartOptions.series = [];
      newWidgets[widgetKey].chartOptions.legend.data = [];
      delete newWidgets[widgetKey].chartOptions.tooltip.position;
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
        if(widget.widgetType === 'candleStick') updateChartWidget(widgetKey, widget, view)
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
  return { type: widgetConstants.RESET };
}
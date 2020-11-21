import { simulatorConstants } from '../constants';
import { initialState, defaultSimulatorHolding } from 'reducers/simulator.reducer'
import { db, auth } from 'helpers/firebase';
import { dataActions } from 'actions';
import { 
  p,
  store,
} from 'helpers';

export const simulatorActions = {
  getSimulator,
  simulatorReset,
  saveSimulator,
  updateSimulatorSettings,
  updateSimulatorHoldings,
  updateSimulatorPortfolio,
  buySell,
  updateReturns,
};

function simulatorReset() {
  return dispatch => {
    dispatch(simulatorResetSuccess());
  }
  function simulatorResetSuccess() { return { type: simulatorConstants.SIMULATOR_RESET } }
}

/////////////////////////////
///// Simulator Actions /////
/////////////////////////////

function buySell(transaction) {
  const portfolio = JSON.parse(JSON.stringify(store.getState().simulator.portfolio));
  return async dispatch => {
    if(transaction.transactionType === 'buy') {
      portfolio.buyingPower -= transaction.total;
      portfolio.cashRemaining -= transaction.total;
      transaction.status = 'completed';
      portfolio.transactions.completed.push(transaction);
      var alreadyHolding = false;
      var holding;
      portfolio.holdings.forEach(tempHolding => {
        if(tempHolding.symbol === 'USD') {
          tempHolding.quantity -= transaction.total;
          tempHolding.value -= transaction.total;
        }
        if(tempHolding.symbol === transaction.ticker.value) {
          alreadyHolding = true;
          holding = tempHolding;
        }
      })
      if(!alreadyHolding) {
        holding = JSON.parse(JSON.stringify(defaultSimulatorHolding));
        holding.quantity = 0;
        holding.priceToShares = [];
        holding.ticker = transaction.ticker;
      }
      holding.symbol = transaction.ticker.value;
      holding.quantity += transaction.shares;
      holding.price = transaction.price;
      let priceToShares = {
        price: transaction.price,
        shares: transaction.shares,
      }
      holding.value = holding.quantity * holding.price;
      holding.priceToShares.push(priceToShares);
      if(!alreadyHolding) portfolio.holdings.push(holding);
    }
    else if(transaction.transactionType === 'sell') {
      portfolio.buyingPower += transaction.price * transaction.shares - transaction.commission;
      portfolio.cashRemaining += transaction.price * transaction.shares - transaction.commission;
      transaction.status = 'completed';
      portfolio.transactions.completed.push(transaction);
      portfolio.holdings.forEach((holding, index, object) => {
        if(holding.symbol === 'USD') {
          holding.quantity += transaction.price * transaction.shares;
          holding.value += transaction.price * transaction.shares;
        }
        if(holding.symbol === transaction.ticker.value) {
          holding.quantity -= transaction.shares;
          if(holding.quantity !== 0) {
            holding.price = transaction.price;
            let priceToShares = {
              price: transaction.price,
              shares: transaction.shares,
            }
            holding.value = holding.quantity * holding.price;
            holding.priceToShares.push(priceToShares);
          }
          else {
            object.splice(index, 1);
          }
        }
      })  
    }
    portfolio.netWorth -= transaction.commission;
    dispatch(updateSimulatorPortfolio(portfolio));
  }
}

function updateReturns() {
  return async dispatch => {
    const { settings } = store.getState().simulator;
    var portfolio = JSON.parse(JSON.stringify(store.getState().simulator.portfolio));
    var tickers = [];
    portfolio.holdings.forEach(holding => {
      if(holding.symbol !== 'USD') {
        tickers.push(holding.symbol);
      }
    })
    var yesterday = new Date();
    // Debug
    // yesterday.setMinutes(yesterday.getMinutes() - 1);
    yesterday.setDate(yesterday.getDate() - 1);
    var yesterdaysBalance = settings.startingBalance;
    var yesterdaysHoldings = [];
    var overallGainsMap = {};
    portfolio.transactions.completed.forEach(transaction => {
      var transactionDate = new Date(transaction.date);
      if(!overallGainsMap[transaction.ticker.value]) overallGainsMap[transaction.ticker.value] = {value: 0, shares: 0};
      if(transaction.transactionType === 'buy') {
        overallGainsMap[transaction.ticker.value].value -= transaction.price * transaction.shares;
        overallGainsMap[transaction.ticker.value].shares += transaction.shares;
      }
      else if(transaction.transactionType === 'sell') {
        overallGainsMap[transaction.ticker.value].value += transaction.price * transaction.shares;
        overallGainsMap[transaction.ticker.value].shares -= transaction.shares;
      }
      if (yesterday.getTime() > transactionDate.getTime()) {
        if(transaction.transactionType === 'buy') {
          yesterdaysBalance -= transaction.total;
          var alreadyHolding = false;
          var holding;
          yesterdaysHoldings.forEach(tempHolding => {
            if(tempHolding.symbol === transaction.ticker.value) {
              alreadyHolding = true;
              holding = tempHolding;
            }
          })
          if(!alreadyHolding) {
            holding = {};
            holding.shares = 0;
          }
          holding.symbol = transaction.ticker.value;
          holding.shares += transaction.shares;
          if(!alreadyHolding) yesterdaysHoldings.push(holding);
        }
        else if(transaction.transactionType === 'sell') {
          yesterdaysHoldings.forEach((holding, index, object) => {
            if(holding.symbol === transaction.ticker.value) {
              holding.shares -= transaction.shares;
            }
            if(holding.shares === 0) {
              object.splice(index, 1);
            }
          })
          yesterdaysBalance += transaction.price * transaction.shares; 
          yesterdaysBalance -= transaction.commission;
        }
      }
    })
    var yesterdaysHoldingMap = {};
    yesterdaysHoldings.forEach(holding => {
      yesterdaysHoldingMap[holding.symbol] = holding.shares;
      var unique = !tickers.includes(holding.symbol);
      if(unique) tickers.push(holding.symbol);
    })
    var symbolData = await store.dispatch(dataActions.getQuotes(tickers));
    var yesterdaysNetWorth = yesterdaysBalance;
    yesterdaysHoldings.forEach(holding => {
      yesterdaysNetWorth += symbolData[holding.symbol].quote.pc * holding.shares;
    })
    var netWorth = 0.0; 
    portfolio.holdings.forEach(holding => {
      if(holding.symbol !== 'USD') {
        netWorth += symbolData[holding.symbol].quote.c * holding.quantity;
        holding.dailyChange.value = symbolData[holding.symbol].quote.c * holding.quantity - symbolData[holding.symbol].quote.pc * holding.quantity;
        holding.dailyChange.percent = (holding.dailyChange.value) / symbolData[holding.symbol].quote.pc / holding.quantity;
        holding.overallChange.value = symbolData[holding.symbol].quote.c * holding.quantity + overallGainsMap[holding.symbol].value;
        // TODO: Figure out what I'm trying to compute
        holding.overallChange.percent = (symbolData[holding.symbol].quote.c * holding.quantity - holding.overallChange.value) / (symbolData[holding.symbol].quote.c * holding.quantity) * 100;
      }
      else {
        netWorth += holding.quantity;
      }
    })
    portfolio.todaysGains = netWorth - yesterdaysNetWorth;
    portfolio.todaysReturns = (netWorth - yesterdaysNetWorth) / yesterdaysNetWorth;
    portfolio.netWorth = netWorth;
    dispatch(updateSimulatorPortfolio(portfolio));
  }
}

function getSimulator() {
  return async dispatch => {
    var uid = auth.currentUser.uid;
    return await db.collection("users").doc(uid).get().then(async function(snapshot) {
      var simulator = snapshot.data().simulator;
      if(!simulator) {
        simulator = initialState;
      }
      dispatch(updateSimulator(simulator));
      return simulator;
    })
    .catch(error => {
      p(error)
    })
  }
}

function updateSimulator(simulator) {
  return dispatch => {
    dispatch(simulatorSuccess(simulator));
  }
  function simulatorSuccess(simulator) { return { type: simulatorConstants.UPDATE_ALL, simulator } }
}

function updateSimulatorSettings(settings) {
  const simulator = JSON.parse(JSON.stringify(store.getState().simulator));
  // Massage data
  if(settings.startingBalance !== simulator.settings.startingBalance) {
    simulator.portfolio.startingBalance = settings.startingBalance;
    let difference = settings.startingBalance - simulator.settings.startingBalance;
    simulator.portfolio.netWorth += difference;
    if(simulator.portfolio.netWorth < 0) simulator.portfolio.netWorth = 0; 
    simulator.portfolio.cashRemaining += difference;
    if(simulator.portfolio.cashRemaining < 0) simulator.portfolio.cashRemaining = 0; 
    simulator.portfolio.buyingPower += difference;
    simulator.portfolio.holdings.forEach(holding => {
      if(holding.symbol === 'USD') {
        holding.value += difference;
        if(holding.value < 0) holding.value = 0;
        holding.quantity += difference;
        if(holding.quantity < 0) holding.quantity = 0;
      }
    })
    if(simulator.portfolio.buyingPower < 0) simulator.portfolio.buyingPower = 0; 
  }
  let newSimulator = {
    ...simulator,
    settings
  }
  return async dispatch => {
    var uid = auth.currentUser.uid;
    await db.collection("users").doc(uid).update({
      "simulator" : newSimulator
    })
    .catch(error => {
      p(error)
    })
    dispatch(simulatorSuccess(newSimulator));
  }
  function simulatorSuccess(simulator) { return { type: simulatorConstants.UPDATE_ALL, simulator } }
}

function updateSimulatorHoldings(holdings) {
  const { simulator } = store.getState();
  return async dispatch => {
    var uid = auth.currentUser.uid;
    await db.collection("users").doc(uid).update({
      "simulator" : {
        ...simulator,
        portfolio: {
          ...simulator.portfolio,
          holdings
        }
      }
    })
    .catch(error => {
      p(error)
    })
    dispatch(simulatorHoldingsSuccess(holdings));
  }
  function simulatorHoldingsSuccess(holdings) { return { type: simulatorConstants.UPDATE_HOLDINGS, holdings } }
}

function updateSimulatorPortfolio(portfolio) {
  const { simulator } = store.getState();
  return async dispatch => {
    var uid = auth.currentUser.uid;
    await db.collection("users").doc(uid).update({
      "simulator" : {
        ...simulator,
        portfolio
      }
    })
    .catch(error => {
      p(error)
    })
    dispatch(simulatorPortfolioSuccess(portfolio));
  }
  function simulatorPortfolioSuccess(portfolio) { return { type: simulatorConstants.UPDATE_PORTFOLIO, portfolio } }
}

async function saveSimulator() {
  const { simulator } = store.getState();
  var uid = auth.currentUser.uid;
  await db.collection("users").doc(uid).update({
    "simulator" : simulator
  })
  .catch(error => {
    p(error)
  })
}








/////////////////////////////
////////// Archive //////////
/////////////////////////////


// function updateReturns() {
  
//   var { stockData } = store.getState().data;
//   var tickersToPull = [];
//   var timeScales = [];
//   portfolio.holdings.forEach(holding => {
//     if(holding.symbol !== 'USD') {
//       var staleOrNoData = true;
//       if(stockData 
//           && stockData[holding.symbol] 
//           && stockData[holding.symbol]["candleStickPrice"] 
//           && stockData[holding.symbol]["candleStickPrice"]['1D']) {
//         staleOrNoData = false;
//         // Check for stale data
//         var timeArray = stockData[holding.symbol]["candleStickPrice"]['1D'].t;
//         var now = new Date();
//         var dayBefore = now.setDate(now.getDate() - 1);
//         var lastDateInTimeArray = new Date(timeArray[timeArray.length-1]*1000);
//         dayBefore = new Date(dayBefore);
//         if(lastDateInTimeArray < dayBefore) staleOrNoData = true;
//       }
//       if(staleOrNoData) {
//         var unique = true;
//         for(var j in tickersToPull) { 
//           if(tickersToPull[j][0].includes(holding.symbol) && timeScales[j] === '1D') {
//             unique = false;
//             break;
//           }
//         }
//         if(unique) {
//           var newTicker = [holding.ticker.value, holding.ticker.label, holding.ticker.color, holding.ticker.tickerType];
//           tickersToPull.push(newTicker);
//           timeScales.push('1D');
//         }
//       }
//     }
//   })
//   var yesterdayPrices = {};
//   await asyncForEach(portfolio.holdings, async holding => {
//     if(holding.symbol !== 'USD') {
//       if(stockData[holding.symbol]['candleStickPrice'] && stockData[holding.symbol]['candleStickPrice']['1D']) {
//         var lastPrice = stockData[holding.symbol]['candleStickPrice']['1D'].o[0];
//         var lastDateUTC = stockData[holding.symbol]['candleStickPrice']['1D'].t[0];
//         let lastDate = new Date(lastDateUTC);
//         var now = new Date();
//         now.setDate(now.getDate() - 1);
//         if(now.getDate() === lastDate.getDate()
//             && now.getHours() === lastDate.getHours()
//             && now.getMinutes() === lastDate.getMinutes()) {
//           yesterdayPrices[holding.symbol] = lastPrice;
//         }
//         else {
//           console.log(lastDate.getDate(), lastDate.getHours(), lastDate.getMinutes())
//         } 
//       }
//       else {

//       }
//     }
//   })
// }
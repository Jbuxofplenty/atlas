import { nyse } from './nyse';
import { nasdaq } from './nasdaq';

export const cryptoCurrencies = [
  { value: 'COINBASE:BTC-USD', label: 'Bitcoin (BTC)', color: '#00B8D9', tickerType: 'crypto' },
  { value: 'COINBASE:ETH-USD', label: 'Ethereum (ETH)', color: '#0052CC', tickerType: 'crypto' },
  { value: 'COINBASE:ALGO-USD', label: 'Algorand (ALGO)', color: '#5243AA', tickerType: 'crypto' },
  { value: 'COINBASE:XTZ-USD', label: 'Tezos (XTZ)', color: '#616802', tickerType: 'crypto' },
  { value: 'COINBASE:ATOM-USD', label: 'Atom (ATOM)', color: '#FF8B00', tickerType: 'crypto' },
  { value: 'COINBASE:NMR-USD', label: 'Numerai (NMR)', color: '#FFC400', tickerType: 'crypto' },
  { value: 'COINBASE:MKR-USD', label: 'Maker (MKR)', color: '#36B37E', tickerType: 'crypto' },
  { value: 'COINBASE:EOS-USD', label: 'EOSIO (EOS)', color: '#00875A', tickerType: 'crypto' },
  { value: 'COINBASE:XRP-USD', label: 'Ripple (XRP)', color: '#253858', tickerType: 'crypto' },
  { value: 'COINBASE:LTC-USD', label: 'Litecoin (LTC)', color: '#666666', tickerType: 'crypto' },
  { value: 'COINBASE:BCH-USD', label: 'Bitcoin Cash (BCH)', color: '#c15294', tickerType: 'crypto' },
  { value: 'COINBASE:LINK-USD', label: 'Chainlink (LINK)', color: '#f12fa9', tickerType: 'crypto' },
  { value: 'COINBASE:BAND-USD', label: 'Band (BAND)', color: '#54d311', tickerType: 'crypto' },
  { value: 'COINBASE:ZRX-USD', label: 'Ox (ZRX)', color: '#c9612b', tickerType: 'crypto' },
  { value: 'COINBASE:OXT-USD', label: 'Orchid (OXT)', color: '#ff8766', tickerType: 'crypto' },
  { value: 'COINBASE:CVC-USDC', label: 'Civic (CVC)', color: '#ea26b0', tickerType: 'crypto' },
  { value: 'COINBASE:ZEC-USDC', label: 'Zcash (ZEC)', color: '#27bef0', tickerType: 'crypto' },
  { value: 'COINBASE:REP-USD', label: 'Augur (REP)', color: '#6d951f', tickerType: 'crypto' },
  { value: 'COINBASE:OMG-USD', label: 'OMG Network (OMG)', color: '#e92dcd', tickerType: 'crypto' },
  { value: 'COINBASE:UNI-USD', label: 'Uniswap (UNI)', color: '#df7e40', tickerType: 'crypto' },
  { value: 'BITFINEX:BSVUSD', label: 'Bitcoin SV (BSV)', color: '#2E6802', tickerType: 'crypto' },
];

export const indices = [
  { value: '^GSPC', label: 'S&P500 (GSPC)', color: '#88364d', tickerType: 'index' },
  { value: '^DJI', label: 'Dow Jones (DJI)', color: '#fc7a6e', tickerType: 'index' },
  { value: '^NDX', label: 'Nasdaq 100 (NDX)', color: '#4d14c1', tickerType: 'index' },
];

export { dji } from './dji';
export { gspc } from './gspc';
export { ndx } from './ndx';
export { 
  nasdaq,
  nyse
};

export const usStocks = nasdaq.concat(nyse);
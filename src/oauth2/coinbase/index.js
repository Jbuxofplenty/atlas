import coinbaseOAuthDance from './oAuthDance';
import coinbaseAPI from './api';
const coinbaseOAuthObject = {
  ...coinbaseOAuthDance,
  ...coinbaseAPI,
};
export {
  coinbaseOAuthObject
}
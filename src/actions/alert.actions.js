import { alertConstants } from '../constants';

export const alertActions = {
  success,
  error,
  visible,
  clear,
  pending,
  component,
  progressSuccess,
};

function success(message) {
  return { type: alertConstants.SUCCESS, message };
}

function progressSuccess(message) {
  return { type: alertConstants.PROGRESS_SUCCESS, message };
}

function pending(show) {
  return { type: alertConstants.PENDING, show };
}

function component(component) {
  return { type: alertConstants.COMPONENT, component };
}

function error(message) {
  return { type: alertConstants.ERROR, message };
}

function visible(show) {
  return { type: alertConstants.VISIBLE, show };
}

function clear() {
  return { type: alertConstants.CLEAR };
}

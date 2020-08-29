import { alertConstants } from '../constants';

export const alertActions = {
    success,
    error,
    visible,
    clear,
};

function success(message) {
    return { type: alertConstants.SUCCESS, message };
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

import { widgetConstants } from '../constants';
import { initialState } from '../reducers/widget.reducer';
import { db, auth } from 'helpers/firebase';
import { store } from 'helpers';

export const widgetActions = {
  addWidget,
  deleteWidget,
  updateFirebaseWidgets,
  resetWidgets,
  updateWidgets,
  updateWidget,
  getFirebaseWidgets,
  getOpenSlot,
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

async function updateFirebaseWidgets(view) {
  var allWidgets = store.getState().widget;
  var widgets = allWidgets[view];
  const user = auth.currentUser;
  if(user) {
    const uid = user.uid;
    await db.collection("users").doc(uid).update({
      [`widgets.${view}`]: widgets,
    });
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
      dispatch(updateWidgets(widgets, view))
    }
  }
}

// Utility
function getOpenSlot(w, h, view) {
  // TODO: make more efficient
  // This will work for now
  // var allWidgets = store.getState().widget;
  // var widgets = allWidgets[view];
  // Object.keys(widgets).map(key => {
  // })
  return {x: 0, y: 1000};
}

function resetWidgets() {
  return { type: widgetConstants.RESET };
}
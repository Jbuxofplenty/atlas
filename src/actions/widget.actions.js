import { widgetConstants } from '../constants';
import { initialState } from '../reducers/widget.reducer';
import { db, auth } from 'helpers/firebase';
import { store, asyncForEach } from 'helpers';

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

// Firebase
const views = ['dashboard', 'charts'];

async function saveAllFirebaseWidgets() {
  await asyncForEach(views, async view => {
    await saveFirebaseWidgets(view);
  })
}

async function saveFirebaseWidgets(view) {
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
      dispatch(updateWidgets(widgets, view))
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
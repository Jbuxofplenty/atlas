import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import AuthCustomInput from "components/AuthCustomInput/AuthCustomInput.js";

import s from 'components/Widget/Widget.module.scss';
import { widgetActions } from 'actions';

 function EditableHeader(props) {
  const [title, setTitle] = useState(props.title);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    setTitle(props.widget.name);
  }, [props.widget.name]);

  const submit = (e) => {
    e.preventDefault();
    setEditing(false);
  }

  const handleChange = (e) => {
    e.stopPropagation();
    setTitle(e.target.value);
    var tempWidget = JSON.parse(JSON.stringify(props.widget));
    tempWidget.name = e.target.value;
    props.updateWidget(props.widgetId, tempWidget, props.view);
  }

  return (
    <div className="d-flex flex-row align-items-center">
      {!editing 
        ? <h5 className={s.title} id={props.id}>{title}</h5>
        : <div onSubmit={submit} style={{width: '400px'}}>
            <AuthCustomInput
                labelText=""
                value={title}
                white
                onBlur={() => setEditing(false)}
                onChange={handleChange}
                fullWidth
                inputProps={{
                  color: "secondary",
                  autoFocus: true,
                }}
              />
          </div>
      }
      <i className={`icon-pane fa fa-pencil clickable ${editing ? 'ml-2 mb-3' : 'mt-3'}`} onClick={() => setEditing(!editing)} />
    </div>
  )
}
function mapStateToProps(store) {
  return {
    stockData: store.data.stockData,
    alertType: store.alert.type,
    alertMessage: store.alert.message,
    alertVisible: store.alert.visible,
    alertComponent: store.alert.component,
  };
}

const mapDispatchToProps = (dispatch, history) => {
  return {
    updateWidget: (key, widget, view) => dispatch(widgetActions.updateWidget(key, widget, view)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditableHeader);
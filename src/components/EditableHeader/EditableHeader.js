import React, { useState } from 'react';

import AuthCustomInput from "components/AuthCustomInput/AuthCustomInput.js";

import s from 'components/Widget/Widget.module.scss';

export default function EditableHeader(props) {
  const [title, setTitle] = useState(props.title);
  const [editing, setEditing] = useState(false);
  const submit = (e) => {
    e.preventDefault();
    setEditing(false);
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
                onChange={(e) => setTitle(e.target.value)}
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
import React from 'react';
import { Button } from 'reactstrap';

import s from './CircleButton.module.scss';

export default function CircleButton(props) {
  const handleOnMouseDown = async (e) => {
    e.stopPropagation();
  }
  const handleChange = () => {
    props.handleChange(props.name);
  }
  return (
    <div className={`${s.circleContainer}`}>
      <Button 
        variant="contained" 
        color="primary" 
        className={`circle ${s.circle} ${props.selected ? s.selected : ''}`}
        onClick={handleChange}
        onMouseDown={handleOnMouseDown}
      >
        <span className={`${s.text}`}>{props.name}</span>
      </Button>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import AuthCustomInput from 'components/AuthCustomInput/AuthCustomInput';
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";

export default function InputSlider(props) {
  const [value, setValue] = useState(props.numShares);

  useEffect(() => {
    setValue(props.numShares);
    if (props.numShares < 1) {
      setValue(1);
    } else if (props.numShares > props.max) {
      setValue(props.max);
    }
    //eslint-disable-next-line
  }, [props.numShares, props.max]);

  const handleSliderChange = (event, newValue) => {
    setValue(newValue);
    props.handleShareChange(newValue);
  };

  const handleInputChange = (event) => {
    var newValue = event.target.value === '' ? '' : Number(event.target.value);
    if (newValue < 1) {
      setValue(1);
      props.handleShareChange(1);
    } else if (newValue > props.max) {
      setValue(props.max);
      props.handleShareChange(props.max);
    }
    else {
      setValue(newValue);
      props.handleShareChange(newValue);
    }
  };

  const handleBlur = () => {
    if (value < 1) {
      setValue(1);
      props.handleShareChange(1);
    } else if (value > props.max) {
      setValue(props.max);
      props.handleShareChange(props.max);
    }
  };

  const handleOnMouseDown = async (e) => {
    e.stopPropagation();
  }

  return (
    <div 
      className={'d-flex flex-column'}
      onMouseDown={handleOnMouseDown}
    >
      <Typography id="input-slider" gutterBottom>
        Number of Shares
      </Typography>
      <GridContainer justify="center" className="d-flex w-75">
        <GridItem lg={12} md={12} xs={12} className="d-flex align-items-center">
          <Slider
            value={typeof value === 'number' ? value : 1}
            onChange={handleSliderChange}
            aria-labelledby="input-slider"
            min={1}
            max={props.max}
          />
        </GridItem>
        <GridItem lg={12} md={12} xs={12} className="d-flex align-items-center">
          <AuthCustomInput
            value={value}
            margin="dense"
            onChange={handleInputChange}
            onBlur={handleBlur}
            fullWidth
            white
            inputProps={{
              step: 1,
              min: 1,
              max: props.max,
              type: 'number',
              'aria-labelledby': 'input-slider',
            }}
          />
        </GridItem>
      </GridContainer>
    </div>
  );
}
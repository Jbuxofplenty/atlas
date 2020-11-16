import React from 'react';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import { withStyles } from "@material-ui/core/styles";

const StyledToggleButton = withStyles({
  root: {
    borderColor: '#363636',
    backgroundColor: 'transparent !important'
  },
  selected: {
    backgroundColor: '#363636 !important',
  },
})(ToggleButton);

export default function TimeScaleToggle(props) {
  const [alignment, setAlignment] = React.useState(props.timeScales);

  const handleAlignment = (event, newAlignment) => {
    setAlignment(newAlignment);
    props.handleTimeScaleToggle(newAlignment);
  };

  const handleOnMouseDown = async (e) => {
    e.stopPropagation();
  }

  return (
    <ToggleButtonGroup
      value={alignment}
      onChange={handleAlignment}
      aria-label="text alignment"
      onMouseDown={handleOnMouseDown}
      size="small"
    >
      <StyledToggleButton value="Annual" aria-label="left aligned">
        <div className="d-flex">
          <div>Annual</div>
        </div>
      </StyledToggleButton>
      <StyledToggleButton value="TTM" aria-label="centered">
        <div className="d-flex">
          <div>TTM</div>
        </div>
      </StyledToggleButton>
      <StyledToggleButton value="Rfy" aria-label="centered">
        <div className="d-flex">
          <div>Fiscal Year</div>
        </div>
      </StyledToggleButton>
      <StyledToggleButton value="5y" aria-label="centered">
        <div className="d-flex">
          <div>5 Year</div>
        </div>
      </StyledToggleButton>
    </ToggleButtonGroup>
  );
}
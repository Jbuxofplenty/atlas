import React, { useState, useEffect } from 'react';
import CallMadeIcon from '@material-ui/icons/CallMade';
import CallReceivedIcon from '@material-ui/icons/CallReceived';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import { withStyles } from "@material-ui/core/styles";

const StyledToggleButton = withStyles({
  root: {
    borderColor: 'white',
    backgroundColor: 'transparent !important'
  },
  selected: {
    backgroundColor: '#363636 !important',
  },
})(ToggleButton);

export default function ToggleButtons(props) {
  const [alignment, setAlignment] = useState(props.transactionType);

  useEffect(() => {
    setAlignment(props.transactionType);
    //eslint-disable-next-line
  }, [props.transactionType]);

  const handleAlignment = (event, newAlignment) => {
    if(newAlignment != null) {
      setAlignment(newAlignment);
      props.handleBuySell(newAlignment);
    }
  };

  const handleOnMouseDown = async (e) => {
    e.stopPropagation();
  }

  return (
    <ToggleButtonGroup
      value={alignment}
      exclusive
      onChange={handleAlignment}
      aria-label="text alignment"
      onMouseDown={handleOnMouseDown}
      size="large"
    >
      {props.toggleTypes.includes('buy') &&
        <StyledToggleButton value="buy" aria-label="left aligned">
          <div className="d-flex">
            <CallMadeIcon className="successMessage"/>
            <div className="ml-2 successMessage">Buy</div>
          </div>
        </StyledToggleButton>
      }
      {props.toggleTypes.includes('sell') &&
        <StyledToggleButton value="sell" aria-label="centered">
          <div className="d-flex">
            <CallReceivedIcon className="errorMessage"/>
            <div className="ml-2 errorMessage">Sell</div>
          </div>
        </StyledToggleButton>
      }
    </ToggleButtonGroup>
  );
}
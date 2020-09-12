import React from "react";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// nodejs library that concatenates classes
import classNames from "classnames";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import OutlinedInput from "@material-ui/core/OutlinedInput";

import styles from "assets/jss/material-kit-react/components/authCustomInputStyle.js";

const useStyles = makeStyles(styles);

export default function AuthCustomInput(props) {
  const disabled = props.disabled ? true : false;
  const classes = useStyles();
  const {
    formControlProps,
    labelText,
    id,
    labelProps,
    inputProps,
    error,
    white,
    inputRootCustomClasses,
    success,
    fullWidth
  } = props;

  const labelClasses = classNames({
    [" " + classes.labelRootError]: error,
    [" " + classes.labelRootSuccess]: success && !error
  });
  const marginTop = classNames({
    [inputRootCustomClasses]: inputRootCustomClasses !== undefined
  });
  const inputClasses = classNames({
    [classes.input]: true,
    [classes.whiteInput]: white
  });
  var formControlClasses;
  if (formControlProps !== undefined) {
    formControlClasses = classNames(
      formControlProps.className,
      classes.formControl
    );
  } else {
    formControlClasses = classes.formControl;
  }
  if(fullWidth) {
    formControlClasses = classNames(
      formControlClasses,
      'w-100'
    )
  }
  return (
    <form>
      <FormControl {...formControlProps} className={formControlClasses}>
        {labelText !== undefined ? (
          <InputLabel
            error={error}
            success={success}
            variant='outlined'
            className={classes.labelRoot + " " + labelClasses}
            htmlFor={id}
            {...labelProps}
          >
            {labelText}
          </InputLabel>
        ) : null}
        <OutlinedInput
          fullWidth={fullWidth}
          error={error}
          success={success}
          classes={{
            input: inputClasses,
            root: marginTop,
            disabled: classes.disabled
          }}
          disabled={disabled}
          value={props.value}
          inputProps={{ autoComplete: "on" }}
          onChange={props.onChange}
          id={id}
          {...inputProps}
        />
      </FormControl>
    </form>
  );
}

AuthCustomInput.propTypes = {
  labelText: PropTypes.node,
  labelProps: PropTypes.object,
  id: PropTypes.string,
  inputProps: PropTypes.object,
  formControlProps: PropTypes.object,
  inputRootCustomClasses: PropTypes.string,
  error: PropTypes.bool,
  success: PropTypes.bool,
  white: PropTypes.bool
};

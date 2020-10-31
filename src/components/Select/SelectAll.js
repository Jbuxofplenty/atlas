import React from "react";
import PropTypes from "prop-types";
import { default as ReactSelect } from "react-select";

// specify props.allowSelectAll = true to enable!
const Select = props => {

  const handleOnMouseDown = async (e) => {
    e.stopPropagation();
  }

  if (props.allowSelectAll) {
    if (props.value && props.options) {
      if (props.value.length >= props.options.length) {
        return (
          <ReactSelect
            {...props}
            value={[props.allOption]}
            onChange={selected => {
              if(selected) {
                props.onChange(selected.slice(1))
              }
              else {
                props.onChange([])
              }
            }}
          />
        );
      }
    }

    return (
      <ReactSelect
        {...props}
        innerProps={{
          onMouseDown: handleOnMouseDown
        }}
        onMouseDown={handleOnMouseDown}
        options={[props.allOption, ...props.options]}
        onChange={selected => {
          if (
            selected &&
            selected.length > 0 &&
            selected[selected.length - 1].value === props.allOption.value
          ) {
            return props.onChange(props.options);
          }
          return props.onChange(selected);
        }}
      />
    );
  }

  return <ReactSelect {...props} />;
};

Select.propTypes = {
  options: PropTypes.array,
  value: PropTypes.any,
  onChange: PropTypes.func,
  allowSelectAll: PropTypes.bool,
  allOption: PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string
  })
};

Select.defaultProps = {
  allOption: {
    label: "Select all",
    value: "*"
  }
};

const SelectAll = props => {
  const ourProps = {
    placeholder: props.placeholderId,
    clearAllText: props.clearAllTextId,
    allOption: {
      label: props.allOptionId,
      value: "*"
    },
    ...props
  };

  return <Select {...ourProps} />;
};

SelectAll.propTypes = {
  placeholderId: PropTypes.string,
  clearAllTextId: PropTypes.string,
  allOptionId: PropTypes.string
};

SelectAll.defaultProps = {
  placeholderId: "",
  clearAllTextId: "",
  allOptionId: ""
};

export default SelectAll;
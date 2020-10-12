import React from 'react';

import Select from 'react-select';

import { chartTypes } from './data';

const colourStyles = {
  control: styles => ({ 
    ...styles, 
    backgroundColor: 'rgba(0,0,0,.24)', 
    marginTop: 0, 
    marginBottom: '2rem', 
    borderColor: 'transparent', 
  }),
  singleValue: styles => ({
    ...styles, 
    color: 'white',
  }),
  menu: styles => ({
    ...styles, 
    zIndex: '100000 !important',
    backgroundColor: 'rgba(0,0,0,.24)',
  }),
  option: (styles, { isDisabled, isFocused, isSelected }) => {
    return {
      ...styles,
      padding: '5px',
      backgroundColor: !isDisabled && (isSelected ? 'rgba(0,0,0,.74)' : 'rgba(0,0,0,.14)'),
      color: isDisabled
        ? '#ccc'
        : 'white',
      cursor: isDisabled ? 'not-allowed' : 'default',
      ':active': {
        ...styles[':active'],
        backgroundColor: !isDisabled && (isFocused ? 'rgba(0,0,0,.44)' : 'rgba(0,0,0,.74)'),
      },
      '&:hovered': {
        backgroundColor: !isDisabled && 'rgba(0,0,0,.04)',
      },
    };
  }
};

export default function CustomSelect(props) {
  return (
    <Select
      closeMenuOnSelect={true}
      defaultValue={chartTypes[0]}
      options={chartTypes}
      styles={colourStyles}
      onChange={props.onSelectChange}
    />
  )
}
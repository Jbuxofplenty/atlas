import React from 'react';

import Select from 'react-select';

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
    height: 20,
  }),
  option: (styles, { isDisabled, isFocused, isSelected }) => {
    return {
      ...styles,
      padding: '5px',
      backgroundColor: !isDisabled && (isSelected ? '#10111A' : '#25262E'),
      color: isDisabled
        ? '#ccc'
        : 'white',
      cursor: isDisabled ? 'not-allowed' : 'default',
      zIndex: 9999,
      ':active': {
        ...styles[':active'],
        backgroundColor: !isDisabled && (isFocused ? '#10111A' : '#10111A'),
      },
      '&:hovered': {
        backgroundColor: !isDisabled && '#25262E',
      },
    };
  }
};

export default function CustomSelect(props) {

  const handleOnMouseDown = async (e) => {
    e.stopPropagation();
  }

  return (
    <div onMouseDown={handleOnMouseDown}>
      <Select
        closeMenuOnSelect={true}
        defaultValue={props.defaultValue}
        options={props.options}
        styles={colourStyles}
        onChange={props.onSelectChange}
        onMouseDown={handleOnMouseDown}
        maxMenuHeight={100}
      />
    </div>
  )
}
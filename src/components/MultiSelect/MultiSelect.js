import React from 'react';
import chroma from 'chroma-js';
import Select from 'react-select';

const colourStyles = {
  control: styles => ({ ...styles, backgroundColor: 'rgba(0,0,0,.24)', marginTop: 0, marginBottom: '2rem', borderColor: 'transparent', }),
  menu: styles => ({
    ...styles, 
    zIndex: 999,
    backgroundColor: 'transparent !important',
  }),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    const color = chroma(data.color);
    return {
      ...styles,
      zIndex: 999,
      backgroundColor: data.color,
      color: isDisabled
        ? '#ccc'
        : isSelected
        ? chroma.contrast(color, 'white') > 2
          ? 'white'
          : 'black'
        : 'white',
      cursor: isDisabled ? 'not-allowed' : 'default',
      ':active': {
        ...styles[':active'],
        backgroundColor: data.color,
      },
    };
  },
  multiValue: (styles, { data }) => {
    const color = chroma(data.color);
    return {
      ...styles,
      backgroundColor: color.alpha(0.1).css(),
    };
  },
  multiValueLabel: (styles, { data }) => ({
    ...styles,
    color: 'white',
  }),
  multiValueRemove: (styles, { data }) => ({
    ...styles,
    color: data.color,
    ':hover': {
      backgroundColor: data.color,
      color: 'white',
    },
  }),
};

export default function MultiSelect(props) {

  const handleOnMouseDown = async (e) => {
    e.stopPropagation();
  }

  return (
    <div onMouseDown={handleOnMouseDown}>
      <Select
        menuContainerStyle={{ zIndex: 99999 }}
        closeMenuOnSelect={true}
        defaultValue={props.defaultValues}
        isMulti
        options={props.options}
        styles={colourStyles}
        onChange={props.onSelectChange}
      />
    </div>
  )
}
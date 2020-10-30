import React from 'react';
import chroma from 'chroma-js';
import Select from 'react-select';
import {createFilter} from 'react-select';

const colourStyles = {
  control: styles => ({ 
    ...styles, 
    backgroundColor: 
    'rgba(0,0,0,.24)', 
    marginTop: 0, 
    marginBottom: '2rem', 
    borderColor: 'transparent'
  }),
  menu: styles => ({
    ...styles, 
    backgroundColor: 'transparent !important',
  }),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    const color = chroma(data.color);
    return {
      ...styles,
      zIndex: 9999,
      backgroundColor: data.color,
      color: chroma.contrast(color, 'white') > 2
          ? 'white'
          : 'black',
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

const MenuList = function MenuList(props) {
  const children = props.children;

  if (!children.length) {
    return (<div className="myClassListName">{children}</div>);
  }

  return (
    <div className="myClassListName">
      {children.length && children.map((key, i) => {
        delete key.props.innerProps.onMouseMove; //FIX LAG!!
        delete key.props.innerProps.onMouseOver;  //FIX LAG!!
        if(i < 5) {
          return (
            <div className="myClassItemName" key={i}>{key}</div>
          );
        }
        else {
          return null;
        }
      })}
    </div>
  );
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
        filterOption={createFilter({ignoreAccents: false})}
        components={props.options && props.options.length > 500 && { MenuList }}
        maxMenuHeight={100}
      />
    </div>
  )
}
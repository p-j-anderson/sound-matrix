import React from 'react'

const Button = props => {
  return (
    <button
      className={(props.className ? props.className : "btn btn-light")}
      name={props.name}
      onClick={props.handleClick}
    >
      {props.label}
    </button>
  )
}

export default Button

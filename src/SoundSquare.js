import React from 'react'

const SoundSquare = props => {
  // Set class/sizing
  let color = props.baseColor

  // Adjust the color as needed
  if (props.current && props.active) {
    //color = beatColor
    color = props.colors.beat
  } else if (props.active) {
    //color = activeColor
    color = props.colors.active
  }

  // Set styling
  let squareStyle = {
    width: '25px',
    height: '25px',
    margin: '2px',
    backgroundColor: color,
    borderColor: color
  }

  const mouseOver = e => {
    e.target.style.backgroundColor = props.colors.hover
    e.target.style.borderColor = props.colors.hover
  }

  const mouseOut = e => {
    e.target.style.backgroundColor = color
    e.target.style.borderColor = color
  }

  // Return the stylized div
  return (
    <div 
      className="btn"
      style={squareStyle}
      id={props.key}
      beat={props.beat}
      key={props.key}
      onClick={props.handleClick}
      onMouseOver={mouseOver}
      onMouseOut={mouseOut}
    />
  )
}

export default SoundSquare

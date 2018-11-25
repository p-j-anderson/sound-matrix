import React from 'react'

const PlusMinus = props => {
  return (
    <div className="row">
      <div className="col-6 text-left">
        <span className="font-weight-light h5">{props.title}</span>
      </div>

      <div className="col-3 text-right">
        <span>{props.detail}</span>
      </div>

      <div className="col-3 text-right">
        <button
          className="btn btn-light btn-sm m-1 fas fa-minus"
          name="decrease"
          onClick={props.handleClick}
        >
        </button>
        <button
          className="btn btn-light btn-sm m-1 fas fa-plus"
          name="increase"
          onClick={props.handleClick}
        >
        </button>
      </div>
    </div>
  )
}

export default PlusMinus

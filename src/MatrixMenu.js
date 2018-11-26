import React from 'react'
import PlusMinus from './PlusMinus.js'

const MatrixMenu = props => {
  return (
    <div className="row justify-content-center border p-2">
      <div className="col-sm-6 text-right border-right">
        <PlusMinus
          title="Speed"
          detail={props.speed}
          handleClick={props.changeSpeed}
        />

        <PlusMinus
          title={'Square Background'}
          detail={props.base}
          handleClick={props.changeBase}
        />

        <PlusMinus
          title="Background"
          detail={props.background}
          handleClick={props.changeBackground}
        />
      </div>

      <div className="col-sm-6">
        <PlusMinus
          title="Active Colors"
          detail={props.color}
          handleClick={props.changeColor}
        />

        <PlusMinus
          title="Scale"
          detail={props.scale}
          handleClick={props.changeScale}
        />

        <div className="font-weight-light h5 text-left">
         Global Loops:
          <span className="float-right">{props.globalLoops.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>
        </div>
      </div>
    </div>
  )
}

export default MatrixMenu

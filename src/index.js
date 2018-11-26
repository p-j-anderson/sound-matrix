// Import react
import React, { Component } from 'react'
import ReactDOM from 'react-dom'

// Helpers
import { buildMatrixState, getBackgrounds, getScales, getColors } from './matrixUtilities.js'

// Components
import SoundSquare from './SoundSquare.js'
import MatrixMenu from './MatrixMenu.js'
import Button from './Button.js'

class SoundMatrix extends Component {
  constructor(props) {
    super(props)
    this.loop = null
    this.state = {
      rowCount: 16,
      rowLength: 16,
      beat: 0,
      playing: false,
      speed: 175,
      matrix: buildMatrixState(16, 16),
      backgrounds: getBackgrounds(),
      baseColors: getBackgrounds(),
      scales: getScales(),
      activeColors: getColors(),
      showMenu: false,
      globalLoops: null,
      loopCount: 0
    }

    // Bind handlers to reference state correctly
    this.handleSquareClick = this.handleSquareClick.bind(this)
    this.handleBoolean = this.handleBoolean.bind(this)
    this.togglePlaying = this.togglePlaying.bind(this)
    this.submitCount = this.submitCount.bind(this)
    this.changeSpeed = this.changeSpeed.bind(this)
    this.changeScale = this.changeScale.bind(this)
    this.changeActiveColor = this.changeActiveColor.bind(this)
    this.changeBackgroundColor = this.changeBackgroundColor.bind(this)
    this.changeBaseColor = this.changeBaseColor.bind(this)
  }

  componentDidMount() {
    // Adjust color on mount and add unload listener
    this.changeBaseColor({ target: { name: 'increase' }})
    window.addEventListener('beforeunload', this.submitCount)

    // Get total loop count
    fetch('api/v1/stats/sound-matrix')
      .then(res => res.json())
      .then(res => {
        this.setState({ globalLoops: res.data[0].count })
      })
      // If an error occurs, provide a random number
      .catch(err => {this.setState({ globalLoops: Math.floor(Math.random() * 100000) })})
  }

  submitCount() {
    // Submit accumulated loop count to stats
    fetch('/api/v1/stats/sound-matrix', {
      method: 'POST',
      body: JSON.stringify({ count: this.state.loopCount }),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    window.removeEventListener('beforeunload', this.submitCount)
  }

  rowBuilder(rowCount, rowLength, rows = []) {
    if (rowCount > 0) {
      // Find the largest squareKey
      const squareKey = rowCount * rowLength

      // Add a row of squares and loop the builder by rowCount
      rows.push(this.squareBuilder(squareKey, rowCount, rowLength))
      return this.rowBuilder(rowCount - 1, rowLength, rows)
    }
    return rows
  }

  squareBuilder(squareKey, rowCount, rowLength, row = []) {
    if (rowLength > 0) {
      // Find the square by key
      const square = this.state.matrix[squareKey]

      // Add a new square to the row
      row.push(SoundSquare({
        key: squareKey,
        active: square.active,
        handleClick: this.handleSquareClick,
        beat: square.beat,
        current: (square.beat === this.state.beat),
        sound: square.sound,
        colors: square.colors,
        baseColor: this.state.baseColors[0]
      }))

      // Loop the squareBuidler by rowLength
      return this.squareBuilder(squareKey - 1, rowCount, rowLength - 1, row)
    }
    return (<div id={'row-' + rowCount} key={'row-' + rowCount}>{row}</div>)
  }

  handleSquareClick(e) {
    // Find the matrix and square id
    const matrix = this.state.matrix
    const id = e.target.id

    // Update the square state
    matrix[id].active = !matrix[id].active
    this.setState({ matrix })
  }

  togglePlaying() {
    // Toggle the playing state
    const playing = !this.state.playing
    this.setState({ playing })
    
    if (playing) {
      // Set an interval that loops the beat
      this.loop = setInterval(() => {
        let newBeat

        // Restart the beat if we reach rowLength
        if (this.state.beat >= this.state.rowLength) {
          newBeat = 1
          this.setState({ loopCount: this.state.loopCount + 1 })
        } else {
          // Increment the beat
          newBeat = this.state.beat + 1
        }

        // Update state and play any necessary sounds
        this.setState({ beat: newBeat })
        Object.entries(this.state.matrix).forEach(obj => {
          // Object.entries returns a [key, value] array
          if (obj[1].active && obj[1].beat === this.state.beat) {

            // Clone the sound if already playing
            if (obj[1].sound.currentTime > 0) {
              const cloneSound = obj[1].sound.cloneNode()
              cloneSound.play()
            } else {
              obj[1].sound.play()
            }
          }
        })

      // Set interval speed
      }, this.state.speed)

    } else {
      // Clear loop and reset beat
      clearInterval(this.loop)
      this.setState({ beat: 0 })
    }
  }

  changeSpeed(e) {
    let speed = this.state.speed
    if (e.target.name === 'increase') {
      speed = (speed > 50 ? (speed - 10) : 50)
    } else if (e.target.name === 'decrease') {
      speed = (speed < 600 ? (speed + 10) : 600)
    }

    this.setState({ speed })
  }

  changeScale(e) {
    let scales = this.state.scales
    if (e.target.name === 'increase') {
      scales.push(scales.shift())
    } else if (e.target.name === 'decrease') {
      scales.unshift(scales.pop())
    }

    // Rebuild matrix with new scale
    const matrix = buildMatrixState(16, 16, scales[0], this.state.activeColors[0], this.state.matrix)
    this.setState({ scales, matrix })
  }

  changeActiveColor(e) {
    let colors = this.state.activeColors
    if (e.target.name === 'increase') {
      colors.push(colors.shift())
    } else if (e.target.name === 'decrease') {
      colors.unshift(colors.pop())
    }

    // Rebuild matrix with new scale
    const matrix = buildMatrixState(16, 16, this.state.scales[0], colors[0], this.state.matrix)
    this.setState({ colors, matrix })
  }

  changeBackgroundColor(e) {
    let backgrounds = this.state.backgrounds
    if (e.target.name === 'increase') {
      backgrounds.push(backgrounds.shift())
    } else if (e.target.name === 'decrease') {
      backgrounds.unshift(backgrounds.pop())
    }

    document.body.style.backgroundColor = backgrounds[0]
    this.setState({ backgrounds })
  }

  changeBaseColor(e) {
    let baseColor = this.state.baseColors
    if (e.target.name === 'increase') {
      baseColor.push(baseColor.shift())
    } else if (e.target.name === 'decrease') {
      baseColor.unshift(baseColor.pop())
    }

    this.setState({ baseColor })
  }

  handleBoolean(e) {
    this.setState({ [e.target.name]: !this.state[e.target.name] })
  }

  renderMenu() {
    if (!this.state.showMenu) return null

    return (
      <MatrixMenu 
        speed={this.state.speed}
        changeSpeed={this.changeSpeed}
        background={this.state.backgrounds[0]}
        changeBackground={this.changeBackgroundColor}
        base={this.state.baseColors[0]}
        changeBase={this.changeBaseColor}
        scale={this.state.scales[0]}
        changeScale={this.changeScale}
        color={this.state.activeColors[0]}
        changeColor={this.changeActiveColor}
        globalLoops={this.state.globalLoops}
      />
    )
  }

  render() {
    return (
      <div className="text-center mt-5 container">

        {this.renderMenu()}

        <Button
          label={(this.state.showMenu ? 'Hide Menu' : 'Show Menu')}
          name="showMenu"
          className="btn btn-light my-2 mx-1"
          handleClick={this.handleBoolean}
        />

        <Button 
          label={(this.state.playing ? 'Stop Playing' : 'Start Playing')}
          name="playing"
          className="btn btn-light my-2 mx-1"
          handleClick={this.togglePlaying}
        />
 
        {this.rowBuilder(this.state.rowCount, this.state.rowLength)}
      </div>
    )
  }
}

// Renders the SoundMatrix component if correct ID is found
if (document.getElementById('sound-matrix-component')) {
  ReactDOM.render(<SoundMatrix />, document.getElementById('sound-matrix-component'))
}
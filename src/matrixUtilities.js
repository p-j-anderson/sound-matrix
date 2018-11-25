// Sounds
import minorPen from './scales/minorPen.js'
import c from './scales/c.js'
import dm from './scales/dm.js'
import e from './scales/e.js'
import f from './scales/f.js'
import fm from './scales/fm.js'
import g from './scales/g.js'
import afm from './scales/afm.js'

// Colors
import rainbow from './colors/rainbow.js'
import pink from './colors/pink.js'
import red from './colors/red.js'
import blue from './colors/blue.js'
import purple from './colors/purple.js'
import green from './colors/green.js'
import orange from './colors/orange.js'
import yellow from './colors/yellow.js'

/**
 * Builds state based on height x width
 */
export const buildMatrixState = (rowCount, rowLength, scale = null, color = null, matrix = {}) => {
  const totalSquares = rowCount * rowLength
  const matrixState = {}

  // Calculate details for each square
  for (let key = 1; key <= totalSquares; key++) {
    // Calculate beat and row details
    const calcBeat = key % rowLength
    const calcRow = Math.floor(key / rowLength)
    const row = (calcBeat === 0 ? calcRow : calcRow + 1)

    // Build the squareDetails
    const squareDetails = {
      active: (matrix[key] ? matrix[key].active : false),
      beat: (calcBeat === 0 ? 1 : (rowLength - calcBeat) + 1),
      sound: getScale(scale)[row],
      colors: getColor(color)[row]
    }

    // Add the square to the matrixState object
    matrixState[key] = squareDetails
  }

  return matrixState
}

export const getScale = (scale = null) => {
  const scales = {
    'Pentatonic': minorPen,
    'C Major': c,
    'D Minor': dm,
    'E Major': e,
    'F Major': f,
    'F Minor': fm,
    'G Major': g,
    'A Flat Minor': afm
  }

  if (scales[scale]) return scales[scale]
  return scales['Pentatonic']
}

export const getColor = (color = null) => {
  const colors = {
    'Rainbow': rainbow,
    'Pink': pink,
    'Red': red,
    'Blue': blue,
    'Purple': purple,
    'Green': green,
    'Orange': orange,
    'Yellow': yellow
  }

  if (colors[color]) return colors[color]
  return colors['Rainbow']
}

export const getScales = () => {
  return [
    'Pentatonic',
    'C Major',
    'D Minor',
    'E Major',
    'F Major',
    'F Minor',
    'G Major',
    'A Flat Minor'
  ]
}

export const getColors = () => {
  return [
    'Rainbow',
    'Pink',
    'Red',
    'Blue',
    'Purple',
    'Green',
    'Orange',
    'Yellow'
  ]
}

export const getBackgrounds = () => {
  return [
    'White',
    'Gainsboro',
    'Silver',
    'DimGray',
    'DarkSlateGray',
    'Black',
    'Salmon',
    'Crimson',
    'Firebrick',
    'Pink',
    'HotPink',
    'DarkOrange',
    'Gold',
    'Khaki',
    'Lavender',
    'Violet',
    'MediumPurple',
    'DarkOrchid',
    'Indigo',
    'GreenYellow',
    'Lime',
    'SeaGreen',
    'Olive',
    'Teal',
    'Aqua',
    'SteelBlue',
    'SkyBlue',
    'RoyalBlue',
    'Navy',

  ]
}
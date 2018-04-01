import React, { Component } from 'react'
import './App.css'
import img from './asset/images/index'

const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
const dictionnaire = [
  'RONRONNER',
  'PETALE',
  'GOMME',
  'SUPERMARCHE',
  'MOUTARDE',
  'CUISINE',
  'ASSASSINER',
  'BALCON',
  'LANCE',
  'ADHESIF',
  'ATTAQUES',
  'FOYER',
  'PATURAGE',
  'STATUE',
  'APERITIF',
  'ASPHALTE',
  'PIEDESTAL',
  'PALETTE',
  'PRINCIPAL',
  'RIME',
  'HIBERNER'
]

class App extends Component {
  state = {
    word: this.pickAWord(),
    hangman: 'img0',
    usedLetters: new Set(),
    foundLetters: new Set(),
    tryLeft: 15,
    won: false,
    loose: false
  }

  pickAWord () {
    return dictionnaire[Math.floor(Math.random() * dictionnaire.length)]
  }

  computeDisplay (phrase, usedLetters) {
    return phrase.replace(/\w/g,
      (letter) => (usedLetters.has(letter) ? letter : ' _ ')
    )
  }

  letterClass (word, letter, usedLetters, foundLetters) {
    if (foundLetters.has(letter)) {
      return 'found'
    }

    if (usedLetters.has(letter)) {
      return 'tried'
    }

    return 'clean'
  }

  // Bind OnClickLetter 
  handleOnClickLetter = (event) => {
    const letter = event.currentTarget.textContent
    const letters = this.state.word.split('')
    const charPos = this.state.word.search(letter)
    const foundLetters = charPos === -1 ? this.state.foundLetters : this.state.foundLetters.add(letter)
    const won = letters.filter(i => foundLetters.has(i)).length === this.state.word.length
    const tryLeft = (this.state.won || foundLetters.has(letter)) ? this.state.tryLeft : this.state.tryLeft - (this.state.usedLetters.has(letter) ? 2 : 1)
    const loose = (!this.state.won && tryLeft <= 0)
    const hangman = (!this.state.won && !this.state.loose && charPos === -1) ? 'img' + (14 - tryLeft) : this.state.hangman
    console.log(won, loose, charPos)

    this.setState(
      (prevState, props) => ({
        hangman: hangman,
        usedLetters: this.state.usedLetters.add(letter),
        foundLetters: foundLetters,
        tryLeft: tryLeft,
        won: won,
        loose: loose
      })
    )
  }

  // Bind OnClickReplay 
  handleOnClickReplay = () => {
    this.setState(
      (prevState, props) => ({
        word: this.pickAWord(),
        hangman: 'img0',
        usedLetters: new Set(),
        foundLetters: new Set(),
        tryLeft: 15,
        won: false,
        loose: false
      })
    )
  }

  render () {
    const { word, hangman, usedLetters, foundLetters, tryLeft, won, loose } = this.state

    return (
      <div className='main'>
        <center>
          <h1 className='title'>LE PENDU EN LIGNE</h1>
        </center>
        <div className='hangman'>
          <center>
            <img src={img[hangman]} alt='Le pendu' />
            <center><i>Trouvez un mot de {word.length} lettres en 15 coups</i></center>
            <center className='mask'>{this.computeDisplay(word, usedLetters)}</center>
            {loose && <p>Perdu, le mot était : "{word}" !</p>}
            {won && <p>Gagné !</p>}
            {(won || loose) && <div className='replay' onClick={this.handleOnClickReplay}>REJOUER</div>}
          </center>
        </div>
        <div>
          <div className='keyboard'>
            {alphabet.map(letter => (
              <div className={'letter ' + this.letterClass(word, letter, usedLetters, foundLetters)} key={letter} onClick={this.handleOnClickLetter}>{letter}</div>
            ))}
          </div>
          <p className='tries'>Il vous reste <b>{tryLeft > 0 ? tryLeft : 0} essai{tryLeft > 1 ? '(s)' : ''}</b></p>
        </div>
      </div>
    )
  }
}

export default App

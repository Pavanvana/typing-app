import {Component} from 'react'

import {RxLapTimer} from "react-icons/rx"
import tick from './audio/tick.wav'
import wrong from './audio/wrong.wav'
import gameOver from './audio/gameOver.mp3'
import "./App.css"

class App extends Component{
    state = {
        gameStart: false,
        timer : '',
        randomKey: '',
        score : 0,
        typeCount: 0,
        correctKeyCount: 0,
        timeUp: false,
        combinations: 1,
        keyInput: "",
    }

    componentDidMount = () => {
        this.renderNewKey()
    }

    renderNewKey = () => {
        const {combinations} = this.state
        const randomList = ['a', 'b', 'c', 'b', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
        let randomKey = ""
        for(let i = 0; i < combinations; i++){
          randomKey += randomList[Math.floor(Math.random() * randomList.length)]
        }

        this.setState({randomKey})
    }

    setTimer = () => {
        let setTimerinMinutes = 5
        let timer = setTimerinMinutes * 60
        let t = setInterval(() => {
            let minutes = Math.floor(timer / 60)
            if (minutes <= 9){
                minutes = '0' + minutes
            }

            let seconds = timer % 60 
            if (seconds <= 9){
                seconds = '0' + seconds
            }
            const result = minutes + ':' + seconds
            this.setState({timer: result})
            timer -= 1
            if (timer < 0){
                clearInterval(t)
                this.setState({timeUp: true})
                this.playAudio(gameOver)
            }
        }, 1000);
    }

    playAudio = (audioName) => {
        let audio = new Audio(audioName)
        audio.play()
    }

    onClickKey = (event) => {
        const {randomKey} = this.state
        if (event.key === randomKey[event.target.value.length-1]){
          this.setState({keyInput: event.target.value})
          this.playAudio(tick)
          if (event.target.value === randomKey){
            this.renderNewKey()
            this.setState({keyInput: "", score: this.state.score + 1, correctKeyCount: this.state.correctKeyCount + 1, typeCount: this.state.typeCount + 1})
          }
        }else if (event.key === "Backspace"){
          this.playAudio(tick)
        }else{
          this.setState({typeCount: this.state.typeCount + 1})
          this.playAudio(wrong)
        }
          
    }

    onChangeInput = (event) => {
      this.setState({keyInput: event.target.value})
    }

    onClickStartbtn = () => {
        this.setState({gameStart: true})
        this.setTimer()
    }

    getAccuracy = () => {
        const {correctKeyCount, typeCount} = this.state
        const Accuracy = Math.floor(correctKeyCount / typeCount * 100)
        return <p className='score'>Accuracy: <span className='score-num'>{Accuracy}</span>%</p>
    }

    onClickRetry = () => {
        this.setState({timeUp: false, score: 0, typeCount: 0, correctKeyCount: 0}, this.setTimer)
    }

    onChangeCombination = (event) => {
      this.setState({combinations: event.target.value}, this.renderNewKey)
    }
    combinations = () => {
      const {combinations} = this.state
      const keys = [1, 2, 3, 4, 5, 6, 7, 8, 9]
      return (
        <div className='dropdown-container'>
          <label htmlFor='combinations' className='label'>Combination</label>
          <select id='combinations' className='dropdown' onChange={this.onChangeCombination} value={combinations}>
          {keys.map(each => {
            return <option key={each}>{each}</option>
          })}
        </select>
        </div>
      )
    }

    render(){
        const {timer,randomKey, score, gameStart, timeUp, correctKeyCount, typeCount, keyInput} = this.state
        const Accuracy = Math.floor(correctKeyCount / typeCount * 100)
        return(
            <div className='typing-container'>
                <div className='app-container'>
                <img className='app-logo' src='https://cdn.shopify.com/s/files/1/0654/9150/1290/files/chaabi_logo.png?v=1658754' alt="logo"/>
                    <h1 className='app-heading'> Typing Master</h1>
                    <hr className='hr-line'/>
                    <div className='timer-container'>
                        <RxLapTimer className='timer-icon'/>
                        {gameStart ? <p className='timer'>{timer}</p> : <p className='timer'>05:00</p>}
                    </div>
                    <div className='generator'>
                      {this.combinations()}
                    </div>
                    {timeUp ? 
                        <div className='time-up-contaqiner'>
                            <img className='time-up' src="https://thumbs.dreamstime.com/b/times-up-hurry-burning-stopwatch-icon-hot-offer-symbol-152334991.jpg" alt='time-up'/>
                            <p className='result-score'>Score: <span className='result-score-num'>{score}</span></p>
                            <p className='result-score'>Accuracy: <span className='result-score-num'>{Accuracy}</span>%</p>
                            <button className='retry-btn' onClick={this.onClickRetry}>Retry</button>
                        </div>
                     : 
                     <div>
                    <p className='randomkey'>{randomKey}</p>
                    {gameStart ? <input className='input-box' type="text" placeholder='Type that key here' onKeyUp={this.onClickKey} onChange={this.onChangeInput} value={keyInput}/> :
                    <button className='start-btn' onClick={this.onClickStartbtn}>Start</button> } 
                    <div className='bottom-section'>
                        <p className='score'>Score: <span className='score-num'>{score}</span></p>
                        {gameStart ? this.getAccuracy() : <p className='score'>Accuracy: <span className='score-num'>100</span>%</p>}
                    </div>
                    </div> }
                </div>
            </div>
        )
    }
}
export default App
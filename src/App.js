import React from 'react';
import logo from './logo.svg';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clickedEmotion: null,
      clickedIntensity: null
    };
  }

  componentDidMount() {
    // this.timerID = setInterval(
    //   () => this.tick(),
    //   1000
    // );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    this.setState({
      date: new Date()
    });
  }

  selectemotion(emotion) {
    console.log('michelle clicked ' + emotion);
    if (typeof emotion === 'string') {
      this.setState({
        clickedEmotion: emotion
      })
    } else {
      this.setState({
        clickedIntensity: emotion
      })
    }
    console.log(this.state);
    console.log("hello" === "bye" ? 'yo' : 'no')
  }

  
  render() {
    return (
      <div className="App">
        <p>
          Good morning, Michelle. How are you feeling today?
          {this.state.clickedEmotion}
        </p>
        
        <button onClick={() => this.selectemotion('angry')} className="button1" style={{backgroundColor: this.state.clickedEmotion === null || this.state.clickedEmotion === 'angry' ? "#e6fff9" : "#d9d9d9", color: this.state.clickedEmotion === null || this.state.clickedEmotion === 'angry' ? "black" : "white"}} type="button">Angry</button><br/>
        <button onClick={() => this.selectemotion('bad')} className="button1" style={{backgroundColor: this.state.clickedEmotion === null || this.state.clickedEmotion === 'bad' ? "#b3ffec" : "#d9d9d9", color: this.state.clickedEmotion === null || this.state.clickedEmotion === 'bad' ? "black" : "white"}} type="button">Bad</button><br/>
        <button onClick={() => this.selectemotion('disgusted')} className="button1" style={{backgroundColor: this.state.clickedEmotion === null || this.state.clickedEmotion === 'disgusted' ? "#80ffe5" : "#d9d9d9", color: this.state.clickedEmotion === null || this.state.clickedEmotion === 'disgusted' ? "black" : "white"}} type="button">Disgusted</button><br/>
        <button onClick={() => this.selectemotion('fearful')} className="button1" style={{backgroundColor: this.state.clickedEmotion === null || this.state.clickedEmotion === 'fearful' ? "#4dffd2" : "#d9d9d9", color: this.state.clickedEmotion === null || this.state.clickedEmotion === 'fearful' ? "black" : "white"}} type="button">Fearful</button><br/>
        <button onClick={() => this.selectemotion('happy')} className="button1" style={{backgroundColor: this.state.clickedEmotion === null || this.state.clickedEmotion === 'happy' ? "#00e6ac" : "#d9d9d9"}} type="button">Happy</button><br/>
        <button onClick={() => this.selectemotion('sad')} className="button1" style={{backgroundColor: this.state.clickedEmotion === null || this.state.clickedEmotion === 'sad' ? "#00cc99" : "#d9d9d9"}} type="button">Sad</button><br/>
        <button onClick={() => this.selectemotion('surprised')} className="button1" style={{backgroundColor: this.state.clickedEmotion === null || this.state.clickedEmotion === 'surprised' ? "#009973" : "#d9d9d9"}} type="button">Surprised</button><br/>
        <button onClick={() => this.selectemotion('indifferent')} className="button1" style={{backgroundColor: this.state.clickedEmotion === null || this.state.clickedEmotion === 'indifferent' ? "#00664d" : "#d9d9d9"}} type="button">Indifferent</button><br/>
        
        <p>
        On a scale of 1 to 5, how intensely did you feel that?
        </p>
        <button onClick={() => this.selectemotion(1)} className="button2" style={{backgroundColor: "#e6fff9"}} type="button">1</button>
        <button onClick={() => this.selectemotion(2)} className="button2" style={{backgroundColor: "#b3ffec"}} type="button">2</button>
        <button onClick={() => this.selectemotion(3)} className="button2" style={{backgroundColor: "#b3ffec"}} type="button">3</button>
        <button onClick={() => this.selectemotion(4)} className="button2" style={{backgroundColor: "#4dffd2"}} type="button">4</button>
        <button onClick={() => this.selectemotion(5)} className="button2" style={{backgroundColor: "#00e6ac"}} type="button">5</button>
       


      </div>
    );
  }
  
}

export default App;

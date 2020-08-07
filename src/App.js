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

  }

  
  
  render() {
    return (
      <div className="App">
        <p>
          Good morning, Michelle. How are you feeling today?
          {this.state.clickedEmotion}
        </p>
        
        <button onClick={() => this.selectemotion('angry')} className="button1" style={{backgroundColor: "#e6fff9", color: "black"}} type="button">Angry</button><br/>
        <button onClick={() => this.selectemotion('bad')} className="button1" style={{backgroundColor: "#b3ffec", color: "black"}} type="button">Bad</button><br/>
        <button onClick={() => this.selectemotion('disgusted')} className="button1" style={{backgroundColor: "#80ffe5", color: "black"}} type="button">Disgusted</button><br/>
        <button onClick={() => this.selectemotion('fearful')} className="button1" style={{backgroundColor: "#4dffd2", color: "black"}} type="button">Fearful</button><br/>
        <button onClick={() => this.selectemotion('happy')} className="button1" style={{backgroundColor: "#00e6ac"}} type="button">Happy</button><br/>
        <button onClick={() => this.selectemotion('sad')} className="button1" style={{backgroundColor: "#00cc99"}} type="button">Sad</button><br/>
        <button onClick={() => this.selectemotion('surprised')} className="button1" style={{backgroundColor: "#009973"}} type="button">Surprised</button><br/>
        <button onClick={() => this.selectemotion('indifferent')} className="button1" style={{backgroundColor: "#00664d"}} type="button">Indifferent</button><br/>
        
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

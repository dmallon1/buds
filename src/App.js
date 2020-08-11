import React from 'react';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clickedEmotion: null,
      clickedIntensity: null,
      clickedDone: false,
      writtenText: ""
    };
  }

  selectemotion(emotion) {
    if (typeof emotion === 'string') {
      this.setState({
        clickedEmotion: emotion
      });
    } else {
      this.setState({
        clickedIntensity: emotion
      });
    }
  }

  selectDone() {
    this.setState({
      clickedDone: true
    });
  }

  handleChange(event) {
    this.setState({writtenText: event.target.value});
  }

  handleSubmit(event) {
    console.log('writtenText: ' + this.state.writtenText);
    event.preventDefault();
  }

  firstPage() {
    return ( 
    <div>
        <p>
          Good morning, Michelle. How are you feeling today?
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
        <button onClick={() => this.selectemotion(1)} className="button2" style={{backgroundColor: this.state.clickedIntensity === null || this.state.clickedIntensity === 1 ? "#e6fff9": "#d9d9d9"}} type="button">1</button>
        <button onClick={() => this.selectemotion(2)} className="button2" style={{backgroundColor: this.state.clickedIntensity === null || this.state.clickedIntensity === 2 ? "#b3ffec" : "#d9d9d9"}} type="button">2</button>
        <button onClick={() => this.selectemotion(3)} className="button2" style={{backgroundColor: this.state.clickedIntensity === null || this.state.clickedIntensity === 3 ? "#80ffe5" : "#d9d9d9"}} type="button">3</button>
        <button onClick={() => this.selectemotion(4)} className="button2" style={{backgroundColor: this.state.clickedIntensity === null || this.state.clickedIntensity === 4 ? "#4dffd2" : "#d9d9d9"}} type="button">4</button>
        <button onClick={() => this.selectemotion(5)} className="button2" style={{backgroundColor: this.state.clickedIntensity === null || this.state.clickedIntensity === 5 ? "#00e6ac" : "#d9d9d9"}} type="button">5</button>
       
       <p>
        <button onClick={() => this.selectDone()} className="button3" style={{backgroundColor: "#d9d9d9"}} type="button">Done</button>
       </p>
      </div>
    );
  }
  
  secondPage() {
    return (
      <div>
        <p>
        Write about what made you feel {this.state.clickedEmotion} of intensity level {this.state.clickedIntensity} today:
        </p>
        <label>
          <textarea type="text" value={this.state.writtenText} onChange={(e) => this.handleChange(e)} rows="10" cols="35"/>
        </label> <br/>
        <button onClick={(e) => this.handleSubmit(e)} className="button3" style={{backgroundColor: "#d9d9d9"}} type="button">Done</button>
      </div>
    );
  }

  render() {
    return (
      <div className="App">
        {!this.state.clickedDone && this.firstPage()}
        {this.state.clickedDone && this.secondPage()}
      </div>
    );
  }
}

export default App;

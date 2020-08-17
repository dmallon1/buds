import React from 'react';
import './App.css';
const PROD_URL = "https://guarded-depths-61972.herokuapp.com/entries"
const LOCAL_URL = "http://localhost:5000/entries"
const URL = process.env.REACT_APP_IS_LOCAL === "1" ? LOCAL_URL : PROD_URL;


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clickedEmotion: null,
      clickedIntensity: null,
      currentPage: 3,
      writtenText: "",
      entries: null,
    };
  }

  navigationBar() {
    return (
        <div className="row align-items-center" style={{cursor: "pointer", backgroundColor: "#d9d9d9", border:"2px solid black", height:"40px"}}>
          <div onClick={() => this.setState({currentPage: 1})} className="col" style={{fontWeight: this.state.currentPage !== 3 ? "bold" : "" }}>
          Today's Feeling
          </div>
          <div onClick={() => this.setState({currentPage: 3})} className="col" style={{fontWeight: this.state.currentPage === 3 ? "bold" : "" }}>
          Journal Log
          </div>
        </div>
    )
  }

  componentDidMount() {
    this.refreshData()
  }

  refreshData() {
    fetch(URL).then(r => r.json().then(data => {
      this.setState({
        entries: data.results
      })
    }));
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
    if ( this.state.currentPage === 2) {
      const payload = {
        emotion: this.state.clickedEmotion,
        intensity: this.state.clickedIntensity,
        entry: this.state.writtenText
      }
      this.postData(URL, payload)
        .then(data => {
          console.log(data); // JSON data parsed by `data.json()` call
          this.refreshData()
        });
    }
    this.setState({
      currentPage: this.state.currentPage + 1
    });
  }

  handleChange(event) {
    this.setState({writtenText: event.target.value});
  }

  loginPage() {
    return(
      <div>
        <p>
          Sign Up
        </p>
        Hi, what's your name?
      </div>
    )
  }
  
  firstPage() {
    return (
    <div>
        <p>
          Good morning, Michelle. How are you feeling today?
        </p>

        <button onClick={() => this.selectemotion('Angry')} className="button1" style={{backgroundColor: this.state.clickedEmotion === null || this.state.clickedEmotion === 'Angry' ? "#e6fff9" : "#d9d9d9", color: this.state.clickedEmotion === null || this.state.clickedEmotion === 'Angry' ? "black" : "white"}} type="button">Angry</button><br/>
        <button onClick={() => this.selectemotion('Bad')} className="button1" style={{backgroundColor: this.state.clickedEmotion === null || this.state.clickedEmotion === 'Bad' ? "#b3ffec" : "#d9d9d9", color: this.state.clickedEmotion === null || this.state.clickedEmotion === 'Bad' ? "black" : "white"}} type="button">Bad</button><br/>
        <button onClick={() => this.selectemotion('Disgusted')} className="button1" style={{backgroundColor: this.state.clickedEmotion === null || this.state.clickedEmotion === 'Disgusted' ? "#80ffe5" : "#d9d9d9", color: this.state.clickedEmotion === null || this.state.clickedEmotion === 'Disgusted' ? "black" : "white"}} type="button">Disgusted</button><br/>
        <button onClick={() => this.selectemotion('Fearful')} className="button1" style={{backgroundColor: this.state.clickedEmotion === null || this.state.clickedEmotion === 'Fearful' ? "#4dffd2" : "#d9d9d9", color: this.state.clickedEmotion === null || this.state.clickedEmotion === 'Fearful' ? "black" : "white"}} type="button">Fearful</button><br/>
        <button onClick={() => this.selectemotion('Happy')} className="button1" style={{backgroundColor: this.state.clickedEmotion === null || this.state.clickedEmotion === 'Happy' ? "#00e6ac" : "#d9d9d9"}} type="button">Happy</button><br/>
        <button onClick={() => this.selectemotion('Sad')} className="button1" style={{backgroundColor: this.state.clickedEmotion === null || this.state.clickedEmotion === 'Sad' ? "#00cc99" : "#d9d9d9"}} type="button">Sad</button><br/>
        <button onClick={() => this.selectemotion('Surprised')} className="button1" style={{backgroundColor: this.state.clickedEmotion === null || this.state.clickedEmotion === 'Surprised' ? "#009973" : "#d9d9d9"}} type="button">Surprised</button><br/>
        <button onClick={() => this.selectemotion('Indifferent')} className="button1" style={{backgroundColor: this.state.clickedEmotion === null || this.state.clickedEmotion === 'Indifferent' ? "#00664d" : "#d9d9d9"}} type="button">Indifferent</button><br/>

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
          <textarea type="text" value={this.state.writtenText} onChange={(e) => this.handleChange(e)} rows="10" cols="45"/>
        </label> <br/>
        <button onClick={() => this.selectDone()} className="button3" style={{backgroundColor: "#d9d9d9"}} type="button">Done</button>
      </div>
    );
  }

  /*
  a list with (timestamp, emotion, intensity, entry_text)
  */
  thirdPage(entries) {
    if (entries === null || entries.length === 0) {
      return "Journal Log empty";
    } else {
      return(
        <div>
          <p>
          Journal Log
          </p>
          {entries.map((entry, i) =>
            <div key={i}>
              {entry.new_created} - {entry.emotion}
                <div style={{border:"2px solid black", height:"100px", width: "400px", margin: "auto"}}>
                  {entry.entry}
                </div>
            </div>
          )}
        </div>
      )
    }
  }

  render() {
    return (
      <div className="App">
        {this.navigationBar()}
        {this.state.currentPage === 1 && this.firstPage()}
        {this.state.currentPage === 2 && this.secondPage()}
        {this.state.currentPage === 3 && this.thirdPage(this.state.entries)}
      </div>
    );
  }

  postData(url = '', data = {}) {
    // Default options are marked with *
    return fetch(url, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(data) // body data type must match "Content-Type" header
    }).then(res => res.json());
}
  
  
}

export default App;

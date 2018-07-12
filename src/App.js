import React, { Component } from 'react'
import Dropzone from 'react-dropzone'
import request from 'superagent'
import './App.css';

class App extends Component {
  state = {
    img: '',
    imgUrl: '',
    question: '',
    isLoading: false,
    answers: [],
  }

  onDrop(files) {
    let file = files[0]
    let reader = new FileReader();

    reader.onloadend = () => {
      this.setState({
        img: file,
        imgUrl: reader.result
      });
    }

    reader.readAsDataURL(file)
  }

  handleSubmit(e) {
    this.setState({ isLoading: true, answers: [] })

    request
      .post('http://ec2-34-220-163-4.us-west-2.compute.amazonaws.com/')
      .attach('image', this.state.img)
      .field('question', this.state.question)
      .then((res) => {
        console.log(res)
        this.setState({ answers: res.body, isLoading: false })
      })
      .catch((err) => {
        this.setState({ isLoading: false })
        console.log(err)
      })
  }

  render() {
    return (
      <div className="App">
        <h1>Ask me anything</h1>
        <h4>1. Upload an image (limit: 4MB)</h4>

        <div className="drop">
          <p className="drop-text">Drag and drop or click to select image</p>
          <Dropzone 
            accept={['image/png', 'image/jpeg']}
            onDrop={this.onDrop.bind(this)}
            multiple={false}
          >
          </Dropzone>
        </div>
        <img src={this.state.imgUrl} alt="preview" style={{height: '200px'}} />


        <h4>2. Ask a question</h4>
        <input style={{width: '400px'}} type="text" placeholder="Enter a question" value={this.state.question} onChange={e => this.setState({question: e.target.value})} />

        <br /><br />
        <button onClick={this.handleSubmit.bind(this)}>Submit</button>
        
        {this.state.isLoading && <p>Computing...</p>}
        {this.state.answers.length>0 && <h4>Predicted answers:</h4>}
        {this.state.answers.map((v, k) =>
          <div key={k}>
            {v[0]}
            <div className="pbar" style={{width: Math.round(v[1]*400)+'px'}}>{(v[1]*100).toFixed(2)}%</div>
          </div>
        )}
      </div>
    );
  }
}

export default App;

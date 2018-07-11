import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  state = {
    img: '',
    imgUrl: '',
    question: '',
  }

  previewImage(e) {
    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      this.setState({
        img: file,
        imgUrl: reader.result
      });
    }

    reader.readAsDataURL(file)
  }

  handleSubmit(e) {
    console.log('submitting')
  }

  render() {
    return (
      <div className="App">
        <h4>1. Upload an image</h4>
        <input type="file" onChange={this.previewImage.bind(this)} /><br /><br />
        <img src={this.state.imgUrl} style={{maxWidth: '400px', maxHeight: '400px'}} />

        <h4>2. Ask a question</h4>
        <input style={{width: '400px'}} type="text" placeholder="Enter a question" value={this.state.question} onChange={e => this.setState({question: e.target.value})} />

        <br /><br />
        <button onClick={this.handleSubmit.bind(this)}>Submit</button>
      </div>
    );
  }
}

export default App;

import React, { Component } from 'react';
import request from 'superagent'
import logo from './logo.svg';
import './App.css';

class App extends Component {
  state = {
    img: '',
    imgUrl: '',
    question: '',
    isLoading: false,
    answers: [],
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
    console.log(this.state.img)
    this.setState({ isLoading: true })

    request
      .post('http://ec2-34-220-163-4.us-west-2.compute.amazonaws.com/')
      .attach('image', this.state.img)
      .field('question', this.state.question)
      .then((res) => {
        console.log(res)
        this.setState({ answers: res.body.pred, isLoading:false })
      })
      .catch((err) => {
        this.setState({ isLoading:false })
        console.log(err)
      })
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
        
        {this.state.isLoading && <p>Computing...</p>}
        {this.state.answers.length>0 && <h4>Predicted answers:</h4>}
        {this.state.answers.map((v, k) =>
          <div key={k}>
            {v[0]}
            <div className="pbar" style={{width: Math.round(v[1]*400)+'px'}}>{v[1]*100}%</div>
          </div>
        )}
      </div>
    );
  }
}

export default App;

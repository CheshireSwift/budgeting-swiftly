import React, { Component } from 'react'
import {AccountProvider, AccountInfo} from './Account'
import logo from './logo.svg'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      token: undefined
    }
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <div style={{ position: 'absolute', right: '1em' }}>
            <input ref={c => this.tokenField = c} type="text" />
            <button onClick={() => this.setState({ token: this.tokenField.value }) }>Go</button>
          </div>
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <AccountProvider token={this.state.token}>
          <AccountInfo></AccountInfo>
        </AccountProvider>
      </div>
    )
  }
}

export default App

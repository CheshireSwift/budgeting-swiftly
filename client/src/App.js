import React, { Component } from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import {AccountProvider, AccountInfo} from './Account'

import './App.css'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      token: undefined
    }

    fetch('/api/test').then(x => console.log(x))
  }

  render() {
    return (
      <MuiThemeProvider>
        <div className="App">
          <div className="App-header">
            <div style={{ position: 'absolute', right: '1em' }}>
              <input ref={c => this.tokenField = c} type="text" />
              <button onClick={() => this.setState({ token: this.tokenField.value }) }>Go</button>
            </div>
            <img src="https://monzo.com/static/images/favicon.png" className="App-logo" alt="logo" />
            <h2>Budgeting, Swiftly</h2>
          </div>
          <AccountProvider token={this.state.token}>
            <AccountInfo></AccountInfo>
          </AccountProvider>
        </div>
      </MuiThemeProvider>
    )
  }
}

export default App

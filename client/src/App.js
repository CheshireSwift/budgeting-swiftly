import React, { Component } from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import {AccountProvider, AccountInfo} from './Account'

import logo from './nounswift_invert.png'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <MuiThemeProvider>
        <div className="App">
          <div className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1>
              Budgeting, Swiftly
            </h1>
          </div>
          <AccountProvider>
            <AccountInfo></AccountInfo>
          </AccountProvider>
          Logo is Bird by Artem  Kovyazin from the Noun Project (modified)
          <button onClick={() => fetch('/api/test').then(x => console.log(x))}/>
        </div>
      </MuiThemeProvider>
    )
  }
}

export default App

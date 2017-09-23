import React, { Component } from 'react'
import _ from 'lodash'
import logo from './logo.svg'
import './App.css'

const MONZO_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjaSI6Im9hdXRoY2xpZW50XzAwMDA5NFB2SU5ER3pUM2s2dHo4anAiLCJleHAiOjE1MDYyMjU3MjksImlhdCI6MTUwNjIwNDEyOSwianRpIjoidG9rXzAwMDA5T3AwbmFjSFVQNE5VajNyVW4iLCJ1aSI6InVzZXJfMDAwMDlHeEphYURlam1sWHVGak4xViIsInYiOiIyIn0.EsveqDsBB3fnnpAYqXz0AHKHIC-enJ49PrAzXgo5NjE'

const AUTH_HEADERS = new Headers({
  'authorization': 'Bearer ' + MONZO_TOKEN
})

const LOADING = <div><img src={logo} className="App-logo" alt="logo" /></div>

function monzoUrl(endpoint) {
  return `https://api.monzo.com/${endpoint}`
}

function getAccounts() {
  return fetch(monzoUrl('accounts'), { headers: AUTH_HEADERS })
    .then(res => res.json())
    .catch(e => e)
}

function getAccount(accountId) {
  return fetch(monzoUrl('transactions') + '?account_id=' + accountId, {headers: AUTH_HEADERS})
    .then(res => res.json())
    .catch(e => e)
}

export class AccountProvider extends Component {
  constructor(props) {
    super(props)
    this.load = this.load.bind(this)
    this.state = {
      accounts: undefined
    }
  }

  load() {
    getAccounts().then(response => {
      console.log(response)
      this.setState({accounts: response.accounts})
    })
  }

  render() {
    if (!this.state.accounts) {
      this.load()
      return LOADING
    }

    return (
      <div>
        {_.map(this.state.accounts, account =>
          <div>
            <hr />
            {React.cloneElement(this.props.children, {key: account.id, account})}
          </div>
        )}
      </div>
    )
  }
}

export class AccountInfo extends Component {
  constructor(props) {
    super(props)
    this.load = this.load.bind(this)
    this.state = {
      account: undefined
    }
  }

  load(account) {
    getAccount(account.id).then(response => {
      this.setState({account: response.transactions})
    })
  }

  render() {
    if (!this.state.account) {
      this.load(this.props.account)
      return LOADING
    }

    return (
      //<pre>{JSON.stringify(this.state.account, null, 2)}</pre>
      <table style={{textAlign: 'left'}}>
        {_.map(this.state.account, x => (
          <tr>
            <td>{x.description}</td>
            <td>{x.amount}</td>
          </tr>
        ))}
      </table>
    )
  }
}

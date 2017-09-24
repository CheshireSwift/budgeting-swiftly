import React, { Component } from 'react'
import _ from 'lodash'
import logo from './logo.svg'
import './App.css'
import { listAccounts, listTransactions } from './monzo'

const LOADING = <div><img src={logo} className="App-logo" alt="logo" /></div>

export class AccountProvider extends Component {
  constructor(props) {
    super(props)
    this.selectAccount = this.selectAccount.bind(this)
    this.state = {
      token: undefined,
      accounts: undefined,
      selectedAccount: undefined
    }
  }

  load() {
    listAccounts(this.state.token).then(response => {
      this.setState({accounts: _.keyBy(response.accounts, 'id')})
    })
  }

  selectAccount(e) {
    this.setState({
      selectedAccount: this.state.accounts[e.currentTarget.value]
    })
  }

  accountPicker() {
    const accountOptions = _.map(this.state.accounts, account =>
      <option key={account.id} value={account.id}>
        {account.description} (created {account.created})
      </option>
    )

    return (
      <select onChange={this.selectAccount}>
        <option value={undefined}>Account</option>
        {accountOptions}
      </select>
    )
  }

  render() {
    if (!this.state.token) {
      return (
        <div>
          <input ref={c => this.tokenField = c} type="text" />
          <button onClick={() => this.setState({ token: this.tokenField.value }) }>Go</button>
      </div>
      )
    }

    if (!this.state.accounts) {
      this.load()
      return LOADING
    }

    if (!this.state.selectedAccount) {
      return (
        <div>
          {this.accountPicker()}
        </div>
      )
    }

    return (
      <div>{
        React.cloneElement(this.props.children, {
          account: this.state.selectedAccount,
          token: this.state.token
        })
      }</div>
    )
  }
}

export class AccountInfo extends Component {
  constructor(props) {
    super(props)
    this.state = {
      transactions: undefined
    }
  }

  load(accountId) {
    listTransactions(this.props.token, accountId).then(response => {
      this.setState({transactions: response.transactions})
    })
  }

  render() {
    if (!this.state.transactions) {
      this.load(this.props.account.id)
      return LOADING
    }

    return (
      //<pre>{JSON.stringify(this.state.account, null, 2)}</pre>
      <table style={{textAlign: 'left'}}>
        <tbody>
          {_.map(this.state.transactions, transaction => (
            <tr key={transaction.id}>
              <td>{transaction.description}</td>
              <td>{transaction.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  }
}

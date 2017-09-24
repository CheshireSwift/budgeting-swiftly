import React, { Component } from 'react'
import _ from 'lodash'
import numeral from 'numeral'

import { listAccounts, listTransactions } from './monzo'

import logo from './logo.svg'
import './App.css'

const LOADING = <div><img src={logo} className="App-logo" alt="logo" /></div>

export class AccountProvider extends Component {
  constructor(props) {
    super(props)
    this.selectAccount = this.selectAccount.bind(this)
    this.state = {
      accounts: undefined,
      selectedAccount: undefined
    }
  }

  load() {
    listAccounts(this.props.token).then(response => {
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
    if (!this.props.token) {
      return <div />
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
          token: this.props.token
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
      const transactions = response.transactions
      const transactionsByCategory = _.groupBy(transactions, 'category')
      const allCategories = _(transactionsByCategory).mapValues(transactions => -_.sumBy(transactions, 'amount'))
      const topup = -allCategories.get('mondo')
      const categories = allCategories.omit('mondo').value()
      this.setState({
        transactions,
        categories,
        topup
      })
    })
  }

  render() {
    if (!this.props.token) {
      return <div />
    }

    if (!this.state.transactions) {
      this.load(this.props.account.id)
      return LOADING
    }

    return (
      <div style={{ textAlign: 'left' }}>
        <table style={{ margin: 'auto' }}>
          <tbody>
            {_.map(this.state.categories, (amount, category) => (
              <tr key={category}>
                <td>{category}</td>
                <td style={{ textAlign: 'right' }}>{numeral(amount/100).format('0,0.00')}</td>
                <td style={{ width: 420, border: '1px solid black' }}>
                  <div style={{
                    width: (amount * 100 / this.state.topup) + '%',
                    height: 20,
                    backgroundColor: _.cond([
                      [x => x > 0.8, _.constant('red')],
                      [x => x > 0.6, _.constant('orange')],
                      [_.stubTrue,   _.constant('lime')]
                    ])(amount/this.state.topup)
                  }}>{_.repeat('|', amount * 100 / this.state.topup)}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/*<table>
          <tbody>
            {_.map(this.state.transactions, transaction => (
              <tr key={transaction.id}>
                <td>{transaction.description}</td>
                <td>{transaction.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>*/}
      </div>
    )
  }
}

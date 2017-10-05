import React, { Component } from 'react'
import { LinearProgress, List, ListItem, Divider } from 'material-ui'

import DeviceAccessTime from 'material-ui/svg-icons/device/access-time'
import ImageTimelapse from 'material-ui/svg-icons/image/timelapse'
import MapsDirectionsTransit from 'material-ui/svg-icons/maps/directions-transit'
import MapsLocalDining from 'material-ui/svg-icons/maps/local-dining'
import MapsRestaurant from 'material-ui/svg-icons/maps/restaurant'
import MapsFlight from 'material-ui/svg-icons/maps/flight'
import MapsStoreMallDirectory from 'material-ui/svg-icons/maps/store-mall-directory'
import MapsLocalMovies from 'material-ui/svg-icons/maps/local-movies'
import MapsLocalAtm from 'material-ui/svg-icons/maps/local-atm'
import MapsLocalMall from 'material-ui/svg-icons/maps/local-mall'
import MapsLocalOffer from 'material-ui/svg-icons/maps/local-offer'

import _ from 'lodash'
import numeral from 'numeral'
import numeralen from "numeral/locales/en-gb"

import { listAccounts, listTransactions } from './monzo'

import logo from './logo.svg'
import './Account.css'

numeral.locale('en-gb')

const LOADING = <div><img src={logo} className="App-logo" alt="logo" /></div>

const emoji = _.mapValues({
  uk_prepaid: 0x1F45B,
  uk_retail: 0x1F3E6,
  transport: 0x1F686,
  eating_out: 0x1F35B,
  holidays: 0x1F334,
  groceries: 0x1F6D2,
  entertainment: 0x1F3AE,
  cash: 0x1F4B8,
  shopping: 0x1F48E,
  general: 0x1F516
}, cp => String.fromCodePoint(cp))

const content = {
  transport: 'Transport',
  eating_out: 'Eating Out',
  holidays: 'Holidays',
  groceries: 'Groceries',
  entertainment: 'Entertainment',
  cash: 'Cash',
  shopping: 'Shopping',
  general: 'General',
  total: 'Total'
}

const limits = {
  transport: 10500,
  eating_out: 57500,
  holidays: 500,
  groceries: 5500,
  entertainment: 9000,
  cash: 3000,
  shopping: 3500,
  general: 2500,
  total: 92000
}

const icons = {
  transport: <MapsDirectionsTransit />,
  eating_out: <MapsRestaurant />,
  holidays: <MapsFlight />,
  groceries: <MapsStoreMallDirectory />,
  entertainment: <MapsLocalMovies />,
  cash: <MapsLocalAtm />,
  shopping: <MapsLocalMall />,
  general: <MapsLocalOffer />,
  total: <ImageTimelapse />
}

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
        {emoji[account.type]} {account.description} (created {account.created})
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

  listItem(amount, category) {
    const progressColour = _.cond([
      [x => x > 1.0,  _.constant('red')],
      [x => x > 4/31, _.constant('orange')],
      [_.stubTrue,    _.constant('lime')]
    ])

    const limit = limits[category]
    const formattedAmount = numeral(amount/100).format('$0,0')
    const formattedLimit = numeral(limit/100).format('$0,0')
    const text = `${content[category]} - ${formattedAmount} (${formattedLimit})`
    return (
      <ListItem
        key={category}
        leftIcon={icons[category]}
        primaryText={text}
        secondaryText={
          <LinearProgress
            mode="determinate"
            value={amount}
            max={limit}
            color={progressColour(amount/limit)}
          />
        }
      />
    )
  }

  render() {
    if (!this.props.token) {
      return <div />
    }

    if (!this.state.transactions) {
      this.load(this.props.account.id)
      return LOADING
    }

    const total = _(this.state.categories).values().sum()
    return (
      <div style={{ textAlign: 'left', fontSize: 'x-large' }}>
        <List style={{ margin: 'auto', width: '90%' }}>
          <ListItem leftIcon={<DeviceAccessTime />} secondaryText={<LinearProgress mode="determinate" value={4} max={31} />} />
          <Divider />
          {_.map(this.state.categories, this.listItem)}
          <Divider />
          {this.listItem(total, 'total')}
        </List>
      </div>
    )
  }
}

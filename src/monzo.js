import _ from 'lodash'

function request(token, endpoint, queryParams) {
  if (!token) {
    return Promise.reject('No token')
  }

  const queryString = queryParams
    ? `?${_.map(queryParams, (value, key) => `${key}=${value}`).join('&')}`
    : ''
  const url = `https://api.monzo.com/${endpoint}${queryString}`
  const headers = new Headers({ authorization: `Bearer ${token}` })

  return fetch(url, { headers }).then(res => res.json())
}

export function listAccounts(token) {
  return request(token, 'accounts')
}

export function listTransactions(token, accountId) {
  // TODO actual date
  return request(token, 'transactions', { account_id: accountId, since: '2017-09-01' })
}

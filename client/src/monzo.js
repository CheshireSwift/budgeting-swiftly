export function listAccounts() {
  return fetch('/api/accounts', {credentials: 'include'}).then(res => res.json())
}

export function listTransactions(accountId) {
  // TODO actual date
  return fetch('/api/transactions/' + accountId, {credentials: 'include'}).then(res => res.json())
  //return request(token, 'transactions', { account_id: accountId, since: '2017-10-01', before: '2017-11-01' })
}

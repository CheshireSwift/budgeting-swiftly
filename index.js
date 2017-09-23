const MONZO_TOKEN='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjaSI6Im9hdXRoY2xpZW50XzAwMDA5NFB2SU5ER3pUM2s2dHo4anAiLCJleHAiOjE1MDYyMjU3ImlhdCI6MTUwNjIwNDEyOSwianRpIjoidG9rXzAwMDA5T3AwbmFjSFVQNE5VajNyVW4iLCJ1aSI6InVzZXJfMDAwMDlHeEphYURlam1sWHVGak4xViIsInYiOiIyIn0.EsveqDsBB3fnnpAYqXz0AHKHIC-enJ49PrAzXgo5NjE'

const accounts = await fetch('https://api.monzo.com/accounts', {
  method: 'GET',
  headers: new Headers({
    'Authorization': 'Bearer ' + MONZO_TOKEN
  })
}).then(res => res.json())

console.log(accounts)

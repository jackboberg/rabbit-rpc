const Client = require('./lib/client')
const Server = require('./lib/server')

module.exports = (url, opts) => ({
  client: Client(url, opts),
  server: Server(url, opts)
})

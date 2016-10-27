const Client = require('./lib/client')
const Server = require('./lib/server')

module.exports = function RPC (url, opts) {
  return {
    client: Client(url, opts),
    server: Server(url, opts)
  }
}

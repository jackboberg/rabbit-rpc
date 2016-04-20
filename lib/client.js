const Consumer = require('./consumer')
const Sender = require('./sender')

module.exports = function (conn, ch) {
  return {
    send: Sender(conn, ch),
    consume: Consumer(conn, ch),
    close: () => conn.close()
  }
}

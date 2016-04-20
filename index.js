const Amqp = require('amqplib/callback_api')
const Client = require('./lib/client')

function nextTick (cb, err, val) {
  process.nextTick(() => cb(err, val))
}

module.exports = function (opts, done) {
  Amqp.connect(opts, (err, conn) => {
    if (err) return nextTick(done, err)

    conn.createChannel((err, ch) => {
      if (err) return nextTick(done, err)

      done(null, Client(conn, ch))
    })
  })
}

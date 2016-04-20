const Uuid = require('uuid')

module.exports = function sender (conn, ch) {
  return function (queue, data, done) {
    ch.assertQueue('', { exclusive: true }, (err, q) => {
      var corr, opts

      if (err) return done(err)

      corr = Uuid.v4()
      opts = { correlationId: corr, replyTo: q.queue }

      function handleReply (msg) {
        if (msg.properties.correlationId !== corr) return

        if (msg.properties.type === 'error') done(msg)
        else done(null, msg)
      }

      ch.consume(q.queue, handleReply, { noAck: true })
      ch.sendToQueue(queue, data, opts)
    })
  }
}

module.exports = function consumer (conn, ch) {
  return function (queue, worker) {
    ch.assertQueue(queue, { durable: false })
    ch.prefetch(1) // TODO make configurable
    ch.consume(queue, (msg) => {
      var opts, replyTo

      opts = { correlationId: msg.properties.correlationId }
      replyTo = msg.properties.replyTo

      worker(msg.content, (err, result) => {
        if (err) {
          opts.type = 'error'
          ch.nack(msg)
          ch.sendToQueue(replyTo, err, opts)
        } else {
          ch.sendToQueue(replyTo, result, opts)
          ch.ack(msg)
        }
      })
    })
  }
}

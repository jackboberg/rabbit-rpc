const Amqp = require('amqplib/callback_api')

function nextTick (cb, err, val) {
  process.nextTick(() => cb(err, val))
}

function generateUuid () {
  return Math.random().toString() +
         Math.random().toString() +
         Math.random().toString()
}

function sender (conn, ch) {
  return function (queue, data, done) {
    ch.assertQueue('', { exclusive: true }, (err, q) => {
      var corr, opts

      if (err) return done(err)

      corr = generateUuid()
      opts = { correlationId: corr, replyTo: q.queue }

      function handleReply (msg) {
        if (msg.properties.correlationId === corr) done(null, msg)
      }

      ch.consume(q.queue, handleReply, { noAck: true })
      ch.sendToQueue(queue, data, opts)
    })
  }
}

function consumer (conn, ch) {
  return function (queue, worker) {
    ch.assertQueue(queue, { durable: false })
    ch.prefetch(1) // TODO make configurable
    ch.consume(queue, (msg) => {
      var opts, replyTo

      opts = { correlationId: msg.properties.correlationId }
      replyTo = msg.properties.replyTo

      worker(msg.content, (err, result) => {
        if (err) return // TODO the worker errored, respond? ack?

        ch.sendToQueue(replyTo, result, opts)
        ch.ack(msg)
      })
    })
  }
}

function client (conn, ch) {
  return {
    send: sender(conn, ch),
    consume: consumer(conn, ch),
    close: () => conn.close()
  }
}

module.exports = function (opts, done) {
  Amqp.connect(opts, (err, conn) => {
    if (err) return nextTick(done, err)

    conn.createChannel((err, ch) => {
      if (err) return nextTick(done, err)

      done(null, client(conn, ch))
    })
  })
}

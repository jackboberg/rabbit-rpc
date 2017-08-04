const Channel = require('@jackrabbit/channel')
const SerializeError = require('serialize-error')

module.exports = (url, opts) => (queue, worker, capacity) => {
  Channel(url, opts, (err, ch, conn) => {
    if (err) throw err

    ch.assertQueue(queue, { durable: false })
    ch.prefetch(capacity || 1)
    ch.consume(queue, (message) => {
      // TODO try/catch
      const data = JSON.parse(message.content.toString())
      const sendOpts = { correlationId: message.properties.correlationId }
      const replyTo = message.properties.replyTo

      // TODO expect args for .apply()
      worker(data, (err, result) => {
        if (err) {
          sendOpts.type = 'error'
          result = SerializeError(err)
        }

        ch.sendToQueue(replyTo, Buffer.from(JSON.stringify(result)), sendOpts)
        ch.ack(message)
      })
    })
  })
}

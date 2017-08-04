const Channel = require('@jackrabbit/channel')
const { v4 } = require('uuid')

module.exports = (url, opts) => (queue, data, done) => {
  Channel(url, opts, (err, ch, conn) => {
    if (err) return done(err)

    const close = (err, result) => {
      conn.close()
      done(err, result)
    }

    ch.on('error', done)
    ch.assertQueue('', { exclusive: true }, (err, { queue: replyTo }) => {
      if (err) return done(err)

      const corr = v4()
      const replyOpts = { correlationId: corr, replyTo }

      const handleReply = ({ properties, content }) => {
        if (properties.correlationId !== corr) return

        // TODO try/catch
        const result = JSON.parse(content.toString())

        if (properties.type === 'error') close(result)
        else close(null, result)
      }

      ch.consume(replyTo, handleReply, { noAck: true })
      ch.sendToQueue(queue, Buffer.from(JSON.stringify(data)), replyOpts)
    })
  })
}

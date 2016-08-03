const Channel = require('@modulus/rabbit-channel');
const SerializeError = require('serialize-error');

module.exports = function Server(url, opts) {
  return function (queue, worker, capacity) {
    Channel(url, opts, function (err, ch, conn) {
      if (err) throw err;

      ch.assertQueue(queue, { durable: false });
      ch.prefetch(capacity || 1);
      ch.consume(queue, function (msg) {
        var data, sendOpts, replyTo;

        // TODO try/catch
        data = JSON.parse(msg.content.toString());
        sendOpts = { correlationId: msg.properties.correlationId };
        replyTo = msg.properties.replyTo;

        // TODO expect args for .apply()
        worker(data, function (err, result) {
          if (err) {
            sendOpts.type = 'error';
            result = SerializeError(err);
          }

          ch.sendToQueue(replyTo, new Buffer(JSON.stringify(result)), sendOpts);
          ch.ack(msg);
        });
      });
    });
  };
};

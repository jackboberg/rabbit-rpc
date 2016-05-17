const Channel = require('./channel');

module.exports = function Server(url, opts) {
  return function (queue, worker, capacity) {
    Channel(url, opts, function (err, ch, conn) {
      if (err) throw err;

      ch.assertQueue(queue, { durable: false });
      ch.prefetch(capacity || 1);
      ch.consume(queue, function (msg) {
        var data, opts, replyTo;

        // TODO try/catch
        data = JSON.parse(msg.content.toString());
        opts = { correlationId: msg.properties.correlationId };
        replyTo = msg.properties.replyTo;

        // TODO expect args for .apply()
        worker(data, function (err, result) {
          if (err) opts.type = 'error', result = err;

          ch.sendToQueue(replyTo, new Buffer(JSON.stringify(result)), opts);
          ch.ack(msg);
        });
      });
    });
  };
};

const Amqp = require('amqplib/callback_api');

module.exports = function Channel(url, opts, done) {
  Amqp.connect(url, opts, function (err, conn) {
    if (err) return done(err);

    conn.createChannel(function (err, ch) {
      if (err) return done(err);

      done(null, ch, conn);
    });
  });
};

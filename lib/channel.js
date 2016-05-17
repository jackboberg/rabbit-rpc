const Amqp = require('amqplib/callback_api');

module.exports = function Channel(url, opts, done) {
  Amqp.connect(url, opts, (err, conn) => {
    if (err) return done(err);

    conn.createChannel((err, ch) => {
      if (err) return done(err);

      done(null, ch, conn);
    });
  });
};

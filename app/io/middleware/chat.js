'use strict';

module.exports = () => {
  return async (ctx, next) => {
    const { socket } = ctx;
    // const id = socket.id;
    // const nsp = app.io.of('/chatroom');

    socket.join('md-chat-room');

    await next();
  };
};

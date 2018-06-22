'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, io } = app;

  // ------------- WebSocket ---------------------------------------

  io.of('/p2p').route('exchange', io.controller.nsp.exchange);
  io.of('/chatroom').route('sendmsg', io.controller.nsp.sendMessage);

  // ------------- Web API -----------------------------------------

  router.prefix(`/${app.name}`);

  // 不需登录
  router.post('/login', controller.uac.login);
  router.post('/logout', controller.uac.logout);
  router.post('/register', controller.uac.register);

  // 需登录
  router.get('/u/cart', controller.uac.cart);
};

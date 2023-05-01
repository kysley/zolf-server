import dotenv from 'dotenv';
dotenv.config();
import {GolfPlayer} from './entities/Player';
import {RoundController} from './controllers/RoundController';
import {harbourTown} from './stubs';
import {golfer} from './redis/golfer';

import fastifyServer from 'fastify';
import {fastifyTRPCPlugin} from '@trpc/server/adapters/fastify';
import cors from '@fastify/cors';
import socketioServer from 'fastify-socket.io';
import fastifyCookie from '@fastify/cookie';
import fastifyJwt from '@fastify/jwt';

// import {router} from './router';
// import {createContext} from './context';
// import {createPredictionListener} from './plugins/prediction-listener';

const fastify = fastifyServer();
fastify.register(cors, {
  // put your options here
  origin: 'http://localhost:5173',
  credentials: true,
});

fastify.register(fastifyCookie, {
  secret: process.env.SJ_JWT || 'gg',
});

fastify.register(fastifyJwt, {
  secret: process.env.SJ_JWT || 'gg',
  cookie: {
    cookieName: 'token',
    signed: true,
  },
});

// fastify.register(fastifyTRPCPlugin, {
//   prefix: '/trpc',
//   trpcOptions: {
//     router,
//     createContext,
//   },
// });

fastify.register(socketioServer, {
  cors: {
    origin: 'http://localhost:5173',
    credentials: true,
    allowedHeaders: ['token'],
  },
  // cookie: {
  //   name: "token",
  //   httpOnly: true,
  // },
});

fastify.get('/', (req, res) => {
  res.code(200).send('yo');
});

(async () => {
  try {
    fastify.ready((e) => {
      if (e) throw e;
      console.log('ready');

      // fastify.io.use((socket, next) => {
      //   console.log(socket.handshake.headers.cookie);
      //   next();
      // });
      const roundController = new RoundController(
        [
          new GolfPlayer('P1'),
          new GolfPlayer('P2'),
          new GolfPlayer('P3'),
          new GolfPlayer('P4'),
          new GolfPlayer('P5'),
        ],
        fastify.io,
      );
      roundController.playRound();
      fastify.io.on('connection', (socket) => {
        let roomName: string;
        // Can't seem to verify the cookie outside of fastify context
        // const cookie = socket.handshake.headers.cookie;
        // // No cookie? we want OUT
        // if (!cookie) return;

        // // const { token } = fastify.parseCookie(cookie);
        // const token = cookie.split("=")[1];
        // if (!token) return;

        // if the user has a socket session
        // get the user from the session

        // verify that the socket session 1. is the same as the room or 2. is allowed to be in the room

        console.log('connection');
        socket.on('round-spectate', (roundId) => {
          // if (roomName) {
          //   console.log(roomName);
          //   fastify.io.to(roomName).emit('update', state);
          // }
          socket.join(roundId);
        });

        socket.on('disconnect', () => {
          console.log('socket disconnect');
          console.log('TODO: remove socket session');
        });
      });
    });
    // Setting host for node 19 fix
    await fastify.listen({port: 3000, host: '0.0.0.0'});
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
})();

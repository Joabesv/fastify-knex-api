import fastify from 'fastify';

const app = fastify();

app.get('/', () => {
  return 'hello man';
});

app.listen({ port: 5000 }).then(() => {
  console.log('pai ta de pé');
});

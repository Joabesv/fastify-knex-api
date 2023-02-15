import { app } from './app';
import { config } from './models/schema/env.schema';

app.listen({ port: config.PORT }).then(() => {
  console.log('pai ta de pé');
});

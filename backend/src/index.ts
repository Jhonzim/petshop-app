import 'dotenv/config';
import app from './app';

const port = process.env.PORT ? Number(process.env.PORT) : 3000;

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`🚀 PetBuddy Catalog API rodando em http://localhost:${port}`);
});

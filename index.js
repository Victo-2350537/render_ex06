import express from 'express';
import dotenv from 'dotenv';
import pokemonRoutes from './src/routes/pokemon.route.js';
import { swaggerUi, swaggerSpec } from './src/docs/swagger.js';


dotenv.config();
const app = express();
app.use(express.json());

app.use('/api', pokemonRoutes);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));

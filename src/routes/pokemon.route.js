import express from 'express';
import PokemonController from '../controllers/pokemon.controller.js';
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Pokemon:
 *       type: object
 *       required:
 *         - nom
 *         - type_primaire
 *         - pv
 *         - attaque
 *         - defense
 *       properties:
 *         id:
 *           type: integer
 *           description: ID auto-généré du pokemon
 *         nom:
 *           type: string
 *           description: Nom du pokemon
 *         type_primaire:
 *           type: string
 *           description: Type primaire du pokemon
 *         type_secondaire:
 *           type: string
 *           description: Type secondaire du pokemon (optionnel)
 *           nullable: true
 *         pv:
 *           type: integer
 *           description: Points de vie du pokemon
 *         attaque:
 *           type: integer
 *           description: Points d'attaque du pokemon
 *         defense:
 *           type: integer
 *           description: Points de défense du pokemon
 *       example:
 *         id: 1
 *         nom: "Bulbasaur"
 *         type_primaire: "Grass"
 *         type_secondaire: "Poison"
 *         pv: 45
 *         attaque: 49
 *         defense: 49
 */

/**
 * @swagger
 * tags:
 *   name: Pokemons
 *   description: API pour gérer les pokemons
 */

/**
 * @swagger
 * /api/pokemons/liste:
 *   get:
 *     tags: [Pokemons]
 *     summary: Récupère une liste paginée de Pokémon
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Numéro de la page (25 pokemons par page)
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [Normal, Fire, Water, Electric, Grass, Ice, Fighting, Poison, Ground, Flying, Psychic, Bug, Rock, Ghost, Dragon, Dark, Steel, Fairy]
 *         description: Filtrer les pokemons par type primaire
 *     responses:
 *       200:
 *         description: Liste des Pokémon
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 pokemons:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Pokemon'
 *                 type:
 *                   type: string
 *                 nombrePokemonTotal:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *             example:
 *               pokemons: [
 *                 {
 *                   id: 1,
 *                   nom: "Bulbasaur",
 *                   type_primaire: "Grass",
 *                   type_secondaire: "Poison",
 *                   pv: 45,
 *                   attaque: 49,
 *                   defense: 49
 *                 }
 *               ]
 *               type: "Grass"
 *               nombrePokemonTotal: 1
 *               page: 1
 *               totalPages: 1
 *       400:
 *         description: Numéro de page invalide
 *         content:
 *           application/json:
 *             example:
 *               erreur: "Numéro de page invalide"
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             example:
 *               erreur: "Echec lors de la récupération de la liste des pokemons"
 */
router.get('/pokemons/liste', PokemonController.getAllPokemons);

/**
 * @swagger
 * /api/pokemons/{id}:
 *   get:
 *     tags: [Pokemons]
 *     summary: Récupère un Pokémon par son ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du Pokémon
 *     responses:
 *       200:
 *         description: Détails du Pokémon
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pokemon'
 *             example:
 *               id: 1
 *               nom: "Bulbasaur"
 *               type_primaire: "Grass"
 *               type_secondaire: "Poison"
 *               pv: 45
 *               attaque: 49
 *               defense: 49
 *       404:
 *         description: Pokémon non trouvé
 *         content:
 *           application/json:
 *             example:
 *               erreur: "Pokemon introuvable avec l'id 1"
 *       400:
 *         description: ID invalide
 *         content:
 *           application/json:
 *             example:
 *               erreur: "ID invalide"
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             example:
 *               erreur: "Echec lors de la récupération du pokemon avec l'id 1"
 */
router.get('/pokemons/:id', PokemonController.getPokemonById);

/**
 * @swagger
 * /api/pokemons:
 *   post:
 *     tags: [Pokemons]
 *     summary: Ajoute un nouveau Pokémon
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Pokemon'
 *           example:
 *             nom: "Bulbasaur"
 *             type_primaire: "Grass"
 *             type_secondaire: "Poison"
 *             pv: 45
 *             attaque: 49
 *             defense: 49
 *     responses:
 *       201:
 *         description: Pokémon ajouté avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 pokemon:
 *                   $ref: '#/components/schemas/Pokemon'
 *             example:
 *               message: "Le pokemon Bulbasaur a été ajouté avec succès"
 *               pokemon:
 *                 id: 1
 *                 nom: "Bulbasaur"
 *                 type_primaire: "Grass"
 *                 type_secondaire: "Poison"
 *                 pv: 45
 *                 attaque: 49
 *                 defense: 49
 *       400:
 *         description: Données invalides
 *         content:
 *           application/json:
 *             example:
 *               erreur: "Le format des données est invalide"
 *               champ_manquant: ["nom", "type_primaire"]
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             example:
 *               erreur: "Echec lors de la création du pokemon Bulbasaur"
 */
router.post('/pokemons', PokemonController.addPokemon);

/**
 * @swagger
 * /api/pokemons/{id}:
 *   put:
 *     tags: [Pokemons]
 *     summary: Modifie un Pokémon existant
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du Pokémon à modifier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Pokemon'
 *           example:
 *             nom: "Bulbasaur"
 *             type_primaire: "Grass"
 *             type_secondaire: "Poison"
 *             pv: 45
 *             attaque: 49
 *             defense: 49
 *     responses:
 *       200:
 *         description: Pokémon modifié avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 pokemon:
 *                   $ref: '#/components/schemas/Pokemon'
 *             example:
 *               message: "Le pokemon id 1 a été modifié avec succès"
 *               pokemon:
 *                 id: 1
 *                 nom: "Bulbasaur"
 *                 type_primaire: "Grass"
 *                 type_secondaire: "Poison"
 *                 pv: 45
 *                 attaque: 49
 *                 defense: 49
 *       404:
 *         description: Pokémon non trouvé
 *         content:
 *           application/json:
 *             example:
 *               erreur: "Le pokemon id 1 n'existe pas dans la base de données"
 *       400:
 *         description: Données invalides
 *         content:
 *           application/json:
 *             example:
 *               erreur: "Le format des données est invalide"
 *               champ_manquant: ["nom", "type_primaire"]
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             example:
 *               erreur: "Echec lors de la modification du pokemon Bulbasaur"
 */
router.put('/pokemons/:id', PokemonController.updatePokemon);

/**
 * @swagger
 * /api/pokemons/{id}:
 *   delete:
 *     tags: [Pokemons]
 *     summary: Supprime un Pokémon
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du Pokémon à supprimer
 *     responses:
 *       200:
 *         description: Pokémon supprimé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 pokemon:
 *                   $ref: '#/components/schemas/Pokemon'
 *             example:
 *               message: "Le pokemon id 1 a été supprimé avec succès"
 *               pokemon:
 *                 id: 1
 *                 nom: "Bulbasaur"
 *                 type_primaire: "Grass"
 *                 type_secondaire: "Poison"
 *                 pv: 45
 *                 attaque: 49
 *                 defense: 49
 *       404:
 *         description: Pokémon non trouvé
 *         content:
 *           application/json:
 *             example:
 *               erreur: "Le pokemon id 1 n'existe pas dans la base de données"
 *       400:
 *         description: ID invalide
 *         content:
 *           application/json:
 *             example:
 *               erreur: "ID invalide"
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             example:
 *               erreur: "Echec lors de la suppression du pokemon id 1"
 */
router.delete('/pokemons/:id', PokemonController.deletePokemon);

export default router;
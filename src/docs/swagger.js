import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Pokemon API',
            version: '1.0.0',
            description: 'API pour gérer une base de données de Pokémon'
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Serveur de développement'
            }
        ],
        components: {
            schemas: {
                Pokemon: {
                    type: 'object',
                    required: ['nom', 'type_primaire', 'pv', 'attaque', 'defense'],
                    properties: {
                        id: {
                            type: 'integer',
                            description: 'ID unique du Pokémon',
                            example: 1
                        },
                        nom: {
                            type: 'string',
                            description: 'Nom du Pokémon',
                            example: 'Bulbasaur'
                        },
                        type_primaire: {
                            type: 'string',
                            description: 'Type primaire du Pokémon',
                            enum: ['Normal', 'Fire', 'Water', 'Electric', 'Grass', 'Ice', 
                                  'Fighting', 'Poison', 'Ground', 'Flying', 'Psychic', 
                                  'Bug', 'Rock', 'Ghost', 'Dragon', 'Dark', 'Steel', 'Fairy'],
                            example: 'Grass'
                        },
                        type_secondaire: {
                            type: 'string',
                            nullable: true,
                            description: 'Type secondaire du Pokémon (optionnel)',
                            enum: ['Normal', 'Fire', 'Water', 'Electric', 'Grass', 'Ice', 
                                  'Fighting', 'Poison', 'Ground', 'Flying', 'Psychic', 
                                  'Bug', 'Rock', 'Ghost', 'Dragon', 'Dark', 'Steel', 'Fairy', null],
                            example: 'Poison'
                        },
                        pv: {
                            type: 'integer',
                            description: 'Points de vie du Pokémon',
                            minimum: 1,
                            example: 45
                        },
                        attaque: {
                            type: 'integer',
                            description: 'Points d\'attaque du Pokémon',
                            minimum: 1,
                            example: 49
                        },
                        defense: {
                            type: 'integer',
                            description: 'Points de défense du Pokémon',
                            minimum: 1,
                            example: 49
                        }
                    }
                },
                Error: {
                    type: 'object',
                    properties: {
                        erreur: {
                            type: 'string',
                            description: 'Message d\'erreur'
                        },
                        champ_manquant: {
                            type: 'array',
                            items: {
                                type: 'string'
                            },
                            description: 'Liste des champs manquants ou invalides'
                        }
                    },
                    example: {
                        erreur: "Le format des données est invalide",
                        champ_manquant: ["nom", "type_primaire"]
                    }
                },
                PaginatedResponse: {
                    type: 'object',
                    properties: {
                        pokemons: {
                            type: 'array',
                            items: {
                                $ref: '#/components/schemas/Pokemon'
                            }
                        },
                        type: {
                            type: 'string',
                            description: 'Type filtré (si applicable)'
                        },
                        nombrePokemonTotal: {
                            type: 'integer',
                            description: 'Nombre total de Pokémon'
                        },
                        page: {
                            type: 'integer',
                            description: 'Page actuelle'
                        },
                        totalPages: {
                            type: 'integer',
                            description: 'Nombre total de pages'
                        }
                    }
                }
            }
        }
    },
    apis: ['./src/routes/*.js']
};

const swaggerSpec = swaggerJsDoc(options);

export { swaggerUi, swaggerSpec };
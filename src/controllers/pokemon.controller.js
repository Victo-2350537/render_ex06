import PokemonModel from '../models/pokemon.model.js';

class PokemonController {
    static getAllPokemons(req, res) {
        const { page = 1, type } = req.query;
        const itemsPerPage = 25;
        
        // Validation basique
        const pageNumber = parseInt(page);
        if (isNaN(pageNumber) || pageNumber < 1) {
            return res.status(400).json({ erreur: "Numéro de page invalide" });
        }

        new Promise((resolve, reject) => {
            PokemonModel.getAll(pageNumber, type, (err, data) => {
                if (err) reject(err);
                else resolve(data);
            });
        })
        .then(data => {
            // S'assurer que nous avons un nombre valide pour le total
            let total;
            if (typeof data.total === 'number') {
                total = data.total;
            } else if (typeof data.total === 'string') {
                total = parseInt(data.total);
            } else if (data.pokemons) {
                total = data.total_count; // Utilisation d'un champ potentiel total_count
            }

            // Calculer le nombre total de pages qui marche
            const totalPages = Math.ceil(total / itemsPerPage); 

            res.status(200).json({
                pokemons: data.pokemons || [],
                type: type || "",
                nombrePokemonTotal: total,
                page: pageNumber,
                totalPages: totalPages
            });
        })
        .catch(err => {
            console.error("Erreur complète:", err);
            res.status(500).json({ 
                erreur: "Echec lors de la récupération de la liste des pokemons" 
            });
        });
    }

    static getPokemonById(req, res) {
        const { id } = req.params;
        
        if (!id || isNaN(parseInt(id))) {
            return res.status(400).json({ erreur: "ID invalide" });
        }

        new Promise((resolve, reject) => {
            PokemonModel.getById(id, (err, results) => {
                if (err) reject(err);
                else resolve(results.row);
            });
        })
        .then(results => {
            if (results.length === 0) {
                return res.status(404).json({ 
                    erreur: `Pokemon introuvable avec l'id ${id}` 
                });
            }
            res.status(200).json(results[0].row);
        })
        .catch(err => {
            console.error("Erreur SQL:", err.code, err.message);
            res.status(500).json({ 
                erreur: `Echec lors de la récupération du pokemon avec l'id ${id}` 
            });
        });
    }

    static addPokemon(req, res) {
        const requiredFields = ['nom', 'type_primaire', 'pv', 'attaque', 'defense'];
        const missingFields = requiredFields.filter(field => !req.body[field]);
        
        if (missingFields.length > 0) {
            return res.status(400).json({
                erreur: "Le format des données est invalide",
                champ_manquant: missingFields
            });
        }

        new Promise((resolve, reject) => {
            PokemonModel.create(req.body, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        })
        .then(result => {
            res.status(201).json({
                message: `Le pokemon ${req.body.nom} a été ajouté avec succès`,
                pokemon: {
                    id: result.insertId,
                    ...req.body
                }
            });
        })
        .catch(err => {
            console.error("Erreur SQL:", err.code, err.message);
            res.status(500).json({ 
                erreur: `Echec lors de la création du pokemon ${req.body.nom}` 
            });
        });
    }

    static updatePokemon(req, res) {
        const { id } = req.params;
        
        if (!id || isNaN(parseInt(id))) {
            return res.status(400).json({ erreur: "ID invalide" });
        }

        const requiredFields = ['nom', 'type_primaire', 'pv', 'attaque', 'defense'];
        const missingFields = requiredFields.filter(field => !req.body[field]);
        
        if (missingFields.length > 0) {
            return res.status(400).json({
                erreur: "Le format des données est invalide",
                champ_manquant: missingFields
            });
        }

        // Vérifier d'abord si le pokemon existe
        new Promise((resolve, reject) => {
            PokemonModel.getById(id, (err, results) => {
                if (err) reject(err);
                else resolve(results.row);
            });
        })
        .then(results => {
            if (results.length === 0) {
                return res.status(404).json({ 
                    erreur: `Le pokemon id ${id} n'existe pas dans la base de données` 
                });
            }

            return new Promise((resolve, reject) => {
                PokemonModel.update(id, req.body, (err, result) => {
                    if (err) reject(err);
                    else resolve(result.row);
                });
            });
        })
        .then(() => {
            res.status(200).json({
                message: `Le pokemon id ${id} a été modifié avec succès`,
                pokemon: {
                    id: parseInt(id),
                    ...req.body
                }
            });
        })
        .catch(err => {
            console.error("Erreur SQL:", err.code, err.message);
            res.status(500).json({ 
                erreur: `Echec lors de la modification du pokemon ${req.body.nom}` 
            });
        });
    }

    static deletePokemon(req, res) {
        const { id } = req.params;
        
        if (!id || isNaN(parseInt(id))) {
            return res.status(400).json({ erreur: "ID invalide" });
        }

        let pokemonToDelete;

        new Promise((resolve, reject) => {
            PokemonModel.getById(id, (err, results) => {
                if (err) reject(err);
                else resolve(results.row);
            });
        })
        .then(results => {
            if (results.length === 0) {
                throw { status: 404, message: `Le pokemon id ${id} n'existe pas dans la base de données` };
            }
            pokemonToDelete = results.row[0];

            return new Promise((resolve, reject) => {
                PokemonModel.delete(id, (err, result) => {
                    if (err) reject(err);
                    else resolve(result.row);
                });
            });
        })
        .then(() => {
            res.status(200).json({
                message: `Le pokemon id ${id} a été supprimé avec succès`,
                pokemon: pokemonToDelete
            });
        })
        .catch(err => { //ici on evite la repition d'erreur dans le header qui fait crash le server
            if (err.status) {
                res.status(err.status).json({ erreur: err.message });
            } else {
                console.error("Erreur SQL:", err.code, err.message);
                res.status(500).json({ 
                    erreur: `Echec lors de la suppression du pokemon id ${id}` 
                });
            }
        });
    }
}

export default PokemonController;
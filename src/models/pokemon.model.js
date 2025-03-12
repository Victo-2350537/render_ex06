import db from "../config/dp_pg.js";

class PokemonModel {
    static getById(id, callback) {
        db.query('SELECT * FROM pokemon WHERE id = $1', [id], (err, results) => {
            if (err) {
                return callback(err);
            }
            callback(null, { row: results.rows || [] });
        });
    }

    static getAll(page, type, callback) {
        const itemsPerPage = 25;
        let countQuery = 'SELECT COUNT(*) as total FROM pokemon';
        let dataQuery = 'SELECT * FROM pokemon';
        let params = [];

        if (type) {
            countQuery += ' WHERE type_primaire = $1';
            dataQuery += ' WHERE type_primaire = $1';
            params.push(type);
        }

        dataQuery += ' LIMIT $1 OFFSET $2';
        const offset = (page - 1) * itemsPerPage;
        const queryParams = [...params, itemsPerPage, offset];

        db.query(countQuery, params, (countErr, countResults) => {
            if (countErr) return callback(countErr);
            
            // Vérifier que countResults existe et a des rows
            if (!countResults || !countResults.rows || countResults.rows.length === 0) {
                return callback(null, { pokemons: [], total: 0, totalPages: 0 });
            }
            
            const total = parseInt(countResults.rows[0].total) || 0;
            
            db.query(dataQuery, queryParams, (dataErr, pokemonResults) => {
                if (dataErr) return callback(dataErr);
                
                // Vérifier que pokemonResults existe
                const pokemons = pokemonResults && pokemonResults.rows ? pokemonResults.rows : [];
                
                callback(null, {
                    pokemons: pokemons,
                    total: total,
                    totalPages: Math.ceil(total / itemsPerPage)
                });
            });
        });
    }

    static create(pokemon, callback) {
        const { nom, type_primaire, type_secondaire = null, pv, attaque, defense } = pokemon;
        
        db.query(
            'INSERT INTO pokemon (nom, type_primaire, type_secondaire, pv, attaque, defense) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
            [nom, type_primaire, type_secondaire, pv, attaque, defense],
            (err, result) => {
                if (err) {
                    return callback(err);
                }
                
                // Vérifier que result existe et a des rows
                if (!result || !result.rows || result.rows.length === 0) {
                    return callback(null, { insertId: null });
                }
                
                callback(null, { 
                    insertId: result.rows[0].id,
                    rows: result.rows
                });
            }
        );
    }

    static update(id, pokemon, callback) {
        const { nom, type_primaire, type_secondaire = null, pv, attaque, defense } = pokemon;
        
        db.query(
            'UPDATE pokemon SET nom=$1, type_primaire=$2, type_secondaire=$3, pv=$4, attaque=$5, defense=$6 WHERE id=$7 RETURNING *',
            [nom, type_primaire, type_secondaire, pv, attaque, defense, id],
            (err, result) => {
                if (err) {
                    return callback(err);
                }
                
                // Retourner un objet avec une propriété row pour être cohérent avec getById
                callback(null, { 
                    row: result && result.rows ? result.rows : [],
                    affectedRows: result && result.rowCount ? result.rowCount : 0
                });
            }
        );
    }

    static delete(id, callback) {
        db.query(
            'DELETE FROM pokemon WHERE id = $1 RETURNING *', 
            [id], 
            (err, result) => {
                if (err) {
                    return callback(err);
                }
                
                // Retourner un objet avec une propriété row pour être cohérent avec getById
                callback(null, { 
                    row: result && result.rows ? result.rows : [],
                    affectedRows: result && result.rowCount ? result.rowCount : 0
                });
            }
        );
    }
}

export default PokemonModel;
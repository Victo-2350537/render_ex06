import db from "../config/dp_pg.js";

class PokemonModel {
    static getById(id, callback) { 
        db.query('SELECT * FROM pokemon WHERE id = $1', [id], callback);
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

            const total = countResults[0].total;

            db.query(dataQuery, queryParams, (dataErr, pokemons) => {
                if (dataErr) return callback(dataErr);

                callback(null, {
                    pokemons: pokemons,
                    total: total,
                    totalPages: Math.ceil(total / itemsPerPage) // ceil est préférable a roud, car il prend la valeur plus grande ou égale.
                });
            });
        });
    }

    static create(pokemon, callback) {
        const { nom, type_primaire, type_secondaire, pv, attaque, defense } = pokemon;
        db.query(
            'INSERT INTO pokemon (nom, type_primaire, type_secondaire, pv, attaque, defense) VALUES ($1, $2, $3, $4, $5, $6)',
            [nom, type_primaire, type_secondaire, pv, attaque, defense],
            callback
        );
    }

    static update(id, pokemon, callback) {
        const { nom, type_primaire, type_secondaire, pv, attaque, defense } = pokemon;
        db.query(
            'UPDATE pokemon SET nom=$1, type_primaire=$2, type_secondaire=$3, pv=$4, attaque=$5, defense=$6 WHERE id=$7',
            [nom, type_primaire, type_secondaire, pv, attaque, defense, id],
            callback
        );
    }

    static delete(id, callback) {
        db.query('DELETE FROM pokemon WHERE id = $1', [id], callback);
    }
}

export default PokemonModel;
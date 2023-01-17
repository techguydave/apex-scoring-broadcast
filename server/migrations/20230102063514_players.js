/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.raw(`
            CREATE TABLE IF NOT EXISTS "players"(
                "id" serial,
                "playerId" character varying(128),
                PRIMARY KEY(id)
            );
            CREATE UNIQUE INDEX players_playerId_idx ON players ("playerId");

            INSERT INTO players ("playerId")
            SELECT DISTINCT "playerId"
            FROM player_game_stats ;
        `);

};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {

};

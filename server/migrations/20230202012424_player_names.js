/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.raw(`
            CREATE VIEW player_names AS
                SELECT DISTINCT
                    (SELECT id FROM players where "playerId" = "pgs"."playerId") AS "playerId",
                    name
            FROM player_game_stats pgs;
        `);

};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {

};

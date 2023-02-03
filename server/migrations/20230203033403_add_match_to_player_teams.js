/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.raw(`
        ALTER TABLE "player_game_stats" ADD COLUMN "matchId" integer;
        ALTER TABLE "team_game_stats" ADD COLUMN "matchId" integer;

        UPDATE team_game_stats t 
            SET "matchId" = game."matchId" 
            FROM game 
            WHERE game.id = t."gameId";
	
        UPDATE player_game_stats t 
            SET "matchId" = game."matchId" 
            FROM game 
            WHERE game.id = t."gameId";
    `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {

};

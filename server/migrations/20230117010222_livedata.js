/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.raw(`
        ALTER TABLE "game" ADD COLUMN "source" character varying(128) DEFAULT 'statscode';

        ALTER TABLE "player_game_stats" ADD COLUMN "grenadesThrown" integer;
        ALTER TABLE "player_game_stats" ADD COLUMN "ultimatesUsed" integer;
        ALTER TABLE "player_game_stats" ADD COLUMN "tacticalsUsed" integer;
        ALTER TABLE "player_game_stats" ADD COLUMN "skin" character varying(20);

        ALTER TABLE "team_game_stats" ADD COLUMN "grenadesThrown" integer;
        ALTER TABLE "team_game_stats" ADD COLUMN "ultimatesUsed" integer;
        ALTER TABLE "team_game_stats" ADD COLUMN "tacticalsUsed" integer;
    `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {

};

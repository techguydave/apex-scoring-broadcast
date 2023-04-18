/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.raw(`
        CREATE TABLE IF NOT EXISTS "match_teams" (
            "id" serial,
            "matchId" integer,
            "teamId" integer,
            name character varying(32) NULL,
            PRIMARY KEY(id)
        );

        CREATE UNIQUE INDEX match_teams_idx ON match_teams ("matchId","teamId");
    `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {

};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.raw(`
        CREATE TABLE IF NOT EXISTS "drops" (
            "id" serial,
            "matchId" integer,
            "token" character varying(36),
            "map" character varying(36),
            "teamName" character varying(32) NULL,
            "color" character varying(32) NULL,
            "drop" character varying(48) NULL,
            "deletedAt" timestamp NULL, 
            PRIMARY KEY(id)
        );
    `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.raw(`
            CREATE TABLE IF NOT EXISTS "livedata"(
                "id" serial,
                "gameId" integer,
                "data" text,
                PRIMARY KEY(id)
            );
           
        `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {

};

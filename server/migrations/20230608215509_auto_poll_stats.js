/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.raw(`
        ALTER TABLE match_settings ADD COLUMN "pollStart" int8;
        ALTER TABLE match_settings ADD COLUMN "pollCurrent" int8;
        ALTER TABLE match_settings ADD COLUMN "pollEnd" int8;
        ALTER TABLE match_settings ADD COLUMN "statsCodes" character varying(31);
    `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  
};

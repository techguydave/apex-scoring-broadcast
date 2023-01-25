/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    // fix for accidently calling statscode = respawn in code :)
    return knex.raw(`
            UPDATE game SET source = 'statscode' WHERE source = 'respawn';
            UPDATE game SET source = 'statscode+livedata' WHERE source = 'respawn+livedata';
        `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {

};

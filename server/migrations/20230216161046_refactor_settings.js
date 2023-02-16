/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    knex.raw(`
        ALTER TABLE admin_settings RENAME TO match_settings;
        ALTER TABLE public.admin_settings DROP COLUMN broadcast;

        CREATE TABLE IF NOT EXISTS "broadcast_settings"(
            "id" serial,
            "organizer" integer,
            "broadcast" jsonb,
            PRIMARY KEY(id)
        );
    
        CREATE UNIQUE INDEX broadcast_settings_organizer_idx ON admin_settings ("organizer");
    `)
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {

};

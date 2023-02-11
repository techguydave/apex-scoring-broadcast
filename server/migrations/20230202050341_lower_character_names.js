/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.raw(`
            UPDATE player_game_stats SET "characterName" = LOWER("characterName");

            CREATE OR REPLACE FUNCTION lowercase_characters_on_insert() RETURNS trigger AS $lowercase_characters_on_insert$
                BEGIN        
                    NEW."characterName" = LOWER(NEW."characterName");
                    RETURN NEW;
                END;
            $lowercase_characters_on_insert$ LANGUAGE plpgsql;

            CREATE TRIGGER lowercase_characters_on_insert_trigger BEFORE INSERT OR UPDATE ON player_game_stats
                FOR EACH ROW EXECUTE PROCEDURE lowercase_characters_on_insert();

        `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {

};

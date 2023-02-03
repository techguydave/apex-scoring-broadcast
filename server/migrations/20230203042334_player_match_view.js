/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.raw(`
        DROP VIEW player_matches;
       
        ALTER TABLE admin_settings ALTER COLUMN broadcast TYPE jsonb USING broadcast::jsonb;
        ALTER TABLE admin_settings ALTER COLUMN public TYPE jsonb USING public::jsonb;

        CREATE OR REPLACE VIEW player_matches AS
        SELECT 
            PGS."matchId", 
            P.ID AS "playerId", 
            (ARRAY_AGG(m."eventId"))[1] AS "eventId", 
            (ARRAY_AGG(m.ORGANIZER))[1] AS "organizerId", 
            (ARRAY_AGG(O.USERNAME))[1]  AS "organizerName",
            (ARRAY_AGG(PGS."name"))[1] AS "playerName",
            (ARRAY_AGG(PGS."teamName"))[1] AS "teamName",
            (ARRAY_AGG(AS2.PUBLIC->'title'))[1] AS "matchName",
            sum(TGS.score) AS score
        FROM PLAYER_GAME_STATS PGS 
        LEFT JOIN PLAYERS P 
            ON P."playerId" = PGS."playerId" 
        LEFT JOIN "match" m 
            ON PGS."matchId" = m.ID
        LEFT JOIN ORGANIZERS O 
            ON O.ID = m.ORGANIZER 
        LEFT JOIN TEAM_GAME_STATS TGS 
            ON TGS."matchId" = PGS."matchId" 
                AND TGS."teamId" = PGS."teamId" 
                AND TGS."gameId" = PGS."gameId" 
        LEFT JOIN ADMIN_SETTINGS AS2 
            ON AS2.ORGANIZER = m.ORGANIZER AND AS2."eventId" = m."eventId" 
        GROUP BY PGS."matchId",P.id;
    `);

};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {

};

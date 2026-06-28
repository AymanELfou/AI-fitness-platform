package org.smarttrainer.backend.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;
import lombok.extern.slf4j.Slf4j;

@Configuration
@Slf4j
public class DatabaseFixer {

    @Bean
    public CommandLineRunner fixPostTable(JdbcTemplate jdbcTemplate) {
        return args -> {
            try {
                log.info("Attempting to alter post table columns to TEXT...");
                jdbcTemplate.execute("ALTER TABLE post ALTER COLUMN image_url TYPE TEXT;");
                jdbcTemplate.execute("ALTER TABLE post ALTER COLUMN content TYPE TEXT;");
                log.info("Successfully altered post table columns.");
            } catch (Exception e) {
                log.warn("Could not alter post table columns (they might already be TEXT or table doesn't exist): " + e.getMessage());
            }

            try {
                log.info("Attempting to alter exercise table columns to TEXT...");
                jdbcTemplate.execute("ALTER TABLE exercise ALTER COLUMN image_url TYPE TEXT;");
                jdbcTemplate.execute("ALTER TABLE exercise ALTER COLUMN description TYPE TEXT;");
                log.info("Successfully altered exercise table columns.");
            } catch (Exception e) {
                log.warn("Could not alter exercise table columns: " + e.getMessage());
            }

            try {
                log.info("Attempting to fix exercise_id_seq sequence...");
                jdbcTemplate.execute("SELECT setval('exercise_id_seq', COALESCE((SELECT MAX(id) FROM exercise), 1));");
                log.info("Successfully fixed exercise sequence.");
            } catch (Exception e) {
                log.warn("Could not fix exercise sequence: " + e.getMessage());
            }
        };
    }
}

package org.smarttrainer.backend;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableAsync;


import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.jdbc.core.JdbcTemplate;

@SpringBootApplication
@EnableJpaAuditing(auditorAwareRef = "auditorAware")
@EnableAsync
public class BackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }

    @Bean
    public CommandLineRunner dropAvailabilityColumn(JdbcTemplate jdbcTemplate) {
        return args -> {
            // Remove obsolete 'availability' column (replaced by @OneToMany relation)
            try {
                jdbcTemplate.execute("ALTER TABLE coach_profiles DROP COLUMN availability");
                System.out.println("Dropped obsolete column 'availability' from 'coach_profiles'.");
            } catch (Exception e) {
                // already dropped or never existed
            }

            // Remove erroneous 'tariff' column (double-f) created by Hibernate ddl-auto=update
            // The real column is 'tarif' (single f) mapped via @Column(name="tarif")
            try {
                jdbcTemplate.execute("ALTER TABLE coach_profiles DROP COLUMN tariff");
                System.out.println("Dropped erroneous column 'tariff' from 'coach_profiles'.");
            } catch (Exception e) {
                // already dropped or never existed
            }
        };
    }
}

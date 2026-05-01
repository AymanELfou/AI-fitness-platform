package org.smarttrainer.backend.config;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;

import java.util.HashMap;
import java.util.Map;

public class DotenvEnvironmentPostProcessor implements EnvironmentPostProcessor {

    @Override
    public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {
        Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();

        Map<String, Object> props = new HashMap<>();
        props.put("SECRET_KEY", dotenv.get("SECRET_KEY"));
        props.put("SECRET_EXPIRATION", dotenv.get("SECRET_EXPIRATION"));
        props.put("DB_HOST", dotenv.get("DB_HOST"));
        props.put("DB_PORT", dotenv.get("DB_PORT"));
        props.put("DB_NAME", dotenv.get("DB_NAME"));
        props.put("DB_USER", dotenv.get("DB_USER"));
        props.put("DB_PASSWORD", dotenv.get("DB_PASSWORD"));

        environment.getPropertySources().addFirst(new MapPropertySource("dotenv", props));
    }
}
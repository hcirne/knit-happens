package com.knithappens.steps;

import com.knithappens.TestcontainersConfiguration;
import io.cucumber.spring.CucumberContextConfiguration;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.context.annotation.Import;

/**
 * Tells Cucumber to start the Spring Boot application once for all step classes.
 * The database is a real PostgreSQL started by Testcontainers (see TestcontainersConfiguration).
 * There must be exactly one class with @CucumberContextConfiguration.
 */
@CucumberContextConfiguration
@SpringBootTest
@AutoConfigureMockMvc
@Import(TestcontainersConfiguration.class)
public class CucumberSpringConfiguration {
}

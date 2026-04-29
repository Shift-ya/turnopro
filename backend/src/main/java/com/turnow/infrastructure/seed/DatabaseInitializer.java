package com.turnow.infrastructure.seed;

import org.springframework.context.ApplicationContextInitializer;
import org.springframework.context.ConfigurableApplicationContext;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.Statement;

public class DatabaseInitializer implements ApplicationContextInitializer<ConfigurableApplicationContext> {

    @Override
    public void initialize(ConfigurableApplicationContext applicationContext) {
        System.out.println("Creating turnow database if it doesn't exist...");
        try {
            // Cargar el driver
            Class.forName("org.postgresql.Driver");
            
            // Conectarse a 'postgres' para crear 'turnow'
            try (Connection conn = DriverManager.getConnection(
                    "jdbc:postgresql://localhost:5432/postgres", 
                    "postgres", 
                    "QUETEimporta1505");
                 Statement stmt = conn.createStatement()) {
                
                // Crear la BD si no existe
                stmt.execute("CREATE DATABASE turnow ENCODING 'UTF8'");
                System.out.println("Database 'turnow' created successfully");
            } catch (Exception e) {
                // Si falla, probablemente ya existe
                System.out.println("Database check/creation result: " + e.getMessage());
            }
        } catch (Exception e) {
            System.err.println("Error initializing database: " + e.getMessage());
            e.printStackTrace();
        }
    }
}

package com.example.auto.config;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;

@Configuration
public class dataSourceConfig {
	
	// Database Configuration
	@Bean
	public Connection getDBConnection() throws SQLException {
		String url = "jdbc:mysql://13.201.216.64:3306/automationUtil";
		String username = "automation";
		String password = "Welcome@2024*";
		java.util.Properties properties = new java.util.Properties();
		properties.put("user", username);
		properties.put("password", password);
		return DriverManager.getConnection(url, properties);
	}

	@Bean
	public JdbcTemplate jdbcTemplate(DataSource dataSource) {
		return new JdbcTemplate(dataSource);
	}

}

//  @Bean
//  public Connection getSnowflakeConnection() throws SQLException {
//		// Define the Snowflake connection URL
//		String url = "jdbc:snowflake://hz35499.ap-southeast-1.snowflakecomputing.com";
//
//		// Snowflake connection properties
//		String user = "btsnowflake";
//		String password = "Bt_It@2024*&";
//		String database = "NBF_CIA";
//		String schema = "public";
//		String warehouse = "COMPUTE_WH";
//		String role = "ACCOUNTADMIN";
//
//		// Set the connection properties
//		java.util.Properties properties = new java.util.Properties();
//		properties.put("user", user);
//		properties.put("password", password);
//		properties.put("db", database);
//		properties.put("schema", schema);
//		properties.put("warehouse", warehouse);
//		properties.put("role", role);
//		properties.put("CLIENT_RESULT_COLUMN_CASE_INSENSITIVE", "false"); // Avoid certain Arrow assumptions
//		properties.put("JDBC_QUERY_RESULT_FORMAT", "JSON"); // Disable Arrow format
//		// Return the Snowflake connection
//		return DriverManager.getConnection(url, properties);
//	}
//

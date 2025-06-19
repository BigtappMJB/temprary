package com.codegen.service;

import com.codegen.exception.ServiceException;
import com.codegen.model.GeneratorInput;
import freemarker.template.Template;
import freemarker.template.TemplateException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.view.freemarker.FreeMarkerConfigurer;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;
import java.util.stream.Collectors;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

/**
 * Service for generating a full Spring Boot application with associated React frontend.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class CodeGenService {

	private static final String BASE_PATH = "generated-app";
	private static final String JAVA_SRC_PATH = "src/main/java";
	private static final String RESOURCES_PATH = "src/main/resources";
	private static final String[] SUB_PACKAGES = {"controller", "service", "repository", "model"};
	private static final String DEFAULT_PRIMARY_KEY = "id";
	private static final String ENTITY_TEMPLATE = "Entity.java.ftl";
	private static final String REPOSITORY_TEMPLATE = "Repository.java.ftl";
	private static final String SERVICE_TEMPLATE = "Service.java.ftl";
	private static final String CONTROLLER_TEMPLATE = "Controller.java.ftl";
	private static final String APPLICATION_TEMPLATE = "Application.java.ftl";
	private static final String PROPERTIES_TEMPLATE = "application.properties.ftl";
	private static final String POM_TEMPLATE = "pom.xml.ftl";

	private final FreeMarkerConfigurer freemarkerConfig;
	private final ReactCodeGenService reactCodeGenService;
	private final DataBaseService databaseService;
	private final JdbcTemplate jdbcTemplate;

	@Value("${maven.executable.path}")
	private String mavenExecutablePath;

	/**
	 * Generates a full Spring Boot application with a React frontend based on the provided input.
	 *
	 * @param input The configuration input for code generation.
	 * @return A message indicating the generation result and list of generated files.
	 * @throws ServiceException If generation fails.
	 */
	public String generateFullSpringBootApp(GeneratorInput input) {
		long startTime = System.nanoTime();
		log.info("Starting Spring Boot application generation for class: {}", input.getClassName());

		try {
			Path basePath = Paths.get(BASE_PATH);
			deleteDirectory(basePath.toFile());

			String fullClassName = input.getClassName();
			String simpleClassName = extractSimpleClassName(fullClassName);
			String capitalizedClassName = capitalize(simpleClassName);
			String basePackage = extractBasePackage(fullClassName);
			Path javaBasePath = createProjectStructure(basePath, basePackage);

			List<GeneratorInput.Field> fields = prepareFields(input.getFields());
			String primaryKey = fields.stream()
					.filter(GeneratorInput.Field::isPrimary)
					.findFirst()
					.map(GeneratorInput.Field::getName)
					.orElse(DEFAULT_PRIMARY_KEY);

			Map<String, Object> model = createTemplateModel(input, capitalizedClassName, basePackage, fields, primaryKey);
			List<String> generatedFiles = generateBackendFiles(javaBasePath, capitalizedClassName, basePackage, model);

			if (input.getMasterTable() != null && !input.getMasterTable().trim().isEmpty()) {
				generatedFiles.addAll(generateMasterEntity(javaBasePath, basePackage, input.getMasterTable(), model));
			}

			databaseService.generateDatabaseScript(BASE_PATH, capitalizedClassName, fields, primaryKey);
			reactCodeGenService.generateReactApp(BASE_PATH + "/react/", capitalizedClassName, fields, primaryKey);

			log.info("Successfully generated Spring Boot application for class: {}", input.getClassName());
			return String.format("Spring Boot application generated at %s\nGenerated files: %s",
					basePath, String.join(", ", generatedFiles));

		} catch (Exception e) {
			log.error("Failed to generate Spring Boot application for class: {}", input.getClassName(), e);
			throw new ServiceException("Failed to generate Spring Boot application", e);
		} finally {
			long durationMs = (System.nanoTime() - startTime) / 1_000_000;
			log.info("Total execution time: {} ms", durationMs);
		}
	}

	/**
	 * Builds a JAR file for the generated Spring Boot project using Maven.
	 *
	 * @param projectPath The path to the project directory.
	 * @param jarCommonName The common name for the JAR file.
	 * @return A message indicating the build result.
	 * @throws ServiceException If the build fails.
	 */
	public String buildJar(String projectPath, String jarCommonName) {
		try {
			ProcessBuilder processBuilder = new ProcessBuilder(
					"cmd.exe", "/c", mavenExecutablePath, "clean", "package"
			);
			processBuilder.directory(new File(projectPath));
			processBuilder.redirectErrorStream(true);
			processBuilder.inheritIO();

			Process process = processBuilder.start();
			int exitCode = process.waitFor();

			if (exitCode == 0) {
				return String.format("JAR file built successfully at: %s/target/", projectPath);
			} else {
				throw new ServiceException("Maven build failed with exit code: " + exitCode);
			}
		} catch (IOException | InterruptedException e) {
			throw new ServiceException("Failed to build JAR for project: " + projectPath, e);
		}
	}

	/**
	 * Zips the generated application directory, excluding ZIP files and target directories.
	 *
	 * @param sourceDirPath The source directory to zip.
	 * @param zipFilePath The path for the output ZIP file.
	 * @return A message indicating the zipping result.
	 * @throws ServiceException If zipping fails.
	 */
	public String zipGeneratedApp(String sourceDirPath, String zipFilePath) {
		Path sourceDir = Paths.get(sourceDirPath);
		if (!Files.exists(sourceDir)) {
			throw new ServiceException("Source directory does not exist: " + sourceDirPath);
		}

		log.info("Zipping directory: {} to {}", sourceDirPath, zipFilePath);
		try (ZipOutputStream zos = new ZipOutputStream(new FileOutputStream(zipFilePath))) {
			Files.walk(sourceDir)
					.filter(Files::isRegularFile)
					.filter(path -> !path.toString().endsWith(".zip"))
					.filter(path -> !path.toString().contains("target"))
					.forEach(path -> zipFile(sourceDir, path, zos));
			log.info("ZIP file created: {}", zipFilePath);
			return "ZIP file created successfully: " + zipFilePath;
		} catch (IOException e) {
			log.error("Failed to create ZIP file: {}", zipFilePath, e);
			throw new ServiceException("Failed to create ZIP file: " + zipFilePath, e);
		}
	}

	private void writeTemplateToFile(String templateName, Map<String, Object> dataModel, Path outputPath) {
		try {
			Template template = freemarkerConfig.getConfiguration().getTemplate(templateName);
			Files.createDirectories(outputPath.getParent());
			try (Writer out = Files.newBufferedWriter(outputPath)) {
				template.process(dataModel, out);
			}
		} catch (IOException | TemplateException e) {
			throw new ServiceException("Failed to process template: " + templateName, e);
		}
	}

	private Path createProjectStructure(Path basePath, String basePackage) {
		String packagePath = basePackage.replace(".", "/");
		Path javaBasePath = basePath.resolve(Paths.get(JAVA_SRC_PATH, packagePath));
		Path resourcesPath = basePath.resolve(RESOURCES_PATH);

		try {
			Files.createDirectories(basePath);
			Files.createDirectories(resourcesPath);
			for (String subPackage : SUB_PACKAGES) {
				Files.createDirectories(javaBasePath.resolve(subPackage));
			}
			return javaBasePath;
		} catch (IOException e) {
			throw new ServiceException("Failed to create project structure at: " + basePath, e);
		}
	}

	private List<GeneratorInput.Field> prepareFields(List<GeneratorInput.Field> inputFields) {
		List<GeneratorInput.Field> fields = new ArrayList<>(inputFields);
		if (fields.stream().noneMatch(GeneratorInput.Field::isPrimary)) {
			GeneratorInput.Field idField = new GeneratorInput.Field(
					DEFAULT_PRIMARY_KEY, "Long", true, "hidden", 0, new ArrayList<>()
			);
			fields.add(0, idField);
		}
		return fields;
	}

	private Map<String, Object> createTemplateModel(GeneratorInput input, String className, String basePackage,
													List<GeneratorInput.Field> fields, String primaryKey) {
		Map<String, Object> model = new HashMap<>();
		model.put("className", input.getClassName());
		model.put("fields", fields);
		model.put("primaryKey", primaryKey);
		model.put("package", basePackage);
		model.put("basePackage", basePackage);
		model.put("groupId", "com.codegen");
		model.put("artifactId", className.toLowerCase());
		model.put("masterTable", input.getMasterTable());
		model.put("relationshipType", input.getRelationshipType());
		return model;
	}

	private List<String> generateBackendFiles(Path javaBasePath, String className, String basePackage,
											  Map<String, Object> model) {
		List<String> generatedFiles = new ArrayList<>();
		writeTemplateToFile(ENTITY_TEMPLATE, model, javaBasePath.resolve("model").resolve(className + ".java"));
		writeTemplateToFile(REPOSITORY_TEMPLATE, model, javaBasePath.resolve("repository").resolve(className + "Repository.java"));
		writeTemplateToFile(SERVICE_TEMPLATE, model, javaBasePath.resolve("service").resolve(className + "Service.java"));
		writeTemplateToFile(CONTROLLER_TEMPLATE, model, javaBasePath.resolve("controller").resolve(className + "Controller.java"));
		writeTemplateToFile(APPLICATION_TEMPLATE, model, javaBasePath.resolve("Application.java"));
		writeTemplateToFile(PROPERTIES_TEMPLATE, model, Paths.get(BASE_PATH).resolve(RESOURCES_PATH).resolve("application.properties"));
		writeTemplateToFile(POM_TEMPLATE, model, Paths.get(BASE_PATH).resolve("pom.xml"));

		generatedFiles.add(javaBasePath.resolve("model").resolve(className + ".java").toString());
		return generatedFiles;
	}

	private List<String> generateMasterEntity(Path javaBasePath, String basePackage, String masterTable,
											  Map<String, Object> model) {
		List<String> generatedFiles = new ArrayList<>();
		String capitalizedMasterTable = capitalize(masterTable);
		Path masterEntityPath = javaBasePath.resolve("model").resolve(capitalizedMasterTable + ".java");

		if (Files.exists(masterEntityPath)) {
			return generatedFiles;
		}

		validateMasterTable(masterTable);
		List<GeneratorInput.Field> masterFields = fetchColumns(masterTable);

		Map<String, Object> masterModel = new HashMap<>();
		masterModel.put("className", basePackage + ".model." + capitalizedMasterTable);
		masterModel.put("fields", masterFields);
		masterModel.put("package", basePackage);
		masterModel.put("basePackage", basePackage);
		masterModel.put("groupId", "com.codegen");
		masterModel.put("artifactId", masterTable.toLowerCase());

		writeTemplateToFile(ENTITY_TEMPLATE, masterModel, masterEntityPath);
		generatedFiles.add(masterEntityPath.toString());
		model.put("masterTable", masterTable.toLowerCase());
		model.put("relationshipType", model.get("relationshipType"));
		return generatedFiles;
	}

	private void validateMasterTable(String masterTable) {
		List<String> tables = jdbcTemplate.queryForList(
				"SELECT table_name FROM information_schema.tables WHERE table_schema = DATABASE()",
				String.class
		);
		if (!tables.contains(masterTable.toLowerCase())) {
			log.warn("Master table '{}' does not exist", masterTable);
			throw new ServiceException("Master table '" + masterTable + "' does not exist");
		}
	}

	private List<GeneratorInput.Field> fetchColumns(String tableName) {
		try {
			List<Map<String, Object>> columns = jdbcTemplate.queryForList(
					"SELECT c.column_name AS name, c.data_type AS type, " +
							"CASE WHEN k.column_name IS NOT NULL THEN 1 ELSE 0 END AS isPrimary " +
							"FROM information_schema.columns c " +
							"LEFT JOIN information_schema.key_column_usage k " +
							"ON c.table_name = k.table_name AND c.column_name = k.column_name " +
							"AND k.constraint_name = 'PRIMARY' " +
							"WHERE c.table_name = ?",
					tableName
			);

			List<GeneratorInput.Field> fields = columns.stream()
					.map(col -> new GeneratorInput.Field(
							(String) col.get("name"),
							mapDbTypeToJavaType((String) col.get("type")),
							isPrimary(col.get("isPrimary")),
							isPrimary(col.get("isPrimary")) ? "hidden" : "text",
							0,
							new ArrayList<>()
					))
					.collect(Collectors.toList());

			if (fields.stream().noneMatch(GeneratorInput.Field::isPrimary)) {
				fields.add(0, new GeneratorInput.Field(
						DEFAULT_PRIMARY_KEY, "Long", true, "hidden", 0, new ArrayList<>()
				));
			}
			return fields;
		} catch (Exception e) {
			log.error("Failed to fetch columns for table: {}", tableName, e);
			throw new ServiceException("Failed to fetch columns for table: " + tableName, e);
		}
	}

	private boolean isPrimary(Object isPrimaryValue) {
		if (isPrimaryValue == null) return false;
		if (isPrimaryValue instanceof Boolean) return (Boolean) isPrimaryValue;
		if (isPrimaryValue instanceof Number) return ((Number) isPrimaryValue).intValue() == 1;
		return false;
	}

	private String mapDbTypeToJavaType(String dbType) {
		return switch (dbType.toLowerCase()) {
			case "varchar", "char", "text", "mediumtext", "longtext" -> "String";
			case "integer", "int" -> "Integer";
			case "bigint" -> "Long";
			case "decimal", "numeric" -> "BigDecimal";
			case "date" -> "LocalDate";
			case "datetime", "timestamp" -> "LocalDateTime";
			case "boolean", "tinyint" -> "Boolean";
			default -> {
				log.warn("Unknown database type: {}, defaulting to String", dbType);
				yield "String";
			}
		};
	}

	private String extractSimpleClassName(String fullClassName) {
		return fullClassName.substring(fullClassName.lastIndexOf('.') + 1);
	}

	private String extractBasePackage(String fullClassName) {
		String[] parts = fullClassName.split("\\.");
		if (parts.length < 2) {
			throw new ServiceException("Invalid class name: " + fullClassName);
		}
		return String.join(".", Arrays.copyOfRange(parts, 0, parts.length - 1));
	}

	private String capitalize(String str) {
		if (str == null || str.isEmpty()) return str;
		return str.substring(0, 1).toUpperCase() + str.substring(1).toLowerCase();
	}

	private void zipFile(Path sourceDir, Path filePath, ZipOutputStream zos) {
		try {
			ZipEntry zipEntry = new ZipEntry(sourceDir.relativize(filePath).toString());
			zos.putNextEntry(zipEntry);
			Files.copy(filePath, zos);
			zos.closeEntry();
			log.debug("Zipped file: {}", filePath);
		} catch (IOException e) {
			log.error("Failed to zip file: {}", filePath, e);
			throw new ServiceException("Failed to zip file: " + filePath.getFileName(), e);
		}
	}

	public void deleteDirectory(File directory) {
		if (!directory.exists()) return;

		File[] files = directory.listFiles();
		if (files != null) {
			for (File file : files) {
				if (file.isDirectory()) {
					deleteDirectory(file);
				} else if (!file.delete()) {
					log.warn("Failed to delete file: {}", file.getPath());
				}
			}
		}
		if (!directory.delete()) {
			log.warn("Failed to delete directory: {}", directory.getPath());
		}
	}
}

package com.codegen.service;

import java.io.File;
import java.io.FileOutputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.io.StringWriter;
import java.io.Writer;
import java.lang.reflect.Field;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.view.freemarker.FreeMarkerConfigurer;

import com.codegen.exception.ServiceException;
import com.codegen.model.GeneratorInput;

import freemarker.template.Template;
import freemarker.template.TemplateException;
import lombok.extern.slf4j.Slf4j;


@Slf4j
@Service
public class CodeGenService {

	@Autowired
	private FreeMarkerConfigurer freemarkerConfig;


@Autowired
private ReactCodeGenService reactCodeGenService;

	@Autowired
	private DataBaseService databaseService;

	Map<String, Object> dataModel = null;
	StringWriter out = null;

	private void writeTemplateToFile(String templateName, Map<String, Object> dataModel, String outputPath)
			throws ServiceException {
		try {
			Template template = freemarkerConfig.getConfiguration().getTemplate(templateName);
			try (FileWriter out = new FileWriter(outputPath)) {
				template.process(dataModel, out);
			}
		} catch (IOException | TemplateException e) {
			throw new ServiceException("Failed to process template: " + templateName, e);
		}
	}


	public void createSpringBootStructure(String basePath, String basePackage) {
		try {
			String baseDir = basePath + "/src/main/java/" + basePackage.replace(".", "/");
			String resourceDir = basePath + "/src/main/resources";

			new File(basePath).mkdirs();
			new File(baseDir + "/controller").mkdirs();
			new File(baseDir + "/service").mkdirs();
			new File(baseDir + "/repository").mkdirs();
			new File(baseDir + "/model").mkdirs();
			new File(resourceDir).mkdirs();
		} catch (Exception e) {
			throw new ServiceException("Failed to create Spring Boot project structure at: " + basePath, e);
		}
	}

	int count =0;
	public String generateFullSpringBootApp(GeneratorInput input) {
		
		 long startTime = System.nanoTime(); 
		try {
			
			log.info("Starting full Spring Boot application generation for class: {}", input.getClassName());

			String basePath = "generated-app/";

			File baseDir = new File(basePath);
			
			
			deleteDirectory(baseDir);
			
			String fullClassPath = input.getClassName();
			String className = fullClassPath.substring(fullClassPath.lastIndexOf(".") + 1);

			String[] parts = fullClassPath.split("\\.");
			if (parts.length < 2) {
				throw new ServiceException("Invalid class name provided: " + fullClassPath);
			}

			String basePackage = parts[0] + "." + parts[1];
			String packagePath = basePackage.replace(".", "/");
			String javaBasePath = basePath + "src/main/java/" + packagePath + "/";
			String resourcesPath = basePath + "src/main/resources/";

			new File(javaBasePath + "controller").mkdirs();
			new File(javaBasePath + "service").mkdirs();
			new File(javaBasePath + "repository").mkdirs();
			new File(javaBasePath + "model").mkdirs();
			new File(resourcesPath).mkdirs();

			Map<String, Object> model = new HashMap<>();
			model.put("className", input.getClassName());
			model.put("fields", input.getFields());
			model.put("package", basePackage);
			model.put("basePackage", basePackage);
			model.put("groupId", "com.codegen");
			model.put("artifactId", className.toLowerCase());

			writeTemplateToFile("Entity.java.ftl", model, javaBasePath + "model/" + className + ".java");
			writeTemplateToFile("Repository.java.ftl", model, javaBasePath + "repository/" + className + "Repository.java");
			writeTemplateToFile("Service.java.ftl", model, javaBasePath + "service/" + className + "Service.java");
			writeTemplateToFile("Controller.java.ftl", model, javaBasePath + "controller/" + className + "Controller.java");
			writeTemplateToFile("Application.java.ftl", model, javaBasePath + "Application.java");
			writeTemplateToFile("application.properties.ftl", model, resourcesPath + "application.properties");
			writeTemplateToFile("pom.xml.ftl", model, basePath + "pom.xml");
			long jarstart = System.nanoTime();
			String jarResult = buildJar(basePath, className);
			log.info("total time for jar: {}", ( System.nanoTime()- jarstart )/1_000_000_000 );
String FieldIsPrimary = null;
			for (GeneratorInput.Field f : input.getFields()) {
				if(f.isPrimary()){
					FieldIsPrimary = f.getName();
				}
			}
			databaseService.generateDatabaseScript(basePath, className, input.getFields(),FieldIsPrimary );

			 String zipResult= zipGeneratedApp(basePath , basePath + "target/" + className + "-generated-app.zip");

			reactCodeGenService.generateReactApp(basePath+ "react/", className, input.getFields() ,FieldIsPrimary);
			
			log.info("Successfully generated Spring Boot application for class: {}", input.getClassName());


//

			return "Spring Boot application generated successfully at " + basePath + "\n" + jarResult + "\n" + zipResult;

		} catch (Exception e) {
			log.error("Error generating application for class: {}", input.getClassName(), e);
			throw new ServiceException("Failed to generate full Spring Boot application",e);
		}
		finally {
	       
	        long endTime = System.nanoTime();
	        log.info("Total execution time for generateFullSpringBootApp: {} ms", (endTime - startTime) / 1_000_000_000);
	    }
	}


	public void deleteDirectory(File directory) {
	    if (directory.exists()) {
	        File[] files = directory.listFiles();
	        if (files != null) {
	            for (File file : files) {
	                if (file.isDirectory()) {
	                    deleteDirectory(file);
	                } else {
	                    file.delete();
	                }
	            }
	        }
	        directory.delete();
	    }
	}


	public String zipGeneratedApp(String sourceDirPath, String zipFilePath) {
		try {
			
			Path sourceDir = Paths.get(sourceDirPath);
			if (!Files.exists(sourceDir)) {
				throw new ServiceException("Source directory does not exist: " + sourceDirPath);
			}
	
			log.info("Starting to zip the directory: {}", sourceDirPath);
			log.info("ZIP file will be created at: {}", zipFilePath);
	
			
			try (ZipOutputStream zos = new ZipOutputStream(new FileOutputStream(zipFilePath))) {
				
				Files.walk(sourceDir)
					.filter(path -> !Files.isDirectory(path)) 
					.filter(path -> !path.toString().endsWith(".zip")) 
					.filter(path -> !path.toString().contains("target")) 
					.forEach(path -> {
						try {
							
							log.info("Processing file: {}", path);
	
							
							ZipEntry zipEntry = new ZipEntry(sourceDir.relativize(path).toString());
							extracted(zos, zipEntry);


							Files.copy(path, zos);
							zos.closeEntry(); 
						} catch (IOException e) {
							log.error("Error while zipping file: {}", path, e);
							throw new ServiceException("Error while zipping file: " + path.getFileName(), e);
						}
					});
			}
	
			log.info("ZIP file created successfully: {}", zipFilePath);
			return "ZIP file created successfully: " + zipFilePath;
		} catch (IOException e) {
			log.error("Failed to create ZIP file: {}", zipFilePath, e);
			throw new ServiceException("Failed to create ZIP file: " + zipFilePath, e);
		}
	}

	private static void extracted(ZipOutputStream zos, ZipEntry zipEntry) throws IOException {
		zos.putNextEntry(zipEntry);
	}


	public String buildJar(String projectPath , String jarCommonName) {
		try {
			ProcessBuilder processBuilder = new ProcessBuilder("cmd.exe", "/c",
					"C:\\Users\\MohammadJuned\\Downloads\\apache-maven-3.9.9-bin\\apache-maven-3.9.9\\bin\\mvn.cmd",
					"clean", "package");

			processBuilder.directory(new File(projectPath));
			processBuilder.redirectErrorStream(true);
			processBuilder.inheritIO();
			Process process = processBuilder.start();
		
			int exitCode = process.waitFor();

			if (exitCode == 0) {
				String jarFilePath = projectPath + "/target/" + jarCommonName + ".jar";
				return "JAR file built successfully! You can find it at: " + projectPath + "/target/";
			} else {
				throw new ServiceException("Maven build failed. Exit code: " + exitCode);
			}
		} catch (IOException | InterruptedException e) {
			throw new ServiceException("Error during JAR build for project path: " + projectPath, e);
		}
	}


}

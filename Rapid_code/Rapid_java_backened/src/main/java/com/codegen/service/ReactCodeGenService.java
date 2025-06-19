package com.codegen.service;

import com.codegen.exception.ServiceException;
import com.codegen.model.GeneratorInput;
import freemarker.template.Template;
import freemarker.template.TemplateException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.view.freemarker.FreeMarkerConfigurer;

import java.io.File;
import java.io.IOException;
import java.io.Writer;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

/**
 * Service for generating a React frontend application structure and components.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ReactCodeGenService {

    private static final String REACT_TEMPLATE = "ReactCurdPage.ftl";
    private static final String COMPONENTS_SUBPATH = "components";
    private static final String PUBLIC_SUBPATH = "public";
    private static final String SRC_SUBPATH = "src";
    private static final String INDEX_JS = "index.js";
    private static final String APP_JS = "App.js";
    private static final String PACKAGE_JSON = "package.json";
    private static final String INDEX_HTML = "index.html";
    private static final String CRUD_FILE_SUFFIX = "Crud.jsx";
    private static final String ZIP_FILE_SUFFIX = "-react.zip";

    private final FreeMarkerConfigurer freemarkerConfig;

    @Value("${react.generated.components.path}")
    private String generatedComponentsPath;

    /**
     * Generates a React application with a CRUD component for the specified entity.
     *
     * @param basePath    The base directory for the React project.
     * @param entityName  The name of the entity for which to generate the CRUD component.
     * @param fields      The fields for the entity.
     * @param primaryKey  The primary key field name.
     * @return A message indicating the generation result and ZIP file path.
     * @throws ServiceException If generation fails.
     */
    public String generateReactApp(String basePath, String entityName, List<GeneratorInput.Field> fields, String primaryKey) {
        long startTime = System.nanoTime();
        log.info("Starting React app generation for entity: {}", entityName);

        try {
            Path baseDir = Paths.get(basePath);
            deleteDirectory(baseDir.toFile());
            createReactProjectStructure(baseDir);

            String capitalizedEntityName = "MJB"; // TODO: Replace with dynamic capitalization
            Map<String, Object> model = createTemplateModel(entityName, capitalizedEntityName, fields, primaryKey);

            Path componentsDir = validateAndCreateComponentsDir();
            Path reactComponentPath = componentsDir.resolve(capitalizedEntityName + CRUD_FILE_SUFFIX);
            writeTemplateToFile(REACT_TEMPLATE, model, reactComponentPath);

            generateStaticFiles(baseDir, capitalizedEntityName);

            String zipFileName = capitalizedEntityName + ZIP_FILE_SUFFIX;
            Path zipPath = baseDir.resolveSibling(zipFileName);
            zipFolder(baseDir, zipPath);

            log.info("React app generation complete for entity: {}", entityName);
            return String.format("React app generated successfully: %s", zipPath);

        } catch (Exception e) {
            log.error("Failed to generate React app for entity: {}", entityName, e);
            throw new ServiceException("Failed to generate React app", e);
        } finally {
            long durationMs = (System.nanoTime() - startTime) / 1_000_000;
            log.info("React app generation completed in {} ms", durationMs);
        }
    }

    /**
     * Creates the directory structure for the React project.
     *
     * @param basePath The base directory path.
     * @throws ServiceException If directory creation fails.
     */
    private void createReactProjectStructure(Path basePath) {
        try {
            Files.createDirectories(basePath);
            Files.createDirectories(basePath.resolve(PUBLIC_SUBPATH));
            Files.createDirectories(basePath.resolve(SRC_SUBPATH));
            Files.createDirectories(basePath.resolve(SRC_SUBPATH).resolve(COMPONENTS_SUBPATH));
        } catch (IOException e) {
            throw new ServiceException("Failed to create React project structure at: " + basePath, e);
        }
    }

    /**
     * Validates and creates the components directory from the configured path.
     *
     * @return The Path to the components directory.
     * @throws ServiceException If the path is invalid or cannot be created.
     */
    private Path validateAndCreateComponentsDir() {
        if (generatedComponentsPath == null || generatedComponentsPath.trim().isEmpty()) {
            throw new ServiceException("React components path is not configured");
        }
        Path componentsDir = Paths.get(generatedComponentsPath);
        try {
            Files.createDirectories(componentsDir);
            return componentsDir;
        } catch (IOException e) {
            throw new ServiceException("Failed to create components directory: " + generatedComponentsPath, e);
        }
    }

    /**
     * Creates the FreeMarker template model.
     *
     * @param entityName           The entity name.
     * @param capitalizedEntityName The capitalized entity name.
     * @param fields               The entity fields.
     * @param primaryKey           The primary key field name.
     * @return The template model.
     */
    private Map<String, Object> createTemplateModel(String entityName, String capitalizedEntityName,
                                                    List<GeneratorInput.Field> fields, String primaryKey) {
        Map<String, Object> model = new HashMap<>();
        model.put("pageName", capitalizedEntityName);
        model.put("className", entityName);
        model.put("fields", fields);
        model.put("primaryKey", primaryKey);
        model.put("apiBaseUrl", "/api/" + getSimpleClassName(entityName).toLowerCase());
        return model;
    }

    /**
     * Generates static React files (index.js, App.js, package.json, index.html).
     *
     * @param basePath             The base directory path.
     * @param capitalizedEntityName The capitalized entity name.
     * @throws IOException If file writing fails.
     */
    private void generateStaticFiles(Path basePath, String capitalizedEntityName) throws IOException {
        writeToFile(basePath.resolve(SRC_SUBPATH).resolve(INDEX_JS), generateIndexJsContent());
        writeToFile(basePath.resolve(SRC_SUBPATH).resolve(APP_JS), generateAppJsContent(capitalizedEntityName));
        writeToFile(basePath.resolve(PACKAGE_JSON), generatePackageJsonContent());
        writeToFile(basePath.resolve(PUBLIC_SUBPATH).resolve(INDEX_HTML), generateIndexHtmlContent());
    }

    /**
     * Writes a FreeMarker template to a file.
     *
     * @param templateName The name of the FreeMarker template.
     * @param dataModel    The data model for the template.
     * @param outputPath   The output file path.
     * @throws ServiceException If template processing or file writing fails.
     */
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

    /**
     * Writes content to a file, creating parent directories if necessary.
     *
     * @param filePath The file path.
     * @param content  The content to write.
     * @throws IOException If file writing fails.
     */
    private void writeToFile(Path filePath, String content) throws IOException {
        Files.createDirectories(filePath.getParent());
        Files.writeString(filePath, content);
    }

    /**
     * Zips the React project directory.
     *
     * @param sourceDir The source directory to zip.
     * @param zipPath   The output ZIP file path.
     * @throws IOException If zipping fails.
     */
    private void zipFolder(Path sourceDir, Path zipPath) throws IOException {
        log.info("Zipping React app to: {}", zipPath);
        try (ZipOutputStream zos = new ZipOutputStream(Files.newOutputStream(zipPath))) {
            Files.walk(sourceDir)
                    .filter(Files::isRegularFile)
                    .forEach(path -> zipFile(sourceDir, path, zos));
        }
        log.info("ZIP file created: {}", zipPath);
    }

    /**
     * Zips a single file into the ZIP output stream.
     *
     * @param sourceDir The source directory.
     * @param filePath  The file to zip.
     * @param zos       The ZIP output stream.
     * @throws ServiceException If zipping fails.
     */
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

    /**
     * Deletes a directory and its contents, including the specific CRUD component file.
     *
     * @param directory The directory to delete.
     */
    public void deleteDirectory(File directory) {
        Path crudFile = Paths.get(generatedComponentsPath, "MJBCrud.jsx");
        if (Files.exists(crudFile)) {
            try {
                Files.delete(crudFile);
                log.info("Deleted MJBCrud.jsx from components directory");
            } catch (IOException e) {
                log.error("Failed to delete MJBCrud.jsx from components directory", e);
            }
        }

        if (!directory.exists()) return;

        File[] files = directory.listFiles();
        if (files != null) {
            for (File file : files) {
                if (file.isDirectory()) {
                    deleteDirectory(file);
                } else {
                    try {
                        Files.delete(file.toPath());
                    } catch (IOException e) {
                        log.warn("Failed to delete file: {}", file.getPath(), e);
                    }
                }
            }
        }
        try {
            Files.deleteIfExists(directory.toPath());
        } catch (IOException e) {
            log.warn("Failed to delete directory: {}", directory.getPath(), e);
        }
    }

    /**
     * Extracts the simple class name from a fully qualified class name.
     *
     * @param fullClassName The fully qualified class name.
     * @return The simple class name.
     */
    private String getSimpleClassName(String fullClassName) {
        return fullClassName.substring(fullClassName.lastIndexOf('.') + 1);
    }

    /**
     * Generates the content for index.js.
     *
     * @return The index.js content.
     */
    private String generateIndexJsContent() {
        return """
                import React from 'react';
                import ReactDOM from 'react-dom/client';
                import App from './App';
                import '@fontsource/roboto';

                const root = ReactDOM.createRoot(document.getElementById('root'));
                root.render(<App />);
                """;
    }

    /**
     * Generates the content for App.js.
     *
     * @param capitalizedEntityName The capitalized entity name.
     * @return The App.js content.
     */
    private String generateAppJsContent(String capitalizedEntityName) {
        return String.format("""
                import React from 'react';
                import %sCrud from './components/%sCrud';

                function App() {
                  return (
                    <div style={{ margin: 20 }}>
                      <%sCrud />
                    </div>
                  );
                }

                export default App;
                """, capitalizedEntityName, capitalizedEntityName, capitalizedEntityName);
    }

    /**
     * Generates the content for package.json.
     *
     * @return The package.json content.
     */
    private String generatePackageJsonContent() {
        return """
                {
                  "name": "generated-react-app",
                  "version": "0.1.0",
                  "private": true,
                  "dependencies": {
                    "react": "^18.2.0",
                    "react-dom": "^18.2.0",
                    "@mui/material": "^5.14.4",
                    "@mui/icons-material": "^5.14.4",
                    "@emotion/react": "^11.11.1",
                    "@emotion/styled": "^11.11.0",
                    "react-hook-form": "^7.45.0",
                    "@hookform/resolvers": "^3.1.0",
                    "yup": "^1.2.0",
                    "lodash": "^4.17.21",
                    "dompurify": "^3.0.5",
                    "prop-types": "^15.8.1",
                    "@fontsource/roboto": "^5.0.0",
                    "react-scripts": "5.0.1"
                  },
                  "scripts": {
                    "start": "react-scripts start",
                    "build": "react-scripts build",
                    "test": "react-scripts test",
                    "eject": "react-scripts eject"
                  }
                }
                """;
    }

    /**
     * Generates the content for index.html.
     *
     * @return The index.html content.
     */
    private String generateIndexHtmlContent() {
        return """
                <!DOCTYPE html>
                <html lang="en">
                <head>
                  <meta charset="utf-8" />
                  <meta name="viewport" content="width=device-width, initial-scale=1" />
                  <title>Generated React App</title>
                </head>
                <body>
                  <div id="root"></div>
                </body>
                </html>
                """;
    }
}

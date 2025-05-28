const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 8080;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Mock API endpoints
app.post('/api/generate/add', (req, res) => {
  const { tableName, fields } = req.body;
  
  // Validate request
  if (!tableName) {
    return res.status(400).json({ error: 'Table name is required' });
  }
  
  if (!fields || !Array.isArray(fields) || fields.length === 0) {
    return res.status(400).json({ error: 'At least one field is required' });
  }
  
  // Generate mock Spring Boot entity class
  const entityName = tableName
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
  
  const javaCode = generateJavaEntityClass(entityName, fields);
  const repositoryCode = generateJavaRepositoryInterface(entityName);
  const controllerCode = generateJavaControllerClass(entityName);
  
  // Return success response with generated code
  res.json({
    success: true,
    generatedCode: {
      entity: javaCode,
      repository: repositoryCode,
      controller: controllerCode
    }
  });
});

// Helper function to generate Java entity class
function generateJavaEntityClass(entityName, fields) {
  const imports = [
    'import javax.persistence.*;',
    'import lombok.Data;',
    'import java.io.Serializable;'
  ];
  
  // Add date imports if needed
  if (fields.some(field => ['DATE', 'DATETIME', 'TIMESTAMP'].includes(field.type))) {
    imports.push('import java.util.Date;');
  }
  
  const fieldDefinitions = fields.map(field => {
    const annotations = [];
    
    if (field.primaryKey) {
      annotations.push('@Id');
      annotations.push('@GeneratedValue(strategy = GenerationType.IDENTITY)');
    }
    
    annotations.push(`@Column(name = "${field.name}")`);
    
    const javaType = mapSqlTypeToJavaType(field.type);
    
    return `${annotations.join('\n    ')}\n    private ${javaType} ${camelCase(field.name)};`;
  });
  
  return `package com.example.entity;

${imports.join('\n')}

@Entity
@Table(name = "${snakeCase(entityName)}")
@Data
public class ${entityName} implements Serializable {

    private static final long serialVersionUID = 1L;
    
    ${fieldDefinitions.join('\n\n    ')}
}`;
}

// Helper function to generate Java repository interface
function generateJavaRepositoryInterface(entityName) {
  return `package com.example.repository;

import com.example.entity.${entityName};
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ${entityName}Repository extends JpaRepository<${entityName}, Long> {
    // Add custom query methods here
}`;
}

// Helper function to generate Java controller class
function generateJavaControllerClass(entityName) {
  const entityVarName = entityName.charAt(0).toLowerCase() + entityName.slice(1);
  
  return `package com.example.controller;

import com.example.entity.${entityName};
import com.example.repository.${entityName}Repository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/${entityVarName}s")
public class ${entityName}Controller {

    @Autowired
    private ${entityName}Repository ${entityVarName}Repository;

    @GetMapping
    public List<${entityName}> getAll${entityName}s() {
        return ${entityVarName}Repository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<${entityName}> get${entityName}ById(@PathVariable Long id) {
        Optional<${entityName}> ${entityVarName} = ${entityVarName}Repository.findById(id);
        return ${entityVarName}.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<${entityName}> create${entityName}(@RequestBody ${entityName} ${entityVarName}) {
        ${entityName} saved${entityName} = ${entityVarName}Repository.save(${entityVarName});
        return ResponseEntity.status(HttpStatus.CREATED).body(saved${entityName});
    }

    @PutMapping("/{id}")
    public ResponseEntity<${entityName}> update${entityName}(@PathVariable Long id, @RequestBody ${entityName} ${entityVarName}) {
        if (!${entityVarName}Repository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        ${entityVarName}.setId(id);
        ${entityName} updated${entityName} = ${entityVarName}Repository.save(${entityVarName});
        return ResponseEntity.ok(updated${entityName});
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete${entityName}(@PathVariable Long id) {
        if (!${entityVarName}Repository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        ${entityVarName}Repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}`;
}

// Helper function to map SQL types to Java types
function mapSqlTypeToJavaType(sqlType) {
  const typeMap = {
    'BIGINT': 'Long',
    'INT': 'Integer',
    'SMALLINT': 'Short',
    'TINYINT': 'Byte',
    'BIT': 'Boolean',
    'DECIMAL': 'java.math.BigDecimal',
    'NUMERIC': 'java.math.BigDecimal',
    'FLOAT': 'Float',
    'REAL': 'Double',
    'DATE': 'java.util.Date',
    'DATETIME': 'java.util.Date',
    'TIMESTAMP': 'java.util.Date',
    'TIME': 'java.sql.Time',
    'CHAR': 'String',
    'VARCHAR(255)': 'String',
    'VARCHAR(100)': 'String',
    'VARCHAR(50)': 'String',
    'TEXT': 'String',
    'NCHAR': 'String',
    'NVARCHAR(255)': 'String',
    'NVARCHAR(100)': 'String',
    'NVARCHAR(50)': 'String',
    'NTEXT': 'String',
    'BINARY': 'byte[]',
    'VARBINARY': 'byte[]',
    'BLOB': 'byte[]',
    'BOOLEAN': 'Boolean'
  };
  
  return typeMap[sqlType] || 'Object';
}

// Helper function to convert to camelCase
function camelCase(str) {
  return str.replace(/_([a-z])/g, (match, group) => group.toUpperCase());
}

// Helper function to convert to snake_case
function snakeCase(str) {
  return str
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .toLowerCase();
}

// Add the new endpoint for Spring Boot code generation
app.post('/codegen/tableCreateAPI', (req, res) => {
  const { tableName, fields } = req.body;
  
  // Validate request
  if (!tableName) {
    return res.status(400).json({ error: 'Table name is required' });
  }
  
  if (!fields || !Array.isArray(fields) || fields.length === 0) {
    return res.status(400).json({ error: 'At least one field is required' });
  }
  
  // Generate mock Spring Boot entity class
  const entityName = tableName
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
  
  const javaCode = generateJavaEntityClass(entityName, fields);
  const repositoryCode = generateJavaRepositoryInterface(entityName);
  const controllerCode = generateJavaControllerClass(entityName);
  const serviceCode = generateJavaServiceClass(entityName);
  
  // Return success response with generated code
  res.json({
    success: true,
    message: `Successfully generated code for table '${tableName}'`,
    generatedCode: {
      entity: javaCode,
      repository: repositoryCode,
      service: serviceCode,
      controller: controllerCode
    }
  });
});

// Helper function to generate Java service class
function generateJavaServiceClass(entityName) {
  const entityVarName = entityName.charAt(0).toLowerCase() + entityName.slice(1);
  
  return `package com.example.service;

import com.example.entity.${entityName};
import com.example.repository.${entityName}Repository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ${entityName}Service {

    private final ${entityName}Repository ${entityVarName}Repository;

    @Autowired
    public ${entityName}Service(${entityName}Repository ${entityVarName}Repository) {
        this.${entityVarName}Repository = ${entityVarName}Repository;
    }

    public List<${entityName}> findAll() {
        return ${entityVarName}Repository.findAll();
    }

    public Optional<${entityName}> findById(Long id) {
        return ${entityVarName}Repository.findById(id);
    }

    public ${entityName} save(${entityName} ${entityVarName}) {
        return ${entityVarName}Repository.save(${entityVarName});
    }

    public void deleteById(Long id) {
        ${entityVarName}Repository.deleteById(id);
    }
}`;
}

// Add endpoint for getting all tables
app.get('/codegen/allTables', (req, res) => {
  // Mock list of tables
  const tables = [
    'users',
    'products',
    'orders',
    'customers',
    'categories',
    'inventory',
    'payments',
    'shipping_addresses',
    'order_items',
    'product_reviews'
  ];
  
  res.json(tables);
});

// Add endpoint for getting table metadata
app.get('/codegen/tableMetadata/:tableName', (req, res) => {
  const { tableName } = req.params;
  
  // Mock metadata for different tables
  const tableMetadata = {
    users: {
      tableName: 'users',
      fields: [
        { name: 'id', type: 'BIGINT', primaryKey: true },
        { name: 'username', type: 'VARCHAR(50)', primaryKey: false },
        { name: 'email', type: 'VARCHAR(100)', primaryKey: false },
        { name: 'password_hash', type: 'VARCHAR(255)', primaryKey: false },
        { name: 'first_name', type: 'VARCHAR(50)', primaryKey: false },
        { name: 'last_name', type: 'VARCHAR(50)', primaryKey: false },
        { name: 'created_at', type: 'TIMESTAMP', primaryKey: false },
        { name: 'last_login', type: 'TIMESTAMP', primaryKey: false },
        { name: 'is_active', type: 'BOOLEAN', primaryKey: false },
        { name: 'role', type: 'VARCHAR(20)', primaryKey: false }
      ]
    },
    products: {
      tableName: 'products',
      fields: [
        { name: 'id', type: 'BIGINT', primaryKey: true },
        { name: 'name', type: 'VARCHAR(100)', primaryKey: false },
        { name: 'description', type: 'TEXT', primaryKey: false },
        { name: 'price', type: 'DECIMAL', primaryKey: false },
        { name: 'stock_quantity', type: 'INT', primaryKey: false },
        { name: 'category_id', type: 'BIGINT', primaryKey: false },
        { name: 'created_at', type: 'TIMESTAMP', primaryKey: false },
        { name: 'updated_at', type: 'TIMESTAMP', primaryKey: false },
        { name: 'is_featured', type: 'BOOLEAN', primaryKey: false },
        { name: 'image_url', type: 'VARCHAR(255)', primaryKey: false }
      ]
    },
    orders: {
      tableName: 'orders',
      fields: [
        { name: 'id', type: 'BIGINT', primaryKey: true },
        { name: 'customer_id', type: 'BIGINT', primaryKey: false },
        { name: 'order_date', type: 'TIMESTAMP', primaryKey: false },
        { name: 'status', type: 'VARCHAR(20)', primaryKey: false },
        { name: 'total_amount', type: 'DECIMAL', primaryKey: false },
        { name: 'shipping_address_id', type: 'BIGINT', primaryKey: false },
        { name: 'payment_id', type: 'BIGINT', primaryKey: false },
        { name: 'notes', type: 'TEXT', primaryKey: false }
      ]
    },
    customers: {
      tableName: 'customers',
      fields: [
        { name: 'id', type: 'BIGINT', primaryKey: true },
        { name: 'first_name', type: 'VARCHAR(50)', primaryKey: false },
        { name: 'last_name', type: 'VARCHAR(50)', primaryKey: false },
        { name: 'email', type: 'VARCHAR(100)', primaryKey: false },
        { name: 'phone', type: 'VARCHAR(20)', primaryKey: false },
        { name: 'address', type: 'VARCHAR(255)', primaryKey: false },
        { name: 'city', type: 'VARCHAR(50)', primaryKey: false },
        { name: 'state', type: 'VARCHAR(50)', primaryKey: false },
        { name: 'postal_code', type: 'VARCHAR(20)', primaryKey: false },
        { name: 'country', type: 'VARCHAR(50)', primaryKey: false },
        { name: 'created_at', type: 'TIMESTAMP', primaryKey: false }
      ]
    },
    categories: {
      tableName: 'categories',
      fields: [
        { name: 'id', type: 'BIGINT', primaryKey: true },
        { name: 'name', type: 'VARCHAR(50)', primaryKey: false },
        { name: 'description', type: 'TEXT', primaryKey: false },
        { name: 'parent_id', type: 'BIGINT', primaryKey: false }
      ]
    },
    inventory: {
      tableName: 'inventory',
      fields: [
        { name: 'id', type: 'BIGINT', primaryKey: true },
        { name: 'product_id', type: 'BIGINT', primaryKey: false },
        { name: 'quantity', type: 'INT', primaryKey: false },
        { name: 'location', type: 'VARCHAR(100)', primaryKey: false },
        { name: 'last_updated', type: 'TIMESTAMP', primaryKey: false }
      ]
    },
    payments: {
      tableName: 'payments',
      fields: [
        { name: 'id', type: 'BIGINT', primaryKey: true },
        { name: 'order_id', type: 'BIGINT', primaryKey: false },
        { name: 'payment_method', type: 'VARCHAR(50)', primaryKey: false },
        { name: 'amount', type: 'DECIMAL', primaryKey: false },
        { name: 'status', type: 'VARCHAR(20)', primaryKey: false },
        { name: 'transaction_id', type: 'VARCHAR(100)', primaryKey: false },
        { name: 'payment_date', type: 'TIMESTAMP', primaryKey: false }
      ]
    },
    shipping_addresses: {
      tableName: 'shipping_addresses',
      fields: [
        { name: 'id', type: 'BIGINT', primaryKey: true },
        { name: 'customer_id', type: 'BIGINT', primaryKey: false },
        { name: 'address_line1', type: 'VARCHAR(100)', primaryKey: false },
        { name: 'address_line2', type: 'VARCHAR(100)', primaryKey: false },
        { name: 'city', type: 'VARCHAR(50)', primaryKey: false },
        { name: 'state', type: 'VARCHAR(50)', primaryKey: false },
        { name: 'postal_code', type: 'VARCHAR(20)', primaryKey: false },
        { name: 'country', type: 'VARCHAR(50)', primaryKey: false },
        { name: 'is_default', type: 'BOOLEAN', primaryKey: false }
      ]
    },
    order_items: {
      tableName: 'order_items',
      fields: [
        { name: 'id', type: 'BIGINT', primaryKey: true },
        { name: 'order_id', type: 'BIGINT', primaryKey: false },
        { name: 'product_id', type: 'BIGINT', primaryKey: false },
        { name: 'quantity', type: 'INT', primaryKey: false },
        { name: 'price', type: 'DECIMAL', primaryKey: false },
        { name: 'discount', type: 'DECIMAL', primaryKey: false }
      ]
    },
    product_reviews: {
      tableName: 'product_reviews',
      fields: [
        { name: 'id', type: 'BIGINT', primaryKey: true },
        { name: 'product_id', type: 'BIGINT', primaryKey: false },
        { name: 'customer_id', type: 'BIGINT', primaryKey: false },
        { name: 'rating', type: 'INT', primaryKey: false },
        { name: 'review_text', type: 'TEXT', primaryKey: false },
        { name: 'review_date', type: 'TIMESTAMP', primaryKey: false },
        { name: 'is_verified', type: 'BOOLEAN', primaryKey: false }
      ]
    }
  };
  
  // Return metadata for the requested table or a 404 if not found
  if (tableMetadata[tableName]) {
    res.json(tableMetadata[tableName]);
  } else {
    res.status(404).json({ error: `Table '${tableName}' not found` });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Mock API server running at http://localhost:${PORT}`);
});
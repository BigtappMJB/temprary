const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Test data for component generation
const testData = {
  tableName: 'users',
  componentName: 'UsersTable',
  pageTitle: 'User Management',
  selectedFields: [
    {
      name: 'id',
      type: 'BIGINT',
      primaryKey: true,
      nullable: false,
      selected: true,
      order: 0
    },
    {
      name: 'username',
      type: 'VARCHAR(50)',
      primaryKey: false,
      nullable: false,
      selected: true,
      order: 1
    },
    {
      name: 'email',
      type: 'VARCHAR(100)',
      primaryKey: false,
      nullable: false,
      selected: true,
      order: 2
    },
    {
      name: 'created_at',
      type: 'TIMESTAMP',
      primaryKey: false,
      nullable: true,
      selected: true,
      order: 3
    }
  ],
  componentOptions: {
    pagination: true,
    sorting: true,
    search: true,
    refresh: true,
    filtering: true,
    crud: true
  }
};

// Function to test the Python service
const testPythonService = async () => {
  console.log('Testing Python template rendering service...');
  
  try {
    // Check if the service is running
    console.log('Checking if the Python service is running...');
    
    const response = await axios.post('http://localhost:5000/generate', testData, {
      timeout: 10000 // 10 seconds timeout
    });
    
    if (response.data && response.data.success) {
      console.log('\n✅ Python service is working correctly!');
      console.log(`Generated component: ${response.data.filePath}`);
      
      // Check if the file was created
      if (fs.existsSync(response.data.filePath)) {
        console.log(`✅ Component file was created successfully at: ${response.data.filePath}`);
        
        // Get file size
        const stats = fs.statSync(response.data.filePath);
        console.log(`File size: ${(stats.size / 1024).toFixed(2)} KB`);
        
        // Show a snippet of the generated code
        const code = fs.readFileSync(response.data.filePath, 'utf8');
        console.log('\nSnippet of the generated component:');
        console.log('----------------------------------------');
        console.log(code.substring(0, 500) + '...');
        console.log('----------------------------------------');
      } else {
        console.error(`❌ Component file was not created at: ${response.data.filePath}`);
      }
    } else {
      console.error('❌ Python service returned an error:', response.data.message);
    }
  } catch (error) {
    console.error('❌ Error testing Python service:');
    
    if (error.code === 'ECONNREFUSED') {
      console.error('The Python service is not running. Please start it with:');
      console.error('npm run python-service');
    } else if (error.response) {
      console.error('Server responded with error:', error.response.data);
    } else {
      console.error(error.message);
    }
  }
};

// Run the test
testPythonService();
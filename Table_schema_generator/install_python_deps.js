const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Path to the Python service directory
const pythonServiceDir = path.join(__dirname, 'server', 'python_service');

// Check if Python is installed
const checkPython = () => {
  return new Promise((resolve, reject) => {
    console.log('Checking if Python is installed...');
    
    const pythonProcess = spawn('python', ['--version']);
    
    pythonProcess.stdout.on('data', (data) => {
      console.log(`Python version: ${data}`);
    });
    
    pythonProcess.stderr.on('data', (data) => {
      console.log(`Python version: ${data}`);
    });
    
    pythonProcess.on('close', (code) => {
      if (code === 0) {
        console.log('✅ Python is installed');
        resolve(true);
      } else {
        console.error('❌ Python is not installed or not in PATH');
        reject(new Error('Python is not installed or not in PATH'));
      }
    });
  });
};

// Install Python dependencies
const installDependencies = () => {
  return new Promise((resolve, reject) => {
    console.log('Installing Python dependencies...');
    
    // Ensure the requirements.txt file exists
    const requirementsPath = path.join(pythonServiceDir, 'requirements.txt');
    if (!fs.existsSync(requirementsPath)) {
      console.error(`❌ Requirements file not found at: ${requirementsPath}`);
      reject(new Error(`Requirements file not found at: ${requirementsPath}`));
      return;
    }
    
    const pipProcess = spawn('pip', ['install', '-r', 'requirements.txt'], {
      cwd: pythonServiceDir
    });
    
    pipProcess.stdout.on('data', (data) => {
      console.log(`${data}`);
    });
    
    pipProcess.stderr.on('data', (data) => {
      console.error(`${data}`);
    });
    
    pipProcess.on('close', (code) => {
      if (code === 0) {
        console.log('✅ Python dependencies installed successfully');
        resolve(true);
      } else {
        console.error(`❌ pip install failed with code ${code}`);
        reject(new Error(`pip install failed with code ${code}`));
      }
    });
  });
};

// Create the generated components directory if it doesn't exist
const ensureGeneratedComponentsDir = () => {
  const generatedDir = path.join(__dirname, 'src', 'components', 'generated');
  
  if (!fs.existsSync(generatedDir)) {
    console.log('Creating generated components directory...');
    fs.mkdirSync(generatedDir, { recursive: true });
    console.log(`✅ Created directory: ${generatedDir}`);
  } else {
    console.log(`✅ Directory already exists: ${generatedDir}`);
  }
};

// Main function
const main = async () => {
  try {
    console.log('=== Python Dependencies Installation ===');
    
    // Ensure the generated components directory exists
    ensureGeneratedComponentsDir();
    
    // Check if Python is installed
    await checkPython();
    
    // Install Python dependencies
    await installDependencies();
    
    console.log('\n✅ All Python dependencies installed successfully!');
    console.log('\nYou can now run the application with:');
    console.log('npm run dev');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('\nPlease fix the issues and try again.');
    process.exit(1);
  }
};

// Run the main function
main();
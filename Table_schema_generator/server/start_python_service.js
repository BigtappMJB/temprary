const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Path to the Python service directory
const pythonServiceDir = path.join(__dirname, 'python_service');

// Check if Python is installed
const checkPython = () => {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn('python', ['--version']);
    
    pythonProcess.on('close', (code) => {
      if (code === 0) {
        console.log('Python is installed');
        resolve(true);
      } else {
        console.error('Python is not installed or not in PATH');
        reject(new Error('Python is not installed or not in PATH'));
      }
    });
  });
};

// Install Python dependencies
const installDependencies = () => {
  return new Promise((resolve, reject) => {
    console.log('Installing Python dependencies...');
    
    const pipProcess = spawn('pip', ['install', '-r', 'requirements.txt'], {
      cwd: pythonServiceDir
    });
    
    pipProcess.stdout.on('data', (data) => {
      console.log(`pip: ${data}`);
    });
    
    pipProcess.stderr.on('data', (data) => {
      console.error(`pip error: ${data}`);
    });
    
    pipProcess.on('close', (code) => {
      if (code === 0) {
        console.log('Python dependencies installed successfully');
        resolve(true);
      } else {
        console.error(`pip install failed with code ${code}`);
        reject(new Error(`pip install failed with code ${code}`));
      }
    });
  });
};

// Start the Python Flask server
const startPythonServer = () => {
  console.log('Starting Python Flask server...');
  
  // Check if app.py exists
  const appPath = path.join(pythonServiceDir, 'app.py');
  if (!fs.existsSync(appPath)) {
    console.error(`Error: Python app file not found at ${appPath}`);
    process.exit(1);
  }
  
  const pythonProcess = spawn('python', ['app.py'], {
    cwd: pythonServiceDir
  });
  
  let serverStarted = false;
  
  pythonProcess.stdout.on('data', (data) => {
    console.log(`Python server: ${data}`);
    
    // Check if server has started successfully
    if (data.toString().includes('Running on http://')) {
      serverStarted = true;
      console.log('\n✅ Python service is running at http://127.0.0.1:5000');
      console.log('The template rendering service is now available for component generation.\n');
    }
  });
  
  pythonProcess.stderr.on('data', (data) => {
    console.error(`Python server error: ${data}`);
    
    // Flask often outputs to stderr even for normal operation
    // Check if server has started successfully in stderr too
    if (data.toString().includes('Running on http://')) {
      serverStarted = true;
      console.log('\n✅ Python service is running at http://127.0.0.1:5000');
      console.log('The template rendering service is now available for component generation.\n');
    }
  });
  
  pythonProcess.on('close', (code) => {
    if (code !== 0) {
      console.error(`❌ Python server exited with code ${code}`);
      if (!serverStarted) {
        console.error('The Python service failed to start. Please check the error messages above.');
        process.exit(1);
      }
    }
  });
  
  // Set a timeout to check if the server started
  setTimeout(() => {
    if (!serverStarted) {
      console.error('❌ Python server did not start within the expected time.');
      console.error('Please check if port 5000 is already in use or if there are other issues.');
    } else {
      console.log('✅ Python server startup confirmed');
    }
  }, 10000);  // Increased timeout to 10 seconds
  
  return pythonProcess;
};

// Create the generated components directory if it doesn't exist
const ensureGeneratedComponentsDir = () => {
  const generatedDir = path.join(__dirname, '..', 'src', 'components', 'generated');
  
  if (!fs.existsSync(generatedDir)) {
    console.log('Creating generated components directory...');
    fs.mkdirSync(generatedDir, { recursive: true });
  }
};

// Main function
const main = async () => {
  try {
    // Ensure the generated components directory exists
    ensureGeneratedComponentsDir();
    
    // Check if Python is installed
    await checkPython();
    
    // Install Python dependencies
    await installDependencies();
    
    // Start the Python server
    const pythonProcess = startPythonServer();
    
    // Handle process termination
    process.on('SIGINT', () => {
      console.log('Stopping Python server...');
      pythonProcess.kill();
      process.exit();
    });
    
    console.log('Python service started successfully');
  } catch (error) {
    console.error('Failed to start Python service:', error.message);
    process.exit(1);
  }
};

// Run the main function
main();
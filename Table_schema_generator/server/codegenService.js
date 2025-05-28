const fs = require('fs');
const path = require('path');

// Base paths
const COMPONENTS_DIR = path.join(__dirname, '..', 'src', 'components');
const APP_JS_PATH = path.join(__dirname, '..', 'src', 'App.js');

// Function to save a component file
const saveComponent = (componentName, componentCode) => {
  return new Promise((resolve, reject) => {
    const filePath = path.join(COMPONENTS_DIR, componentName);
    
    // Ensure the components directory exists
    if (!fs.existsSync(COMPONENTS_DIR)) {
      fs.mkdirSync(COMPONENTS_DIR, { recursive: true });
    }
    
    // Write the component file
    fs.writeFile(filePath, componentCode, 'utf8', (err) => {
      if (err) {
        console.error('Error writing component file:', err);
        reject(err);
      } else {
        console.log(`Component saved successfully to: ${filePath}`);
        resolve(filePath);
      }
    });
  });
};

// Function to update App.js to include the new component
const updateAppJs = (componentName, routeId, pageTitle) => {
  return new Promise((resolve, reject) => {
    // Read the current App.js file
    fs.readFile(APP_JS_PATH, 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading App.js:', err);
        reject(err);
        return;
      }
      
      // Remove the .js extension from component name if present
      const componentNameWithoutExt = componentName.replace(/\.js$/, '');
      
      // Check if the component is already imported
      const importRegex = new RegExp(`import\\s+${componentNameWithoutExt}\\s+from\\s+['"]./components/${componentNameWithoutExt}['"]`, 'g');
      
      let updatedContent = data;
      
      // Add import statement if not already present
      if (!importRegex.test(data)) {
        // Find the last import statement
        const lastImportIndex = data.lastIndexOf('import');
        const lastImportEndIndex = data.indexOf(';', lastImportIndex) + 1;
        
        // Insert the new import after the last import
        const importStatement = `\nimport ${componentNameWithoutExt} from './components/${componentNameWithoutExt}';`;
        updatedContent = updatedContent.slice(0, lastImportEndIndex) + importStatement + updatedContent.slice(lastImportEndIndex);
      }
      
      // Check if the route is already defined in the renderContent function
      const routeRegex = new RegExp(`case\\s+['"]${routeId}['"]:\\s*return\\s+<${componentNameWithoutExt}\\s*\\/>;`, 'g');
      
      if (!routeRegex.test(updatedContent)) {
        // Find the renderContent function
        const renderContentIndex = updatedContent.indexOf('const renderContent = () => {');
        if (renderContentIndex === -1) {
          reject(new Error('Could not find renderContent function in App.js'));
          return;
        }
        
        // Find the first case statement
        const firstCaseIndex = updatedContent.indexOf('case', renderContentIndex);
        if (firstCaseIndex === -1) {
          reject(new Error('Could not find case statements in renderContent function'));
          return;
        }
        
        // Insert the new case statement before the first case
        const newCaseStatement = `      case '${routeId}':\n        return <${componentNameWithoutExt} />;\n`;
        updatedContent = updatedContent.slice(0, firstCaseIndex) + newCaseStatement + updatedContent.slice(firstCaseIndex);
      }
      
      // Check if the route is already defined in the viewTitles object
      const viewTitlesRegex = new RegExp(`${routeId}:\\s*['"]${pageTitle}['"]`, 'g');
      
      if (!viewTitlesRegex.test(updatedContent)) {
        // Find the viewTitles object
        const viewTitlesIndex = updatedContent.indexOf('const viewTitles = {');
        if (viewTitlesIndex === -1) {
          reject(new Error('Could not find viewTitles object in App.js'));
          return;
        }
        
        // Find the first property in the viewTitles object
        const firstPropertyIndex = updatedContent.indexOf(':', viewTitlesIndex);
        const firstPropertyLineEndIndex = updatedContent.indexOf('\n', firstPropertyIndex);
        
        // Insert the new property after the first property line
        const newProperty = `\n      ${routeId}: '${pageTitle}',`;
        updatedContent = updatedContent.slice(0, firstPropertyLineEndIndex) + newProperty + updatedContent.slice(firstPropertyLineEndIndex);
      }
      
      // Update the sidebar menu items if needed
      // This is more complex and might require a more sophisticated approach
      // For now, we'll leave it to manual editing
      
      // Write the updated content back to App.js
      fs.writeFile(APP_JS_PATH, updatedContent, 'utf8', (writeErr) => {
        if (writeErr) {
          console.error('Error writing updated App.js:', writeErr);
          reject(writeErr);
        } else {
          console.log(`App.js updated successfully to include ${componentNameWithoutExt}`);
          resolve(true);
        }
      });
    });
  });
};

// Function to update the Sidebar.js file to include the new component
const updateSidebarJs = (routeId, pageTitle) => {
  return new Promise((resolve, reject) => {
    const sidebarJsPath = path.join(__dirname, '..', 'src', 'components', 'Sidebar.js');
    
    // Read the current Sidebar.js file
    fs.readFile(sidebarJsPath, 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading Sidebar.js:', err);
        reject(err);
        return;
      }
      
      // Check if the menu item is already defined
      const menuItemRegex = new RegExp(`{\\s*id:\\s*['"]${routeId}['"]`, 'g');
      
      if (!menuItemRegex.test(data)) {
        // Find the menuItems array
        const menuItemsIndex = data.indexOf('const menuItems = [');
        if (menuItemsIndex === -1) {
          reject(new Error('Could not find menuItems array in Sidebar.js'));
          return;
        }
        
        // Find the last item in the array
        const lastItemIndex = data.lastIndexOf('}', data.indexOf('];', menuItemsIndex));
        if (lastItemIndex === -1) {
          reject(new Error('Could not find last item in menuItems array'));
          return;
        }
        
        // Create the new menu item
        const newMenuItem = `,\n    { id: '${routeId}', text: '${pageTitle}', icon: <TableChartIcon /> }`;
        
        // Insert the new menu item after the last item
        const updatedContent = data.slice(0, lastItemIndex + 1) + newMenuItem + data.slice(lastItemIndex + 1);
        
        // Write the updated content back to Sidebar.js
        fs.writeFile(sidebarJsPath, updatedContent, 'utf8', (writeErr) => {
          if (writeErr) {
            console.error('Error writing updated Sidebar.js:', writeErr);
            reject(writeErr);
          } else {
            console.log(`Sidebar.js updated successfully to include ${routeId}`);
            resolve(true);
          }
        });
      } else {
        // Menu item already exists, no need to update
        resolve(true);
      }
    });
  });
};

module.exports = {
  saveComponent,
  updateAppJs,
  updateSidebarJs
};
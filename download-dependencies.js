/**
 * BPMN Viewer Dependency Downloader
 * 
 * This Node.js script downloads all the required dependencies for the BPMN Viewer project
 * and places them in the appropriate directories.
 * 
 * Usage: 
 * 1. Make sure you have Node.js installed
 * 2. Run: npm install fs-extra node-fetch@2 mkdirp
 * 3. Run: node download-dependencies.js
 */

const fs = require('fs-extra');
const fetch = require('node-fetch');
const path = require('path');
const mkdirp = require('mkdirp');

// Define dependencies to download
const dependencies = [
  // Bootstrap
  {
    url: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',
    dest: 'lib/bootstrap/bootstrap.min.css'
  },
  {
    url: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js',
    dest: 'lib/bootstrap/bootstrap.bundle.min.js'
  },
  
  // Font Awesome
  {
    url: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    dest: 'lib/fontawesome/all.min.css'
  },
  // Font Awesome webfonts (these need special handling - multiple files)
  
  // Ace Editor
  {
    url: 'https://cdnjs.cloudflare.com/ajax/libs/ace/1.11.2/ace.js',
    dest: 'lib/ace/ace.js'
  },
  {
    url: 'https://cdnjs.cloudflare.com/ajax/libs/ace/1.11.2/mode-xml.js',
    dest: 'lib/ace/mode-xml.js'
  },
  {
    url: 'https://cdnjs.cloudflare.com/ajax/libs/ace/1.11.2/theme-github.js',
    dest: 'lib/ace/theme-github.js'
  },
  {
    url: 'https://cdnjs.cloudflare.com/ajax/libs/ace/1.11.2/theme-tomorrow_night.js',
    dest: 'lib/ace/theme-tomorrow_night.js'
  },
  {
    url: 'https://cdnjs.cloudflare.com/ajax/libs/ace/1.11.2/theme-textmate.js',
    dest: 'lib/ace/theme-textmate.js'
  },
  
  // BPMN-JS
  {
    url: 'https://unpkg.com/bpmn-js@11.1.0/dist/bpmn-navigated-viewer.production.min.js',
    dest: 'lib/bpmn-js/bpmn-navigated-viewer.production.min.js'
  },
  {
    url: 'https://unpkg.com/bpmn-js@11.1.0/dist/assets/diagram-js.css',
    dest: 'lib/bpmn-js/assets/diagram-js.css'
  },
  {
    url: 'https://unpkg.com/bpmn-js@11.1.0/dist/assets/bpmn-font/css/bpmn.css',
    dest: 'lib/bpmn-js/assets/bpmn-font/css/bpmn.css'
  }
];

// Font Awesome webfonts - These filenames will be parsed from the CSS file
const fontAwesomeWebfonts = [
  'fa-brands-400.woff2',
  'fa-brands-400.ttf',
  'fa-regular-400.woff2',
  'fa-regular-400.ttf',
  'fa-solid-900.woff2',
  'fa-solid-900.ttf'
];

// BPMN font files - These filenames will be verified
const bpmnFontFiles = [
  'bpmn.woff',
  'bpmn.ttf',
  'bpmn.svg',
  'bpmn.eot'
];

// Create necessary directories
async function createDirectories() {
  const dirs = [
    'lib/bootstrap',
    'lib/fontawesome/webfonts',
    'lib/ace',
    'lib/bpmn-js/assets/bpmn-font/css',
    'lib/bpmn-js/assets/bpmn-font/font',
    'icons'
  ];
  
  for (const dir of dirs) {
    await mkdirp(dir);
    console.log(`Created directory: ${dir}`);
  }
}

// Download a file
async function downloadFile(url, dest) {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to download ${url}: ${response.statusText}`);
    }
    
    const buffer = await response.buffer();
    await fs.writeFile(dest, buffer);
    console.log(`Downloaded: ${dest}`);
    
    return buffer;
  } catch (error) {
    console.error(`Error downloading ${url}:`, error.message);
  }
}

// Download Font Awesome webfonts
async function downloadFontAwesomeWebfonts() {
  const baseUrl = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/webfonts/';
  
  for (const font of fontAwesomeWebfonts) {
    await downloadFile(`${baseUrl}${font}`, `lib/fontawesome/webfonts/${font}`);
  }
}

// Download BPMN font files
async function downloadBpmnFontFiles() {
  const baseUrl = 'https://unpkg.com/bpmn-js@11.1.0/dist/assets/bpmn-font/font/';
  
  for (const font of bpmnFontFiles) {
    await downloadFile(`${baseUrl}${font}`, `lib/bpmn-js/assets/bpmn-font/font/${font}`);
  }
}

// Main function
async function main() {
  try {
    console.log('Starting download of BPMN Viewer dependencies...');
    
    // Create necessary directories
    await createDirectories();
    
    // Download main dependencies
    for (const dep of dependencies) {
      await downloadFile(dep.url, dep.dest);
    }
    
    // Download Font Awesome webfonts
    console.log('\nDownloading Font Awesome webfonts...');
    await downloadFontAwesomeWebfonts();
    
    // Download BPMN font files
    console.log('\nDownloading BPMN font files...');
    await downloadBpmnFontFiles();
    
    console.log('\nDependencies download completed successfully!');
    console.log('\nNOTE: You still need to add custom icons for the Chrome extension in the "icons" folder.');
  } catch (error) {
    console.error('Error downloading dependencies:', error);
  }
}

// Run the script
main(); 
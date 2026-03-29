// Internationalization support
const translations = {
  en: {
    'app.title': 'BPMN Viewer',
    'app.footer': 'Powered by bpmn-js & bpmn-moddle',
    'editor.title': 'XML Editor',
    'editor.syntax': 'Syntax',
    'actions.title': 'Actions',
    'actions.select': 'Select BPMN file',
    'actions.selectFileButton': 'Choose file',
    'actions.noFileSelected': 'No file chosen',
    'actions.load': 'Load & Validate',
    'actions.exportSvg': 'Export SVG',
    'actions.exportPng': 'Export PNG',
    'diagram.title': 'Diagram Preview',
    'message.selectFile': 'Please select an XML or BPMN file',
    'actions.chooseFile': 'Choose file',
    'actions.noFileChosen': 'No file chosen',
    'message.invalidFormat': 'Invalid file format. Only .xml and .bpmn files are supported.',
    'message.invalidBPMN': 'Invalid BPMN 2.0 format: ',
    'message.parseError': 'Parse error: ',
    'message.exportSvgError': 'SVG export failed: ',
    'message.exportPngError': 'PNG export failed: ',
    'actions.dropFile': 'Drop BPMN/XML file here',
    'actions.syncCanvas': 'Sync to Canvas',
    'actions.fullscreen': 'Fullscreen',
    'actions.exitFullscreen': 'Exit Fullscreen',
    'actions.zoomIn': 'Zoom In',
    'actions.zoomOut': 'Zoom Out',
    'actions.zoomReset': 'Fit to Viewport'
  },
  zh: {
    'app.title': 'BPMN 查看器',
    'app.footer': '由 bpmn-js 和 bpmn-moddle 提供支持',
    'editor.title': 'XML 编辑',
    'editor.syntax': '语法',
    'actions.title': '操作',
    'actions.select': '选择 BPMN 文件',
    'actions.selectFileButton': '选择文件',
    'actions.noFileSelected': '未选择文件',
    'actions.load': '加载并验证',
    'actions.exportSvg': '导出 SVG',
    'actions.exportPng': '导出 PNG',
    'diagram.title': '流程图预览',
    'message.selectFile': '请选择 XML 或 BPMN 文件',
    'actions.chooseFile': '选择文件',
    'actions.noFileChosen': '未选择文件',
    'message.invalidFormat': '文件格式无效。仅支持 .xml 和 .bpmn 文件。',
    'message.invalidBPMN': 'BPMN 2.0 格式无效：',
    'message.parseError': '解析失败：',
    'message.exportSvgError': '导出SVG失败：',
    'message.exportPngError': '导出PNG失败：',
    'actions.dropFile': '拖拽 BPMN/XML 文件到此处',
    'actions.syncCanvas': '同步到画布',
    'actions.fullscreen': '全屏',
    'actions.exitFullscreen': '退出全屏',
    'actions.zoomIn': '放大',
    'actions.zoomOut': '缩小',
    'actions.zoomReset': '自适应视口'
  }
};

// Disable Web Workers for Chrome Extension CSP compatibility BEFORE any initialization
ace.config.set('useWorker', false);

// Initialize Ace Editor for XML
const xmlEditor = ace.edit('xmlEditor');
xmlEditor.session.setOption("useWorker", false); // Force disable on session level
xmlEditor.session.setMode('ace/mode/xml');
xmlEditor.setTheme('ace/theme/github');

// Theme management
function setTheme(theme) {
  if (theme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    document.getElementById('darkIcon').classList.add('d-none');
    document.getElementById('lightIcon').classList.remove('d-none');
    localStorage.setItem('bpmn-viewer-theme', 'dark');
    
    // Apply dark theme to editor
    xmlEditor.setTheme('ace/theme/tomorrow_night');
    const editorElement = document.getElementById('xmlEditor');
    if (editorElement) {
      editorElement.style.backgroundColor = 'var(--editor-background)';
      editorElement.style.color = 'var(--text-color)';
    }
    
    // Apply to ace editor DOM elements directly for better theme integration
    document.querySelectorAll('.ace_gutter, .ace_scroller, .ace_content').forEach(el => {
      el.style.backgroundColor = 'var(--editor-background)';
    });

    // Apply dark theme to file input
    const fileInput = document.getElementById('fileInput');
    if (fileInput) {
      fileInput.style.backgroundColor = 'var(--card-background)';
      fileInput.style.color = 'var(--text-color)';
      fileInput.style.borderColor = 'var(--border-color)';
    }
    
    // Sync with extension if in extension context
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.sync.set({ theme: 'dark' });
    }
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
    document.getElementById('lightIcon').classList.add('d-none');
    document.getElementById('darkIcon').classList.remove('d-none');
    localStorage.setItem('bpmn-viewer-theme', 'light');
    
    // Apply light theme to editor
    xmlEditor.setTheme('ace/theme/github');
    const editorElement = document.getElementById('xmlEditor');
    if (editorElement) {
      editorElement.style.backgroundColor = 'var(--editor-background)';
      editorElement.style.color = 'var(--text-color)';
    }
    
    // Apply to ace editor DOM elements directly for better theme integration
    document.querySelectorAll('.ace_gutter, .ace_scroller, .ace_content').forEach(el => {
      el.style.backgroundColor = 'var(--editor-background)';
    });

    // Apply light theme to file input
    const fileInput = document.getElementById('fileInput');
    if (fileInput) {
      fileInput.style.backgroundColor = 'var(--card-background)';
      fileInput.style.color = 'var(--text-color)';
      fileInput.style.borderColor = 'var(--border-color)';
    }
    
    // Sync with extension if in extension context
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.sync.set({ theme: 'light' });
    }
  }
  
  // Update lane labels when theme changes
  setTimeout(adjustLaneLabels, 100);
}

// Language management
function setLanguage(lang) {
  // Update inner text
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[lang] && translations[lang][key]) {
      // Special check for file status to not overwrite selected file name
      if (el.id === 'fileStatus' && fileState.selectedFile) {
        return;
      }
      el.textContent = translations[lang][key];
    }
  });

  // Update title attributes
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    const key = el.getAttribute('data-i18n-title');
    if (translations[lang] && translations[lang][key]) {
      // Special handling for fullscreen buttons to respect their current state
      if ((el.id === 'xmlFullscreenBtn' || el.id === 'canvasFullscreenBtn') && 
          el.closest('.card').classList.contains('fullscreen-overlay')) {
        el.setAttribute('title', translations[lang]['actions.exitFullscreen']);
      } else {
        el.setAttribute('title', translations[lang][key]);
      }
    }
  });
  
  // Update placeholder attributes
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (translations[lang] && translations[lang][key]) {
      el.setAttribute('placeholder', translations[lang][key]);
    }
  });

  // Update file status if no file is selected
  const fileStatus = document.getElementById('fileStatus');
  if (fileStatus && !fileState.selectedFile) {
    fileStatus.textContent = translations[lang]['actions.noFileChosen'];
  }
  
  document.getElementById('currentLanguage').textContent = lang === 'en' ? 'English' : '中文';
  document.documentElement.lang = lang;
  localStorage.setItem('bpmn-viewer-language', lang);
  
  // Sync with extension if in extension context
  if (typeof chrome !== 'undefined' && chrome.storage) {
    chrome.storage.sync.set({ language: lang });
  }
}

// Function to adjust lane labels
function adjustLaneLabels() {
  // Remove previously created custom labels
  document.querySelectorAll('.custom-lane-label').forEach(el => el.remove());
  
  // Get BPMN canvas SVG element
  const svg = document.querySelector('.djs-container svg');
  if (!svg) return;
  
  // Get all lanes and participants
  const lanes = Array.from(svg.querySelectorAll('g[data-element-id*="Lane_"], g[data-element-id*="Participant_"]'));
  
  // Current theme for styling
  const isDarkTheme = document.documentElement.getAttribute('data-theme') === 'dark';
  const textColor = isDarkTheme ? '#e0e0e0' : '#212529';
  const bgColor = isDarkTheme ? '#252525' : 'white';
  
  lanes.forEach(lane => {
    // Get lane ID and original label text
    const laneId = lane.getAttribute('data-element-id');
    const originalLabel = lane.querySelector('text.djs-label');
    
    if (!originalLabel) return;
    
    const labelText = originalLabel.textContent || '';
    
    // Get lane rectangle element
    const rect = lane.querySelector('rect');
    if (!rect) return;
    
    // Get lane position and dimensions
    const x = parseFloat(rect.getAttribute('x'));
    const y = parseFloat(rect.getAttribute('y'));
    const width = parseFloat(rect.getAttribute('width'));
    const height = parseFloat(rect.getAttribute('height'));
    
    // Create custom label container
    let customLabelGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    customLabelGroup.classList.add('custom-lane-label');
    customLabelGroup.setAttribute('data-custom-label-for', laneId);
    
    // Create background rectangle
    let bgRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    bgRect.setAttribute('x', x + 5);
    bgRect.setAttribute('y', y + 10);
    bgRect.setAttribute('width', 110);
    bgRect.setAttribute('height', 30);
    bgRect.setAttribute('fill', bgColor);
    bgRect.setAttribute('stroke', 'none');
    bgRect.setAttribute('rx', '3');
    
    // Create text label
    let textLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    textLabel.setAttribute('x', x + 60); // Centered
    textLabel.setAttribute('y', y + 25); // Vertically centered
    textLabel.setAttribute('text-anchor', 'middle');
    textLabel.setAttribute('dominant-baseline', 'middle');
    textLabel.setAttribute('fill', textColor);
    textLabel.textContent = labelText;
    
    // Add elements to custom label group
    customLabelGroup.appendChild(bgRect);
    customLabelGroup.appendChild(textLabel);
    
    // Add custom label group to SVG
    svg.appendChild(customLabelGroup);
  });
}

// Function to validate BPMN 2.0 format
async function validateBPMN(xml) {
  // Check for basic BPMN 2.0 namespace
  if (!xml.includes('http://www.omg.org/spec/BPMN/20100524/MODEL')) {
    throw new Error('Missing BPMN 2.0 namespace declaration');
  }

  // Check for basic BPMN structure
  if (!xml.includes('<definitions') && !xml.includes('<bpmn:definitions')) {
    throw new Error('Missing BPMN definitions element');
  }

  // Additional validation will be performed by bpmn-js during import
  return true;
}

// File handling state management
const fileState = {
  selectedFile: null,
  isProcessing: false,
  reset() {
    this.selectedFile = null;
    this.isProcessing = false;
    const fileInput = document.getElementById('fileInput');
    const fileStatus = document.getElementById('fileStatus');
    const loadBtn = document.getElementById('loadBtn');
    const msg = document.getElementById('message');
    const currentLang = document.documentElement.lang || 'en';
    
    if (fileInput) fileInput.value = '';
    if (fileStatus) fileStatus.textContent = translations[currentLang]['actions.noFileChosen'];
    if (loadBtn) loadBtn.disabled = true;
    if (msg) {
      msg.textContent = '';
      msg.className = 'mt-2';
    }
  }
};

// Load diagram function
async function loadDiagram(xml, viewer, canvas) {
  if (fileState.isProcessing) {
    console.warn('File processing in progress, please wait...');
    return;
  }
  
  const currentLang = localStorage.getItem('bpmn-viewer-language') || 'en';
  const msg = document.getElementById('message');
  
  try {
    fileState.isProcessing = true;
    msg.textContent = '';
    msg.className = 'mt-2 text-danger';
    
    // Validate BPMN format first
    await validateBPMN(xml);
    
    // Import XML and get warnings if any
    const result = await viewer.importXML(xml);
    
    // Set editor content
    xmlEditor.setValue(xml, -1);
    
    // Auto-adjust view to fit content
    try {
      if (typeof canvas.zoom === 'function') {
        // Delay slightly to ensure DOM is updated
        setTimeout(() => {
          canvas.zoom('fit-viewport');
          // Add a small margin after fitting
          const viewbox = canvas.viewbox();
          canvas.viewbox({
            x: viewbox.x - 20,
            y: viewbox.y - 20,
            width: viewbox.width + 40,
            height: viewbox.height + 40
          });
        }, 100);
      }
    } catch (e) {
      console.warn('Auto zoom failed:', e);
    }
    
    // Show warnings if any
    if (result && result.warnings && result.warnings.length > 0) {
      msg.className = 'mt-2 text-warning';
      msg.textContent = result.warnings.map(w => w.message).join('\n');
    }
    
    // Reset file state after successful load
    fileState.reset();
    
    // Save to local storage for workspace memory
    try {
      localStorage.setItem('bpmn-viewer-last-content', xml);
    } catch (e) {
      console.warn('Failed to save to local storage (file might be too large):', e);
    }
    
    // Adjust lane labels
    setTimeout(adjustLaneLabels, 200);
    setTimeout(adjustLaneLabels, 500);
  } catch (e) {
    msg.textContent = translations[currentLang]['message.invalidBPMN'] + e.message;
    fileState.reset();
    throw e;
  } finally {
    fileState.isProcessing = false;
  }
}

// Main initialization function
document.addEventListener('DOMContentLoaded', function() {
  // Load saved preferences
  let savedTheme = localStorage.getItem('bpmn-viewer-theme') || 'light';
  let savedLanguage = localStorage.getItem('bpmn-viewer-language') || 'en';
  
  // 确保立即应用语言和主题设置
  setLanguage(savedLanguage);
  setTheme(savedTheme);
  
  // 初始化文件状态显示 - 强制设置
  setTimeout(() => {
    const fileStatus = document.getElementById('fileStatus');
    if (fileStatus && !fileState.selectedFile) {
      fileStatus.textContent = translations[savedLanguage]['actions.noFileChosen'];
      fileStatus.setAttribute('data-i18n', 'actions.noFileChosen');
      console.log('初始化文件状态:', translations[savedLanguage]['actions.noFileChosen']);
    }
  }, 100);
  
  // Check if running in Chrome extension context
  if (typeof chrome !== 'undefined' && chrome.storage) {
    chrome.storage.sync.get(['theme', 'language'], function(result) {
      // Override local storage values with extension values if they exist
      if (result.theme) {
        savedTheme = result.theme;
        setTheme(savedTheme);
      }
      
      if (result.language) {
        savedLanguage = result.language;
        setLanguage(savedLanguage);
        // 重新设置文件状态显示 - 强制更新
        setTimeout(() => {
          const fileStatus = document.getElementById('fileStatus');
          if (fileStatus && !fileState.selectedFile) {
            fileStatus.textContent = translations[savedLanguage]['actions.noFileChosen'];
            fileStatus.setAttribute('data-i18n', 'actions.noFileChosen');
            console.log('Chrome扩展环境文件状态:', translations[savedLanguage]['actions.noFileChosen']);
          }
        }, 100);
      }
    });
  }
  
  // Check if bpmn-js is loaded
  if (typeof BpmnJS === 'undefined') {
    document.getElementById('message').textContent = translations[savedLanguage]['message.parseError'] + 
                                                'BPMN library failed to load, please refresh';
    return;
  }
  
  // Create BpmnJS instance
  const viewer = new BpmnJS({
    container: '#canvas'
  });
  
  // Get necessary modules
  const canvas = viewer.get('canvas');
  const eventBus = viewer.get('eventBus');

  // Load last saved content if available
  const lastContent = localStorage.getItem('bpmn-viewer-last-content');
  if (lastContent) {
    loadDiagram(lastContent, viewer, canvas).catch(e => {
      console.warn('Failed to load previous workspace:', e);
      localStorage.removeItem('bpmn-viewer-last-content');
    });
  }
  
  // Add manual drag support
  let isDragging = false;
  let lastX = 0;
  let lastY = 0;
  
  const canvasElement = document.getElementById('canvas');
  
  // Keyboard Shortcuts
  document.addEventListener('keydown', (e) => {
    // Only trigger if we are not typing in the XML editor
    if (document.activeElement.tagName === 'TEXTAREA' || document.activeElement.tagName === 'INPUT') {
      return;
    }

    // '+' or '=' to Zoom In
    if (e.key === '+' || e.key === '=') {
      try { canvas.zoom(canvas.zoom() + 0.1); } catch (err) {}
    }
    // '-' or '_' to Zoom Out
    else if (e.key === '-' || e.key === '_') {
      try { canvas.zoom(canvas.zoom() - 0.1); } catch (err) {}
    }
    // '0' or 'f' to Fit to viewport
    else if (e.key === '0' || e.key.toLowerCase() === 'f') {
      try { canvas.zoom('fit-viewport'); } catch (err) {}
    }
    // 'Esc' to exit fullscreen
    else if (e.key === 'Escape') {
      const xmlContainer = document.getElementById('xmlEditor').closest('.card');
      const canvasContainer = document.getElementById('canvas').closest('.card');
      
      if (xmlContainer.classList.contains('fullscreen-overlay')) {
        toggleFullscreen('xmlEditor', 'xmlFullscreenBtn');
      }
      if (canvasContainer.classList.contains('fullscreen-overlay')) {
        toggleFullscreen('canvas', 'canvasFullscreenBtn');
      }
    }
  });
  
  canvasElement.addEventListener('mousedown', function(e) {
    isDragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
    canvasElement.style.cursor = 'grabbing';
  });
  
  document.addEventListener('mousemove', function(e) {
    if (isDragging) {
      const deltaX = e.clientX - lastX;
      const deltaY = e.clientY - lastY;
      
      try {
        const viewbox = canvas.viewbox();
        canvas.viewbox({
          x: viewbox.x - deltaX / viewbox.scale,
          y: viewbox.y - deltaY / viewbox.scale,
          width: viewbox.width,
          height: viewbox.height
        });
      } catch (err) {
        console.error('Failed to pan:', err);
      }
      
      lastX = e.clientX;
      lastY = e.clientY;
    }
  });
  
  document.addEventListener('mouseup', function() {
    isDragging = false;
    canvasElement.style.cursor = 'grab';
  });

  // Add mouse wheel zoom support
  canvasElement.addEventListener('wheel', function(e) {
    e.preventDefault();
    try {
      if (typeof canvas.zoom === 'function') {
        // Calculate zoom step based on scroll direction
        const zoomStep = e.deltaY > 0 ? -0.1 : 0.1;
        
        // Get current zoom level
        const currentZoom = canvas.zoom();
        
        // Calculate target zoom, limiting between 0.2 and 5.0
        let targetZoom = currentZoom + zoomStep;
        targetZoom = Math.max(0.2, Math.min(targetZoom, 5.0));
        
        // Apply zoom using cursor position as center
        const rect = canvasElement.getBoundingClientRect();
        const position = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        };
        
        canvas.zoom(targetZoom, position);
      }
    } catch (err) {
      console.warn('Wheel zoom failed:', err);
    }
  }, { passive: false });

  // Add zoom button events
  document.querySelector('.zoom-in').addEventListener('click', () => {
    try {
      if (typeof canvas.zoom === 'function') {
        canvas.zoom(canvas.zoom() + 0.1);
      }
    } catch (e) {
      console.warn('Zoom in failed:', e);
    }
  });
  
  document.querySelector('.zoom-out').addEventListener('click', () => {
    try {
      if (typeof canvas.zoom === 'function') {
        canvas.zoom(canvas.zoom() - 0.1);
      }
    } catch (e) {
      console.warn('Zoom out failed:', e);
    }
  });
  
  document.querySelector('.zoom-reset').addEventListener('click', () => {
    try {
      if (typeof canvas.zoom === 'function') {
        canvas.zoom('fit-viewport');
      }
    } catch (e) {
      console.warn('Zoom reset failed:', e);
    }
  });
  
  // File input change handler
  const fileInput = document.getElementById('fileInput');
  const loadBtn = document.getElementById('loadBtn');
  const msg = document.getElementById('message');

  if (fileInput) {
    // Reset initial state
    fileState.reset();
    
    fileInput.addEventListener('change', function(event) {
      event.preventDefault();
      
      const currentLang = document.documentElement.lang || 'en';
      msg.textContent = '';
      msg.className = 'mt-2 text-danger';

      if (this.files.length > 0) {
        const file = this.files[0];
        const extension = file.name.toLowerCase().split('.').pop();
        
        // 移除文件扩展名检查，允许任何后缀的文件，只要内容是有效的BPMN格式
        
        fileState.selectedFile = file;
        const fileStatus = document.getElementById('fileStatus');
        if (fileStatus) fileStatus.textContent = file.name;
        loadBtn.disabled = false;
      } else {
        fileState.reset();
      }
    });
  }

  // Drag and drop file support
  const dropOverlay = document.getElementById('dropOverlay');
  
  if (dropOverlay) {
    window.addEventListener('dragover', (e) => {
      e.preventDefault();
      // Only show overlay if it's a file drag
      if (e.dataTransfer.types.includes('Files')) {
        dropOverlay.classList.remove('d-none');
      }
    });
    
    window.addEventListener('dragleave', (e) => {
      e.preventDefault();
      if (e.target === dropOverlay) {
        dropOverlay.classList.add('d-none');
      }
    });
    
    window.addEventListener('drop', (e) => {
      e.preventDefault();
      dropOverlay.classList.add('d-none');
      
      if (e.dataTransfer.files.length > 0) {
        const file = e.dataTransfer.files[0];
        
        fileState.selectedFile = file;
        const fileStatus = document.getElementById('fileStatus');
        if (fileStatus) fileStatus.textContent = file.name;
        if (loadBtn) loadBtn.disabled = false;
        
        // Auto-load if dropped
        const currentLang = localStorage.getItem('bpmn-viewer-language') || 'en';
        const reader = new FileReader();
        reader.onload = async () => {
          try {
            let xmlContent = reader.result;
            if (xmlContent.includes('getProcessResponse') || xmlContent.includes('_tns_:')) {
              const definitionsMatch = xmlContent.match(/<definitions[\s\S]*?<\/definitions>/i);
              if (definitionsMatch) xmlContent = definitionsMatch[0];
            }
            await loadDiagram(xmlContent, viewer, canvas);
          } catch (err) {
            console.error('Failed to load diagram:', err);
            msg.textContent = 'Parse error: ' + err.message;
            fileState.reset();
          }
        };
        reader.onerror = () => {
          msg.textContent = translations[currentLang]['message.parseError'] + 'Failed to read file';
          fileState.reset();
        };
        reader.readAsText(file);
      }
    });
  }
  
  // Load button click handler
  if (loadBtn) {
    loadBtn.disabled = true;

    loadBtn.addEventListener('click', async (event) => {
      event.preventDefault();
      
      const currentLang = localStorage.getItem('bpmn-viewer-language') || 'en';
      
      if (!fileState.selectedFile || fileState.isProcessing) {
        msg.textContent = translations[currentLang]['message.selectFile'];
        return;
      }
      
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          let xmlContent = reader.result;
          
          // 检查是否是Web服务响应格式，如果是则提取BPMN内容
          if (xmlContent.includes('getProcessResponse') || xmlContent.includes('_tns_:')) {
            const definitionsMatch = xmlContent.match(/<definitions[\s\S]*?<\/definitions>/i);
            if (definitionsMatch) {
              xmlContent = definitionsMatch[0];
            }
          }
          
          await loadDiagram(xmlContent, viewer, canvas);
        } catch (e) {
          console.error('Failed to load diagram:', e);
          msg.textContent = 'Parse error: ' + e.message;
          fileState.reset();
        }
      };
      
      reader.onerror = () => {
        msg.textContent = translations[currentLang]['message.parseError'] + 'Failed to read file';
        fileState.reset();
      };
      
      reader.readAsText(fileState.selectedFile);
    });
  }

  // Sync Editor to Canvas button handler
  const syncEditorBtn = document.getElementById('syncEditorBtn');
  if (syncEditorBtn) {
    syncEditorBtn.addEventListener('click', async (event) => {
      event.preventDefault();
      const currentLang = localStorage.getItem('bpmn-viewer-language') || 'en';
      const xml = xmlEditor.getValue();
      
      if (!xml || xml.trim() === '') {
        msg.textContent = translations[currentLang]['message.invalidBPMN'] + 'Empty content';
        return;
      }

      try {
        await loadDiagram(xml, viewer, canvas);
      } catch (e) {
        console.error('Failed to sync diagram:', e);
        msg.textContent = 'Sync error: ' + e.message;
      }
    });
  }

  // Export buttons
  const exportSvgBtn = document.getElementById('exportSvgBtn');
  const exportPngBtn = document.getElementById('exportPngBtn');
  
  // Export SVG implementation
  exportSvgBtn.addEventListener('click', async () => {
    const currentLang = localStorage.getItem('bpmn-viewer-language') || 'en';
    try {
      const { svg } = await viewer.saveSVG();
      const blob = new Blob([svg], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); 
      a.href = url; 
      a.download = 'diagram.svg'; 
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      msg.textContent = translations[currentLang]['message.exportSvgError'] + e.message;
    }
  });
  
  // Export PNG implementation
  exportPngBtn.addEventListener('click', async () => {
    const currentLang = localStorage.getItem('bpmn-viewer-language') || 'en';
    try {
      const { svg } = await viewer.saveSVG();
      const img = new Image();
      const url = URL.createObjectURL(new Blob([svg], { type:'image/svg+xml' }));
      img.onload = () => {
        const c = document.createElement('canvas'); 
        c.width = img.width; 
        c.height = img.height;
        c.getContext('2d').drawImage(img, 0, 0);
        c.toBlob(b => { 
          const a = document.createElement('a'); 
          a.href = URL.createObjectURL(b); 
          a.download = 'diagram.png'; 
          a.click(); 
        });
        URL.revokeObjectURL(url);
      };
      img.src = url;
    } catch (e) {
      msg.textContent = translations[currentLang]['message.exportPngError'] + e.message;
    }
  });
  
  // Language toggle event
  document.getElementById('languageToggle').addEventListener('click', () => {
    const currentLang = document.documentElement.lang || 'en';
    setLanguage(currentLang === 'en' ? 'zh' : 'en');
  });
  
  // Theme toggle event
  document.getElementById('themeToggle').addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    setTheme(currentTheme === 'light' ? 'dark' : 'light');
  });

  // Fullscreen Handlers
  window.toggleFullscreen = function(elementId, btnId) {
    const container = document.getElementById(elementId).closest('.card');
    const btn = document.getElementById(btnId);
    const icon = btn.querySelector('i');
    const currentLang = document.documentElement.lang || 'en';
    
    if (container.classList.contains('fullscreen-overlay')) {
      container.classList.remove('fullscreen-overlay');
      icon.classList.remove('fa-compress');
      icon.classList.add('fa-expand');
      btn.setAttribute('title', translations[currentLang]['actions.fullscreen']);
      btn.setAttribute('data-i18n-title', 'actions.fullscreen');
    } else {
      container.classList.add('fullscreen-overlay');
      icon.classList.remove('fa-expand');
      icon.classList.add('fa-compress');
      btn.setAttribute('title', translations[currentLang]['actions.exitFullscreen']);
      btn.setAttribute('data-i18n-title', 'actions.exitFullscreen');
    }
    
    // Resize Ace Editor or BPMN Canvas if needed
    if (elementId === 'xmlEditor') {
      xmlEditor.resize();
    } else if (elementId === 'canvas') {
      try {
        if (typeof canvas.zoom === 'function') {
          setTimeout(() => canvas.zoom('fit-viewport'), 50);
        }
      } catch (e) {}
    }
  }

  const xmlFullscreenBtn = document.getElementById('xmlFullscreenBtn');
  if (xmlFullscreenBtn) {
    xmlFullscreenBtn.addEventListener('click', (e) => {
      e.preventDefault();
      toggleFullscreen('xmlEditor', 'xmlFullscreenBtn');
    });
  }

  const canvasFullscreenBtn = document.getElementById('canvasFullscreenBtn');
  if (canvasFullscreenBtn) {
    canvasFullscreenBtn.addEventListener('click', (e) => {
      e.preventDefault();
      toggleFullscreen('canvas', 'canvasFullscreenBtn');
    });
  }
  
  // Syntax highlighting toggle
  const syntaxHighlightToggle = document.getElementById('syntaxHighlightToggle');
  if (syntaxHighlightToggle) {
    syntaxHighlightToggle.addEventListener('change', function() {
      if (this.checked) {
        xmlEditor.session.setMode('ace/mode/xml');
      } else {
        xmlEditor.session.setMode('ace/mode/text');
      }
      // Re-enforce no-worker policy after mode switch
      xmlEditor.session.setOption("useWorker", false);
    });
  }
  
  // Listen to events to adjust lane labels
  eventBus.on(['shape.added', 'shape.changed', 'render.shape'], function(event) {
    if (event.element && (event.element.type === 'bpmn:Lane' || event.element.type === 'bpmn:Participant')) {
      // When lanes are rendered or changed, readjust all labels
      setTimeout(adjustLaneLabels, 50);
    }
  });
  
  // Adjust all labels after import
  eventBus.on('import.done', function() {
    // Use multiple delays to catch different rendering phases
    setTimeout(adjustLaneLabels, 100);
    setTimeout(adjustLaneLabels, 300);
    setTimeout(adjustLaneLabels, 500);
    setTimeout(adjustLaneLabels, 1000);
  });
  
  // Listen to canvas zoom and view change events
  eventBus.on(['canvas.viewbox.changed', 'canvas.resized'], function() {
    setTimeout(adjustLaneLabels, 50);
  });

}); 
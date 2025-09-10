/**
 * Visual Search Widget JavaScript
 * Handles image upload, search API calls, and results display
 */

(function() {
  'use strict';

  // Configuration
  const config = window.VisualSearchConfig || {
    apiUrl: 'https://visual-search.railway.app', // Update with your deployed backend URL
    shopDomain: window.location.hostname.replace('.myshopify.com', '')
  };

  // DOM elements
  let elements = {};

  // State
  let isSearching = false;

  /**
   * Initialize the visual search widget
   */
  function init() {
    // Get DOM elements
    elements = {
      widget: document.getElementById('visual-search-widget'),
      button: document.getElementById('visual-search-button'),
      modal: document.getElementById('visual-search-modal'),
      close: document.getElementById('visual-search-close'),
      fileInput: document.getElementById('visual-search-file-input'),
      cameraBtn: document.getElementById('visual-search-camera'),
      uploadBtn: document.getElementById('visual-search-upload-btn'),
      uploadArea: document.querySelector('.visual-search-upload-area'),
      upload: document.getElementById('visual-search-upload'),
      loading: document.getElementById('visual-search-loading'),
      results: document.getElementById('visual-search-results'),
      resultsGrid: document.getElementById('visual-search-results-grid'),
      error: document.getElementById('visual-search-error'),
      retry: document.getElementById('visual-search-retry')
    };

    // Check if required elements exist
    if (!elements.button || !elements.modal) {
      console.warn('Visual Search: Required elements not found');
      return;
    }

    // Bind events
    bindEvents();

    // Apply position setting if available
    applyPosition();

    console.log('Visual Search: Widget initialized');
  }

  /**
   * Bind event listeners
   */
  function bindEvents() {
    // Open modal
    elements.button.addEventListener('click', openModal);

    // Close modal
    elements.close.addEventListener('click', closeModal);
    elements.modal.addEventListener('click', function(e) {
      if (e.target === elements.modal || e.target.classList.contains('visual-search-modal-overlay')) {
        closeModal();
      }
    });

    // File input change
    elements.fileInput.addEventListener('change', handleFileSelect);

    // Upload buttons
    elements.cameraBtn.addEventListener('click', function() {
      elements.fileInput.setAttribute('capture', 'environment');
      elements.fileInput.click();
    });

    elements.uploadBtn.addEventListener('click', function() {
      elements.fileInput.removeAttribute('capture');
      elements.fileInput.click();
    });

    // Upload area click
    elements.uploadArea.addEventListener('click', function() {
      elements.fileInput.click();
    });

    // Drag and drop
    elements.uploadArea.addEventListener('dragover', function(e) {
      e.preventDefault();
      elements.uploadArea.style.borderColor = '#000';
    });

    elements.uploadArea.addEventListener('dragleave', function(e) {
      e.preventDefault();
      elements.uploadArea.style.borderColor = '#ccc';
    });

    elements.uploadArea.addEventListener('drop', function(e) {
      e.preventDefault();
      elements.uploadArea.style.borderColor = '#ccc';
      
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        handleFile(files[0]);
      }
    });

    // Retry button
    elements.retry.addEventListener('click', resetToUpload);

    // Keyboard events
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && elements.modal.style.display !== 'none') {
        closeModal();
      }
    });
  }

  /**
   * Apply position setting
   */
  function applyPosition() {
    const widget = elements.widget;
    const position = widget.dataset.position;
    
    if (position) {
      widget.setAttribute('data-position', position);
    }
  }

  /**
   * Open the modal
   */
  function openModal() {
    elements.modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    resetToUpload();
  }

  /**
   * Close the modal
   */
  function closeModal() {
    elements.modal.style.display = 'none';
    document.body.style.overflow = '';
    resetToUpload();
  }

  /**
   * Reset to upload state
   */
  function resetToUpload() {
    showSection('upload');
    elements.fileInput.value = '';
    isSearching = false;
  }

  /**
   * Show a specific section
   */
  function showSection(section) {
    elements.upload.style.display = section === 'upload' ? 'block' : 'none';
    elements.loading.style.display = section === 'loading' ? 'block' : 'none';
    elements.results.style.display = section === 'results' ? 'block' : 'none';
    elements.error.style.display = section === 'error' ? 'block' : 'none';
  }

  /**
   * Handle file selection
   */
  function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
      handleFile(file);
    }
  }

  /**
   * Handle file processing
   */
  function handleFile(file) {
    // Validate file
    if (!file.type.startsWith('image/')) {
      showError('Please select an image file.');
      return;
    }

    if (file.size > 8 * 1024 * 1024) { // 8MB limit
      showError('Image file is too large. Please choose a smaller image.');
      return;
    }

    // Start search
    performSearch(file);
  }

  /**
   * Perform visual search
   */
  async function performSearch(file) {
    if (isSearching) return;

    isSearching = true;
    showSection('loading');

    try {
      // Create form data
      const formData = new FormData();
      formData.append('image', file);
      formData.append('shop_domain', config.shopDomain);
      formData.append('limit', '24');

      // Make API request
      const response = await fetch(`${config.apiUrl}/search`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Search failed: ${response.status}`);
      }

      const data = await response.json();

      // Display results
      displayResults(data.results || []);

    } catch (error) {
      console.error('Visual Search Error:', error);
      showError('Search failed. Please try again.');
    } finally {
      isSearching = false;
    }
  }

  /**
   * Display search results
   */
  function displayResults(results) {
    if (!results || results.length === 0) {
      showError('No similar products found. Try a different image.');
      return;
    }

    // Clear previous results
    elements.resultsGrid.innerHTML = '';

    // Add results
    results.forEach(function(result) {
      const item = createResultItem(result);
      elements.resultsGrid.appendChild(item);
    });

    showSection('results');
  }

  /**
   * Create a result item element
   */
  function createResultItem(result) {
    const item = document.createElement('a');
    item.className = 'visual-search-result-item';
    item.href = result.url;
    item.target = '_blank';

    const score = Math.round(result.score * 100);

    item.innerHTML = `
      <img 
        src="${escapeHtml(result.image)}" 
        alt="${escapeHtml(result.title)}"
        class="visual-search-result-image"
        loading="lazy"
      />
      <div class="visual-search-result-info">
        <h5 class="visual-search-result-title">${escapeHtml(result.title)}</h5>
        <p class="visual-search-result-score">${score}% match</p>
      </div>
    `;

    return item;
  }

  /**
   * Show error state
   */
  function showError(message) {
    const errorElement = elements.error.querySelector('p');
    if (errorElement) {
      errorElement.textContent = message;
    }
    showSection('error');
  }

  /**
   * Escape HTML to prevent XSS
   */
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Check if device supports camera
   */
  function supportsCamera() {
    return navigator.mediaDevices && navigator.mediaDevices.getUserMedia;
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Export for debugging
  window.VisualSearch = {
    init: init,
    openModal: openModal,
    closeModal: closeModal,
    config: config
  };

})();
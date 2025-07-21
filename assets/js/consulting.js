// Form handling and social proof dashboard functionality

document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('helpForm');
  const makingPath = document.getElementById('making-path');
  const finalSection = document.getElementById('final-section');
  const successMessage = document.getElementById('success-message');
  const successModal = document.getElementById('successModal');
  const fileUploadArea = document.getElementById('fileUploadArea');
  const fileList = document.getElementById('fileList');
  const submitButton = form.querySelector('button[type="submit"]');
  const buttonText = submitButton.querySelector('.button-text');
  const loadingSpinner = submitButton.querySelector('.loading-spinner');
  
  // API configuration
  const API_BASE_URL = process.env.NODE_ENV === 'production' 
    ? 'https://your-render-app.onrender.com' 
    : 'http://localhost:3000';
  
  // Handle all radio button changes
  document.querySelectorAll('input[type="radio"]').forEach(radio => {
    // Set initial state for all radio buttons
    if (radio.checked) {
      radio.closest('.radio-option').classList.add('selected');
    }

    // Add change event listener to all radio buttons
    radio.addEventListener('change', function() {
      const name = this.name;
      
      // Update visual selection for all radio buttons in the same group
      document.querySelectorAll(`input[name="${name}"]`).forEach(input => {
        input.closest('.radio-option').classList.remove('selected');
      });
      this.closest('.radio-option').classList.add('selected');
      
      // Handle form logic for help-type selection
      if (name === 'help-type') {
        handleHelpTypeSelection(this.value);
      }
      
      // Show final section if we have a main selection
      if (document.querySelector('input[name="help-type"]:checked')) {
        finalSection.classList.remove('hidden');
      }
    });
  });

  // Also handle clicks on the radio option container
  document.querySelectorAll('.radio-option').forEach(option => {
    option.addEventListener('click', function(e) {
      // Don't trigger if clicking the actual radio input
      if (e.target.type === 'radio') return;
      
      const radio = this.querySelector('input[type="radio"]');
      if (radio) {
        radio.checked = true;
        // Trigger the change event
        radio.dispatchEvent(new Event('change'));
      }
    });
  });

  function handleHelpTypeSelection(value) {
    // Hide all paths first
    makingPath.classList.add('hidden');
    
    // Show selected path
    if (value === 'making') {
      makingPath.classList.remove('hidden');
    }
  }

  // File upload handling
  const fileUploads = document.querySelectorAll('.file-upload');
  fileUploads.forEach(upload => {
    const input = upload.querySelector('input[type="file"]');
    if (input) {
      input.addEventListener('change', function(e) {
        const fileCount = e.target.files.length;
        if (fileCount > 0) {
          upload.querySelector('p').innerHTML = `✅ ${fileCount} file(s) selected`;
        }
      });
    }
  });

  // Drag and drop handling
  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    fileUploadArea.addEventListener(eventName, preventDefaults, false);
  });

  function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  ['dragenter', 'dragover'].forEach(eventName => {
    fileUploadArea.addEventListener(eventName, highlight, false);
  });

  ['dragleave', 'drop'].forEach(eventName => {
    fileUploadArea.addEventListener(eventName, unhighlight, false);
  });

  function highlight(e) {
    fileUploadArea.classList.add('highlight');
  }

  function unhighlight(e) {
    fileUploadArea.classList.remove('highlight');
  }

  fileUploadArea.addEventListener('drop', handleDrop, false);

  function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFiles(files);
  }

  // Form submission
  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Basic validation
    const email = document.getElementById('email').value;
    const consent = document.getElementById('consent').checked;
    const helpType = document.querySelector('input[name="help-type"]:checked');
    
    if (!email || !consent || !helpType) {
      alert('Please fill in all required fields and check the consent box.');
      return;
    }

    // Show loading state
    const submitBtn = form.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="loading-spinner"></span> Sending...';

    try {
      // Prepare form data
      const formData = new FormData(form);
      const data = {
        helpType: formData.get('help-type'),
        email: formData.get('email'),
        estimatedValue: formData.get('estimated-value'),
        additionalInfo: formData.get('additional-info'),
        referral: formData.get('referral'),
        timestamp: new Date().toISOString()
      };

      // Add making-specific data if applicable
      if (data.helpType === 'making') {
        data.buildDescription = formData.get('build-description');
        data.audience = formData.get('making-audience');
        data.referenceLinks = formData.get('reference-links');
      }

      // Handle file uploads
      const fileInputs = form.querySelectorAll('input[type="file"]');
      const files = [];
      for (const input of fileInputs) {
        if (input.files.length > 0) {
          for (const file of input.files) {
            const base64 = await fileToBase64(file);
            files.push({
              name: file.name,
              content: base64
            });
          }
        }
      }
      if (files.length > 0) {
        data.files = files;
      }

      // Submit to API
      const response = await fetch(`${API_BASE_URL}/api/consulting/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Network response was not ok');
      }

      const result = await response.json();

      // Show success message
      form.style.display = 'none';
      successMessage.style.display = 'block';
      successMessage.scrollIntoView({ behavior: 'smooth' });

      // Update social proof data
      await loadSocialProofData();

    } catch (error) {
      console.error('Error:', error);
      alert('There was an error submitting your request. Please try again.');
    } finally {
      // Reset button state
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  });

  // Helper function to convert file to base64
  function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  // Initialize form state
  const initialHelpType = document.querySelector('input[name="help-type"]:checked');
  if (initialHelpType) {
    handleHelpTypeSelection(initialHelpType.value);
    finalSection.classList.remove('hidden');
  }

  // Load social proof data
  loadSocialProofData();
});

// Load social proof data
async function loadSocialProofData() {
  try {
    const API_BASE_URL = process.env.NODE_ENV === 'production' 
      ? 'https://your-render-app.onrender.com' 
      : 'http://localhost:3000';
      
    const response = await fetch(`${API_BASE_URL}/api/consulting/social-proof`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch social proof data');
    }
    
    const data = await response.json();
    updateSocialProofDashboard(data);
  } catch (error) {
    console.error('Failed to load social proof data:', error);
    // Set default values if API fails
    updateSocialProofDashboard({
      total_helped: 0,
      average_rating: 0,
      response_rate: 0
    });
  }
}

function updateSocialProofDashboard(data) {
  // Update stats
  const totalHelpedElement = document.getElementById('totalHelped');
  const averageRatingElement = document.getElementById('averageRating');
  const responseRateElement = document.getElementById('responseRate');
  
  if (totalHelpedElement) {
    totalHelpedElement.textContent = data.total_helped || 0;
  }
  
  if (averageRatingElement) {
    averageRatingElement.textContent = (data.average_rating || 0).toFixed(1);
  }
  
  if (responseRateElement) {
    responseRateElement.textContent = `${data.response_rate || 0}%`;
  }
  
  // Update recent submissions
  updateRecentSubmissions();
}

function updateRecentSubmissions() {
  const submissionsList = document.getElementById('recentSubmissionsList');
  if (!submissionsList) return;
  
  // For now, show a placeholder message
  // You can implement this to show actual recent submissions
  submissionsList.innerHTML = `
    <div class="submission-item">
      <p>Recent submissions will appear here as they come in.</p>
    </div>
  `;
}

function formatResponseTime(milliseconds) {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return `${seconds}s ago`;
}

// Add Bootstrap modal functionality if not available
if (typeof bootstrap === 'undefined') {
  document.querySelectorAll('[data-dismiss="modal"]').forEach(button => {
    button.addEventListener('click', () => {
      const modal = button.closest('.modal');
      if (modal) {
        modal.style.display = 'none';
      }
    });
  });
} 
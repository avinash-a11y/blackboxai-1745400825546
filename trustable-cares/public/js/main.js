// DOM Elements
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const forms = document.querySelectorAll('form');
const alerts = document.querySelectorAll('.alert');
const bloodGroupSelect = document.querySelectorAll('.blood-group-select');
const dashboardToggle = document.querySelector('.dashboard-toggle');
const sidebar = document.querySelector('.sidebar');
const profileTabs = document.querySelectorAll('.profile-tab');
const profileTabContents = document.querySelectorAll('.profile-tab-content');

// Event Listeners
if (hamburger) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('show');
  });
}

if (dashboardToggle) {
  dashboardToggle.addEventListener('click', () => {
    sidebar.classList.toggle('show');
  });
}

// Initialize Blood Group Select
if (bloodGroupSelect) {
  bloodGroupSelect.forEach(select => {
    const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    bloodGroups.forEach(group => {
      const option = document.createElement('option');
      option.value = group;
      option.textContent = group;
      select.appendChild(option);
    });
  });
}

// Form Validation
if (forms) {
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      let isValid = true;
      const requiredFields = form.querySelectorAll('[required]');
      
      requiredFields.forEach(field => {
        if (!field.value.trim()) {
          isValid = false;
          showAlert(`${field.name} is required`, 'danger', field.parentElement);
        }
      });
      
      // Email validation
      const emailField = form.querySelector('input[type="email"]');
      if (emailField && emailField.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailField.value)) {
          isValid = false;
          showAlert('Please enter a valid email address', 'danger', emailField.parentElement);
        }
      }
      
      // Phone validation
      const phoneField = form.querySelector('input[name="phone"]');
      if (phoneField && phoneField.value) {
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(phoneField.value)) {
          isValid = false;
          showAlert('Please enter a valid 10-digit phone number', 'danger', phoneField.parentElement);
        }
      }
      
      // Age validation
      const ageField = form.querySelector('input[name="age"]');
      if (ageField && ageField.value) {
        const age = parseInt(ageField.value);
        if (isNaN(age) || age < 18 || age > 65) {
          isValid = false;
          showAlert('Age must be between 18 and 65', 'danger', ageField.parentElement);
        }
      }
      
      // Weight validation for donors
      const weightField = form.querySelector('input[name="weight"]');
      if (weightField && weightField.value) {
        const weight = parseFloat(weightField.value);
        if (isNaN(weight) || weight < 45) {
          isValid = false;
          showAlert('Weight must be at least 45 kg', 'danger', weightField.parentElement);
        }
      }
      
      // Pin code validation
      const pinCodeField = form.querySelector('input[name="pinCode"]');
      if (pinCodeField && pinCodeField.value) {
        const pinCodeRegex = /^\d{6}$/;
        if (!pinCodeRegex.test(pinCodeField.value)) {
          isValid = false;
          showAlert('Please enter a valid 6-digit pin code', 'danger', pinCodeField.parentElement);
        }
      }
      
      if (!isValid) {
        e.preventDefault();
      }
    });
  });
}

// Profile Tabs
if (profileTabs.length > 0 && profileTabContents.length > 0) {
  profileTabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
      // Remove active class from all tabs and contents
      profileTabs.forEach(t => t.classList.remove('active'));
      profileTabContents.forEach(c => c.style.display = 'none');
      
      // Add active class to clicked tab and show corresponding content
      tab.classList.add('active');
      profileTabContents[index].style.display = 'block';
    });
  });
  
  // Show first tab by default
  profileTabs[0].classList.add('active');
  profileTabContents[0].style.display = 'block';
}

// Close alerts
if (alerts) {
  alerts.forEach(alert => {
    const closeBtn = alert.querySelector('.close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        alert.style.display = 'none';
      });
    }
    
    // Auto close after 5 seconds
    setTimeout(() => {
      alert.style.display = 'none';
    }, 5000);
  });
}

// Show alert function
function showAlert(message, type, parent) {
  const alert = document.createElement('div');
  alert.className = `alert alert-${type}`;
  alert.innerHTML = `
    ${message}
    <span class="close">&times;</span>
  `;
  
  // Add close button functionality
  const closeBtn = alert.querySelector('.close');
  closeBtn.addEventListener('click', () => {
    alert.style.display = 'none';
  });
  
  // Insert alert before the first child of parent
  parent.insertBefore(alert, parent.firstChild);
  
  // Auto close after 5 seconds
  setTimeout(() => {
    alert.style.display = 'none';
  }, 5000);
}

// API Functions
async function registerDonor(donorData) {
  try {
    const response = await fetch('/donors/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(donorData)
    });
    
    const data = await response.json();
    
    if (data.success) {
      // Redirect to donor dashboard
      window.location.href = '/donors/dashboard';
    } else {
      showAlert(data.error || 'Registration failed', 'danger', document.querySelector('.form-container'));
    }
  } catch (error) {
    showAlert('An error occurred. Please try again.', 'danger', document.querySelector('.form-container'));
    console.error(error);
  }
}

async function loginDonor(credentials) {
  try {
    const response = await fetch('/donors/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    });
    
    const data = await response.json();
    
    if (data.success) {
      // Redirect to donor dashboard
      window.location.href = '/donors/dashboard';
    } else {
      showAlert(data.message || 'Login failed', 'danger', document.querySelector('.form-container'));
    }
  } catch (error) {
    showAlert('An error occurred. Please try again.', 'danger', document.querySelector('.form-container'));
    console.error(error);
  }
}

async function registerRecipient(recipientData) {
  try {
    const response = await fetch('/recipients/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(recipientData)
    });
    
    const data = await response.json();
    
    if (data.success) {
      // Redirect to recipient dashboard
      window.location.href = '/recipients/dashboard';
    } else {
      showAlert(data.error || 'Registration failed', 'danger', document.querySelector('.form-container'));
    }
  } catch (error) {
    showAlert('An error occurred. Please try again.', 'danger', document.querySelector('.form-container'));
    console.error(error);
  }
}

async function loginRecipient(credentials) {
  try {
    const response = await fetch('/recipients/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    });
    
    const data = await response.json();
    
    if (data.success) {
      // Redirect to recipient dashboard
      window.location.href = '/recipients/dashboard';
    } else {
      showAlert(data.message || 'Login failed', 'danger', document.querySelector('.form-container'));
    }
  } catch (error) {
    showAlert('An error occurred. Please try again.', 'danger', document.querySelector('.form-container'));
    console.error(error);
  }
}

async function createBloodRequest(requestData) {
  try {
    const response = await fetch('/recipients/request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    });
    
    const data = await response.json();
    
    if (data.success) {
      // Show success message with matching donors
      const matchingDonorsContainer = document.querySelector('#matching-donors');
      if (matchingDonorsContainer) {
        matchingDonorsContainer.innerHTML = `
          <div class="alert alert-success">
            Blood request created successfully! Found ${data.matchCount} matching donors.
          </div>
        `;
        
        if (data.matchingDonors && data.matchingDonors.length > 0) {
          const donorsList = document.createElement('div');
          donorsList.className = 'donors-list';
          
          data.matchingDonors.forEach(donor => {
            const donorCard = document.createElement('div');
            donorCard.className = 'donor-card';
            donorCard.innerHTML = `
              <h3>${donor.name}</h3>
              <p><strong>Blood Group:</strong> ${donor.bloodGroup}</p>
              <p><strong>Contact:</strong> ${donor.phone}</p>
              <p><strong>Location:</strong> ${donor.city}</p>
            `;
            donorsList.appendChild(donorCard);
          });
          
          matchingDonorsContainer.appendChild(donorsList);
        } else {
          matchingDonorsContainer.innerHTML += `
            <div class="alert alert-warning">
              No matching donors found in your area. We'll notify you when a donor becomes available.
            </div>
          `;
        }
      }
    } else {
      showAlert(data.error || 'Request creation failed', 'danger', document.querySelector('.form-container'));
    }
  } catch (error) {
    showAlert('An error occurred. Please try again.', 'danger', document.querySelector('.form-container'));
    console.error(error);
  }
}

async function getStats() {
  try {
    const response = await fetch('/api/stats');
    const data = await response.json();
    
    if (data.success) {
      // Update stats on the page
      const statsContainer = document.querySelector('#stats-container');
      if (statsContainer) {
        const { donorCount, recipientCount, requestCount, fulfilledRequestCount, donationCount } = data.stats;
        
        statsContainer.innerHTML = `
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-number">${donorCount}</div>
              <div class="stat-label">Registered Donors</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">${recipientCount}</div>
              <div class="stat-label">Registered Recipients</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">${requestCount}</div>
              <div class="stat-label">Blood Requests</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">${fulfilledRequestCount}</div>
              <div class="stat-label">Fulfilled Requests</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">${donationCount}</div>
              <div class="stat-label">Successful Donations</div>
            </div>
          </div>
        `;
      }
    }
  } catch (error) {
    console.error('Error fetching stats:', error);
  }
}

// Initialize stats on home page
document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
    getStats();
  }
});

// Form submission handlers
const donorRegisterForm = document.querySelector('#donor-register-form');
if (donorRegisterForm) {
  donorRegisterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(donorRegisterForm);
    const donorData = {};
    
    formData.forEach((value, key) => {
      donorData[key] = value;
    });
    
    registerDonor(donorData);
  });
}

const donorLoginForm = document.querySelector('#donor-login-form');
if (donorLoginForm) {
  donorLoginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(donorLoginForm);
    const credentials = {};
    
    formData.forEach((value, key) => {
      credentials[key] = value;
    });
    
    loginDonor(credentials);
  });
}

const recipientRegisterForm = document.querySelector('#recipient-register-form');
if (recipientRegisterForm) {
  recipientRegisterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(recipientRegisterForm);
    const recipientData = {};
    
    formData.forEach((value, key) => {
      recipientData[key] = value;
    });
    
    registerRecipient(recipientData);
  });
}

const recipientLoginForm = document.querySelector('#recipient-login-form');
if (recipientLoginForm) {
  recipientLoginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(recipientLoginForm);
    const credentials = {};
    
    formData.forEach((value, key) => {
      credentials[key] = value;
    });
    
    loginRecipient(credentials);
  });
}

const bloodRequestForm = document.querySelector('#blood-request-form');
if (bloodRequestForm) {
  bloodRequestForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(bloodRequestForm);
    const requestData = {};
    
    formData.forEach((value, key) => {
      requestData[key] = value;
    });
    
    createBloodRequest(requestData);
  });
}

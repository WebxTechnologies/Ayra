// WhatsApp Form Submission
document.addEventListener('DOMContentLoaded', function() {
    const whatsappForm = document.getElementById('whatsappQuoteForm');
    const whatsappNumber = '917012984387'; // Your WhatsApp number
    
    if (whatsappForm) {
        whatsappForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const formData = new FormData(whatsappForm);
            const data = Object.fromEntries(formData.entries());
            
            // Validate required fields
            if (!data.name || !data.email || !data.phone || !data.service || !data.message) {
                showErrorMessage('Please fill in all required fields');
                return;
            }
            
            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                showErrorMessage('Please enter a valid email address');
                return;
            }
            
            // Format message for WhatsApp
            const whatsappMessage = formatWhatsAppMessage(data);
            
            // Encode message for URL
            const encodedMessage = encodeURIComponent(whatsappMessage);
            
            // Create WhatsApp URL
            const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
            
            // Open WhatsApp in new tab
            window.open(whatsappURL, '_blank');
            
            // Show success message
            showSuccessMessage();
            
            // Optional: Clear form after submission
            setTimeout(() => {
                whatsappForm.reset();
            }, 1000);
        });
    }
    
    // Function to format WhatsApp message
    function formatWhatsAppMessage(data) {
        const serviceMap = {
            'custom-web': 'Custom Web Development',
            'web-hosting': 'Web Hosting & Infrastructure',
            'website-management': 'Website Management & Maintenance',
            'multiple': 'Multiple Services (Package)',
            'consultation': 'Technical Consultation'
        };
        
        const service = serviceMap[data.service] || data.service;
        const organization = data.organization ? data.organization : 'Not specified';
        
        return `🔵 QUOTE REQUEST - AYRA WEB SERVICES

👤 CLIENT INFORMATION:
• Name: ${data.name}
• Email: ${data.email}
• Phone: ${data.phone}
• Organization: ${organization}

📋 SERVICE REQUESTED:
• ${service}

📝 PROJECT DESCRIPTION:
${data.message}

📅 SUBMISSION DETAILS:
• Date: ${new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
})}
• Time: ${new Date().toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit' 
})}

Please provide a detailed quote including:
✓ Scope of work
✓ Timeline
✓ Cost breakdown
✓ Terms & conditions`;
    }
    
    // Function to show success message
    function showSuccessMessage() {
        // Create success message element
        const successMessage = document.createElement('div');
        successMessage.className = 'form-success-message';
        successMessage.innerHTML = `
            <div class="success-content">
                <i class="fas fa-check-circle"></i>
                <h4>Form Submitted Successfully!</h4>
                <p>WhatsApp is opening with your message. Please send it to complete your quote request.</p>
                <p><small>If WhatsApp doesn't open, please check your pop-up blocker or click "Send via WhatsApp" again.</small></p>
            </div>
        `;
        
        // Add styles if not already present
        if (!document.getElementById('form-message-styles')) {
            const style = document.createElement('style');
            style.id = 'form-message-styles';
            style.textContent = `
                .form-success-message {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
                    padding: 20px;
                    z-index: 10000;
                    animation: slideInRight 0.5s ease, fadeOut 0.5s ease 4.5s forwards;
                    max-width: 350px;
                    border-left: 4px solid #25D366;
                }
                
                .form-error-message {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
                    padding: 20px;
                    z-index: 10000;
                    animation: slideInRight 0.5s ease, fadeOut 0.5s ease 4.5s forwards;
                    max-width: 350px;
                    border-left: 4px solid #ff4444;
                }
                
                .success-content, .error-content {
                    text-align: center;
                }
                
                .success-content i {
                    font-size: 3rem;
                    color: #25D366;
                    margin-bottom: 15px;
                }
                
                .error-content i {
                    font-size: 3rem;
                    color: #ff4444;
                    margin-bottom: 15px;
                }
                
                .success-content h4, .error-content h4 {
                    margin: 0 0 10px 0;
                    color: var(--dark);
                }
                
                .success-content p, .error-content p {
                    margin: 0 0 10px 0;
                    color: var(--gray);
                    font-size: 0.9rem;
                    line-height: 1.4;
                }
                
                .success-content small, .error-content small {
                    color: #888;
                    font-size: 0.8rem;
                }
                
                @keyframes slideInRight {
                    from {
                        opacity: 0;
                        transform: translateX(100%);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                
                @keyframes fadeOut {
                    from {
                        opacity: 1;
                        transform: translateX(0);
                    }
                    to {
                        opacity: 0;
                        transform: translateX(100%);
                    }
                }
                
                /* Add loading state to submit button */
                .whatsapp-submit-btn.loading {
                    opacity: 0.7;
                    cursor: not-allowed;
                }
                
                .whatsapp-submit-btn.loading i {
                    animation: spin 1s linear infinite;
                }
                
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(successMessage);
        
        // Remove message after 5 seconds
        setTimeout(() => {
            if (successMessage.parentNode) {
                successMessage.parentNode.removeChild(successMessage);
            }
        }, 5000);
    }
    
    // Function to show error message
    function showErrorMessage(message) {
        // Remove any existing error messages
        const existingError = document.querySelector('.form-error-message');
        if (existingError) {
            existingError.parentNode.removeChild(existingError);
        }
        
        // Create error message element
        const errorMessage = document.createElement('div');
        errorMessage.className = 'form-error-message';
        errorMessage.innerHTML = `
            <div class="error-content">
                <i class="fas fa-exclamation-circle"></i>
                <h4>Error!</h4>
                <p>${message}</p>
            </div>
        `;
        
        document.body.appendChild(errorMessage);
        
        // Remove message after 5 seconds
        setTimeout(() => {
            if (errorMessage.parentNode) {
                errorMessage.parentNode.removeChild(errorMessage);
            }
        }, 5000);
    }
});
// WhatsApp Quote Form Functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('WhatsApp script loaded');
    
    // Elements
    const whatsappPopup = document.getElementById('whatsappPopup');
    const popupOverlay = document.getElementById('popupOverlay');
    const closePopup = document.getElementById('closePopup');
    const whatsappForm = document.getElementById('whatsappQuoteForm');
    
    // Check if popup elements exist
    if (!whatsappPopup) {
        console.log('WhatsApp popup not found');
        return;
    }
    
    console.log('Popup elements found:', {
        popup: whatsappPopup,
        overlay: popupOverlay,
        closeBtn: closePopup,
        form: whatsappForm
    });
    
    // Store original body overflow
    let originalBodyOverflow = '';
    
    // Function to open popup
    function openWhatsAppPopup() {
        console.log('Opening popup');
        whatsappPopup.style.display = 'block';
        whatsappPopup.classList.add('active');
        
        // Store original overflow
        originalBodyOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        
        // Reset form
        if (whatsappForm) {
            whatsappForm.reset();
        }
        
        // Focus on first input
        setTimeout(() => {
            const firstInput = document.getElementById('wpName');
            if (firstInput) {
                firstInput.focus();
            }
        }, 100);
    }
    
    // Function to close popup
    function closeWhatsAppPopup() {
        console.log('Closing popup');
        whatsappPopup.classList.remove('active');
        
        // Wait for animation to complete before hiding
        setTimeout(() => {
            whatsappPopup.style.display = 'none';
            document.body.style.overflow = originalBodyOverflow;
        }, 300);
    }
    
    // Get Quote buttons - Simple approach
    document.addEventListener('click', function(e) {
        // Check if clicked element or its parent is a Get Quote button
        let target = e.target;
        let isQuoteButton = false;
        
        // Check target and its parent
        if (target.matches('a[href="#contact"], .read-more, .cta-button:not(.secondary)') ||
            target.closest('a[href="#contact"], .read-more, .cta-button:not(.secondary)')) {
            
            // Check if it's a button that should open popup
            const button = target.matches('a[href="#contact"], .read-more, .cta-button:not(.secondary)') 
                ? target 
                : target.closest('a[href="#contact"], .read-more, .cta-button:not(.secondary)');
            
            if (button && !button.classList.contains('secondary')) {
                e.preventDefault();
                e.stopImmediatePropagation();
                openWhatsAppPopup();
                return false;
            }
        }
    }, true); // Use capture phase
    
    // Close popup events
    if (closePopup) {
        closePopup.addEventListener('click', function(e) {
            e.stopPropagation();
            closeWhatsAppPopup();
        });
    }
    
    if (popupOverlay) {
        popupOverlay.addEventListener('click', function(e) {
            e.stopPropagation();
            closeWhatsAppPopup();
        });
    }
    
    // Close with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && whatsappPopup.classList.contains('active')) {
            closeWhatsAppPopup();
        }
    });
    
    // Form submission
    if (whatsappForm) {
        whatsappForm.addEventListener('submit', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('Form submitted');
            
            // Get form values
            const formData = new FormData(whatsappForm);
            const data = Object.fromEntries(formData.entries());
            
            // Validate required fields
            if (!data.name || !data.email || !data.phone || !data.service || !data.message) {
                alert('Please fill all required fields');
                return;
            }
            
            // Format message
            const whatsappMessage = formatWhatsAppMessage(data);
            const encodedMessage = encodeURIComponent(whatsappMessage);
            const whatsappNumber = '917012984387';
            const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
            
            // Open WhatsApp
            window.open(whatsappURL, '_blank');
            
            // Close popup
            closeWhatsAppPopup();
            
            // Show success message
            showSuccessMessage();
        });
    }
    
    function formatWhatsAppMessage(data) {
        const serviceMap = {
            'custom-web': 'Custom Web Development',
            'web-hosting': 'Web Hosting & Infrastructure',
            'website-management': 'Website Management & Maintenance',
            'multiple': 'Multiple Services (Package)',
            'consultation': 'Technical Consultation'
        };
        
        const service = serviceMap[data.service] || data.service;
        
        return `QUOTE REQUEST - AYRA WEB SERVICES

CLIENT INFORMATION:
• Name: ${data.name}
• Email: ${data.email}
• Phone: ${data.phone}
• Organization: ${data.organization || 'N/A'}

SERVICE REQUESTED:
• Service: ${service}
PROJECT DESCRIPTION:
${data.message}

ADDITIONAL NOTES:
• Submitted: ${new Date().toLocaleDateString()}

Please provide a detailed quote including scope, timeline, costs, and terms.`;
    }
    
    function showSuccessMessage() {
        // Remove existing message if any
        const existing = document.querySelector('.whatsapp-success');
        if (existing) existing.remove();
        
        const message = document.createElement('div');
        message.className = 'whatsapp-success';
        message.innerHTML = `
            <div style="
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 5px 15px rgba(0,0,0,0.2);
                z-index: 99999;
                border-left: 4px solid #25D366;
                animation: slideIn 0.3s ease;
            ">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <i class="fas fa-check-circle" style="color: #25D366; font-size: 24px;"></i>
                    <div>
                        <h4 style="margin: 0 0 5px 0;">Success!</h4>
                        <p style="margin: 0; font-size: 14px;">WhatsApp opened with your message.</p>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.remove();
        }, 5000);
    }
});
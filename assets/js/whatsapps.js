// WhatsApp Quote Popup for STEAM Page
document.addEventListener('DOMContentLoaded', function() {
    initWhatsAppPopup();
});

function initWhatsAppPopup() {
    const popup = document.getElementById('whatsappPopup');
    const openBtn = document.getElementById('steamQuoteBtn');
    const closeBtn = document.getElementById('closePopup');
    const overlay = document.getElementById('popupOverlay');
    const form = document.getElementById('whatsappQuoteForm');
    
    if (!popup || !openBtn) {
        console.log('WhatsApp popup elements not found on this page');
        return;
    }
    
    // Open popup
    openBtn.addEventListener('click', function(e) {
        e.preventDefault();
        openPopup();
    });
    
    // Close popup
    function closePopup() {
        popup.classList.remove('show');
        document.body.style.overflow = '';
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closePopup);
    }
    
    if (overlay) {
        overlay.addEventListener('click', closePopup);
    }
    
    // Close on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && popup.classList.contains('show')) {
            closePopup();
        }
    });
    
    // Form submission
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            submitSTEAMForm();
        });
    }
    
    function openPopup() {
        popup.classList.add('show');
        document.body.style.overflow = 'hidden';
        
        // Focus on first input
        const firstInput = form ? form.querySelector('input, select, textarea') : null;
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 300);
        }
    }
    
    function submitSTEAMForm() {
        if (!form) return;
        
        const submitBtn = form.querySelector('.whatsapp-submit-btn');
        const formData = new FormData(form);
        
        // Show loading state
        submitBtn.classList.add('loading');
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        
        // Collect form data
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            organization: formData.get('organization'),
            program: formData.get('program'),
            grade: formData.get('grade'),
            message: formData.get('message'),
            source: 'STEAM Page',
            date: new Date().toISOString()
        };
        
        // Create WhatsApp message
        const programLabels = {
            'elementary': 'Elementary School Program',
            'middle': 'Middle School Program', 
            'high': 'High School Program',
            'teacher': 'Teacher Training Program',
            'multiple': 'Multiple Programs',
            'custom': 'Custom Program'
        };
        
        const programText = programLabels[data.program] || data.program;
        
        const whatsappMessage = `*STEAM Program Inquiry*\n\n` +
                               `*Name:* ${data.name}\n` +
                               `*Email:* ${data.email}\n` +
                               `*Phone:* ${data.phone}\n` +
                               `*School/Organization:* ${data.organization}\n` +
                               `*Program Interested In:* ${programText}\n` +
                               `*Grade Level:* ${data.grade || 'Not specified'}\n` +
                               `*Additional Information:* ${data.message}\n\n` +
                               `*Submitted via:* STEAM Programs Page\n` +
                               `*Date:* ${new Date().toLocaleDateString()}`;
        
        // Encode message for WhatsApp
        const encodedMessage = encodeURIComponent(whatsappMessage);
        const phoneNumber = '9170129844387';
        
        // Create WhatsApp URL
        const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
        
        // Simulate API call delay
        setTimeout(() => {
            // Reset button
            submitBtn.classList.remove('loading');
            submitBtn.innerHTML = '<i class="fab fa-whatsapp"></i> Send via WhatsApp';
            
            // Open WhatsApp
            window.open(whatsappURL, '_blank');
            
            // Close popup
            closePopup();
            
            // Reset form
            if (form) form.reset();
            
            // Show success message (optional)
            showSuccessMessage('Thank you! Your inquiry has been sent via WhatsApp.');
        }, 1500);
    }
    
    function showSuccessMessage(message) {
        // Create success message element
        const successMsg = document.createElement('div');
        successMsg.className = 'form-success-message show';
        successMsg.innerHTML = `
            <div class="success-message-content">
                <i class="fas fa-check-circle"></i>
                <div class="success-message-text">
                    <h4>Inquiry Sent!</h4>
                    <p>${message}</p>
                    <small>We'll respond within 24 hours.</small>
                </div>
            </div>
        `;
        
        document.body.appendChild(successMsg);
        
        // Remove after 5 seconds
        setTimeout(() => {
            successMsg.remove();
        }, 5000);
    }
}
/* ==========================================================================
   arts.withankita - Interactive Client Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- DOM Elements ---
    const header = document.querySelector('.main-header');
    const mobileToggle = document.getElementById('mobile-toggle');
    const navLinks = document.getElementById('nav-links');
    const navLinksList = document.querySelectorAll('.nav-link');
    
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');
    
    const modal = document.getElementById('inquiry-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const inquiryForm = document.getElementById('inquiry-form');
    const successScreen = document.getElementById('success-screen');
    const btnHeaderDM = document.getElementById('btn-header-dm');
    
    const formProduct = document.getElementById('form-product');
    const formName = document.getElementById('form-name');
    const formInsta = document.getElementById('form-insta');
    const formMessage = document.getElementById('form-message');
    
    const draftMessageText = document.getElementById('draft-message-text');
    const btnCopyText = document.getElementById('btn-copy-text');
    const btnSendEmail = document.getElementById('btn-send-email');
    const btnResetModal = document.getElementById('btn-reset-modal');
    const instaDmLink = document.getElementById('insta-dm-link');

    // --- 1. Header Scroll Effect ---
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    // --- 2. Mobile Menu Toggle & Smooth Scroll Delegation ---
    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }

    // Smooth scrolling for navigation links with sticky header offset
    document.addEventListener('click', (e) => {
        const link = e.target.closest('.nav-link');
        if (link) {
            const targetId = link.getAttribute('href');
            if (targetId && targetId.startsWith('#')) {
                e.preventDefault();
                
                // Close mobile menu if active
                if (mobileToggle && navLinks) {
                    mobileToggle.classList.remove('active');
                    navLinks.classList.remove('active');
                }
                
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    const headerHeight = header.offsetHeight || 80;
                    const targetPosition = targetSection.offsetTop - headerHeight;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Update URL hash without jumping page view
                    history.pushState(null, null, targetId);
                }
            }
        }
    });

    // --- 3. Dynamic Product Filter ---
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Set active class on button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const filterValue = button.getAttribute('data-filter');
            
            productCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                // Reset card display animations
                card.style.opacity = '0';
                card.style.transform = 'scale(0.95) translateY(5px)';
                card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                
                setTimeout(() => {
                    if (filterValue === 'all' || category === filterValue) {
                        card.style.display = 'flex';
                        // Trigger fade in
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1) translateY(0)';
                        }, 50);
                    } else {
                        card.style.display = 'none';
                    }
                }, 300);
            });
        });
    });

    // --- 4. Inquiry Modal Logic ---
    
    // Open Modal function
    function openInquiryModal(productName = 'Custom Request') {
        formProduct.value = productName;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Lock background scrolling
        
        // Reset modal state
        inquiryForm.style.display = 'flex';
        successScreen.style.display = 'none';
    }
    
    // Close Modal function
    function closeInquiryModal() {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto'; // Unlock background scrolling
        inquiryForm.reset();
    }
    
    // Event listener for Inquire buttons on cards (delegated)
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.btn-inquire');
        if (btn) {
            e.preventDefault();
            const productName = btn.getAttribute('data-product');
            openInquiryModal(productName);
        }
    });
    
    // Event listener for Main Header DM button
    if (btnHeaderDM) {
        btnHeaderDM.addEventListener('click', () => {
            openInquiryModal('Custom Consultation');
        });
    }
    
    // Event listener for close button & clicking outside modal
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeInquiryModal);
    }
    
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeInquiryModal();
        }
    });

    // --- 5. Custom Inquiry Form Handling ---
    
    // Generate inquiry message templates
    function generateInquiryMessage() {
        const product = formProduct.value;
        const name = formName.value.trim();
        const insta = formInsta.value.trim() ? formInsta.value.trim() : 'Not provided';
        const notes = formMessage.value.trim();
        
        return `Hello Ankita! ✨ I visited your website and would love to inquire about:
🌸 Product: *${product}*
👤 Name: ${name}
📸 Instagram: ${insta}
✍️ Custom requests: "${notes}"

Looking forward to coordinating order/pricing details!`;
    }
    
    if (inquiryForm) {
        inquiryForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const message = generateInquiryMessage();
            draftMessageText.textContent = message;
            
            // Swap Form screen to Success screen
            inquiryForm.style.display = 'none';
            successScreen.style.display = 'flex';
            
            // Set link to open Instagram profile
            instaDmLink.href = "https://www.instagram.com/arts.withankita/";
        });
    }
    
    // Email Inquiry click handler (mailto integration)
    if (btnSendEmail) {
        btnSendEmail.addEventListener('click', () => {
            if (!inquiryForm.checkValidity()) {
                inquiryForm.reportValidity();
                return;
            }
            
            const product = formProduct.value;
            const name = formName.value.trim();
            const insta = formInsta.value.trim() ? formInsta.value.trim() : 'Not provided';
            const notes = formMessage.value.trim();
            
            const subject = encodeURIComponent(`arts.withankita Inquiry - ${product}`);
            const body = encodeURIComponent(`Hello Ankita,

I am interested in placing an order/custom request for:
Product: ${product}
Inquirer Name: ${name}
Instagram Handle: ${insta}

Custom Requests/Notes:
${notes}

Thank you!`);
            
            window.location.href = `mailto:ag0513161@gmail.com?subject=${subject}&body=${body}`;
        });
    }

    // Reset Modal button
    if (btnResetModal) {
        btnResetModal.addEventListener('click', () => {
            inquiryForm.style.display = 'flex';
            successScreen.style.display = 'none';
        });
    }

    // Copy to clipboard function
    if (btnCopyText) {
        btnCopyText.addEventListener('click', () => {
            const textToCopy = draftMessageText.textContent;
            
            navigator.clipboard.writeText(textToCopy).then(() => {
                const originalText = btnCopyText.innerHTML;
                btnCopyText.innerHTML = '<i class="fas fa-check"></i> Copied!';
                btnCopyText.classList.add('copied');
                
                setTimeout(() => {
                    btnCopyText.innerHTML = originalText;
                    btnCopyText.classList.remove('copied');
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy text: ', err);
            });
        });
    }
});

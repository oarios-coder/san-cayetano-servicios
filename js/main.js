/* 
   ==========================================================================
   LANARO Y CÍA. S.R.L. - SERVICIOS INDUSTRIALES SAN CAYETANO
   LÓGICA FRONTERA WEB PREMIUM (JS)
   ========================================================================== 
*/

document.addEventListener('DOMContentLoaded', () => {
    // 1. Sticky Header Control
    const header = document.querySelector('.site-header');
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('shrink');
        } else {
            header.classList.remove('shrink');
        }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Run once in case page starts scrolled

    // 2. Hamburger Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            mainNav.classList.toggle('active');
        });

        // Close menu when clicking a link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                mainNav.classList.remove('active');
            });
        });
    }

    // 3. FAQ Accordion Toggle
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        if (question && answer) {
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Close all other FAQs
                faqItems.forEach(i => {
                    i.classList.remove('active');
                    i.querySelector('.faq-answer').style.maxHeight = null;
                });

                // Toggle current FAQ
                if (!isActive) {
                    item.classList.add('active');
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                }
            });
        }
    });

    // 4. Form Validation & Submission Simulation (B2B Leads)
    const cotizacionForm = document.getElementById('cotizacionForm');
    const successModal = document.getElementById('successModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    
    if (cotizacionForm) {
        cotizacionForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Basic values validation
            const nombre = document.getElementById('nombre').value.trim();
            const empresa = document.getElementById('empresa').value.trim();
            const email = document.getElementById('email').value.trim();
            const telefono = document.getElementById('telefono').value.trim();
            const sector = document.getElementById('sector').value;
            const servicio = document.getElementById('servicio').value;
            const descripcion = document.getElementById('descripcion').value.trim();
            const aceptoTerminos = document.getElementById('privacidad').checked;
            
            if (!nombre || !empresa || !email || !telefono || !sector || !servicio || !descripcion) {
                alert('Por favor, complete todos los campos obligatorios del pliego técnico.');
                return;
            }

            if (!aceptoTerminos) {
                alert('Debe aceptar la política de privacidad para procesar el envío corporativo.');
                return;
            }

            // Email validation
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email)) {
                alert('Por favor ingrese una dirección de correo electrónico válida.');
                return;
            }

            // Check if it is a generic email provider (optional, warning for B2B)
            const genericDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'live.com.ar', 'yahoo.com.ar'];
            const emailDomain = email.split('@')[1]?.toLowerCase();
            if (genericDomains.includes(emailDomain)) {
                console.log('Lead B2B con dirección genérica, registrado para seguimiento especial.');
            }

            // File Attachment check (Simulation)
            const pliegoFile = document.getElementById('pliego');
            let hasFile = false;
            if (pliegoFile && pliegoFile.files.length > 0) {
                const file = pliegoFile.files[0];
                hasFile = true;
                // Limit size warning at 15MB
                if (file.size > 15 * 1024 * 1024) {
                    alert('El archivo supera los 15MB. Te sugerimos subir el pliego técnico comprimido o enviarlo directamente por correo.');
                    return;
                }
            }

            // Build Lead Object (simulating analytics payload)
            const leadData = {
                nombre,
                empresa,
                cargo: document.getElementById('cargo').value.trim() || '[No declarado]',
                email,
                telefono,
                localidad: document.getElementById('localidad').value.trim() || '[No declarado]',
                sector,
                servicio,
                descripcion,
                visitaTecnica: document.querySelector('input[name="visita"]:checked')?.value || 'No',
                fechaEstimada: document.getElementById('fecha_ejecucion').value || '[No declarada]',
                adjunto: hasFile ? pliegoFile.files[0].name : 'Ninguno',
                timestamp: new Date().toISOString()
            };

            console.log('B2B Lead Captured successfully:', leadData);

            // Simulation of GA4 Event
            if (typeof gtag !== 'undefined') {
                gtag('event', 'generate_lead', {
                    'event_category': 'B2B Cotizacion',
                    'event_label': leadData.servicio,
                    'value': 1
                });
            }

            // Save lead in localStorage for debugging/offline lead capture simulation
            let leads = JSON.parse(localStorage.getItem('san_cayetano_leads') || '[]');
            leads.push(leadData);
            localStorage.setItem('san_cayetano_leads', JSON.stringify(leads));

            // Show Success Modal
            if (successModal) {
                successModal.classList.add('active');
            } else {
                alert('Gracias por contactarnos. Recibimos tu consulta y nuestro equipo la evaluará para brindarte una respuesta acorde al alcance del proyecto.');
                cotizacionForm.reset();
            }
        });
    }

    if (closeModalBtn && successModal && cotizacionForm) {
        closeModalBtn.addEventListener('click', () => {
            successModal.classList.remove('active');
            cotizacionForm.reset();
        });
    }

    // 5. Dynamic Active Link Highlight
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const menuLinks = document.querySelectorAll('.nav-link');
    menuLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        if (linkPath === currentPath) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
});

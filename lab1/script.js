document.addEventListener('DOMContentLoaded', function() {
    const getLocationBtn = document.getElementById('get-location');
    const coordinatesDiv = document.getElementById('coordinates');
    const latitudeSpan = document.getElementById('latitude');
    const longitudeSpan = document.getElementById('longitude');

    getLocationBtn.addEventListener('click', function() {
        if (navigator.geolocation) {
            getLocationBtn.textContent = 'Getting location...';
            getLocationBtn.disabled = true;
            
            navigator.geolocation.getCurrentPosition(
                function(position) {
                    const latitude = position.coords.latitude.toFixed(6);
                    const longitude = position.coords.longitude.toFixed(6);
                    
                    latitudeSpan.textContent = latitude;
                    longitudeSpan.textContent = longitude;
                    
                    coordinatesDiv.style.display = 'block';
                    getLocationBtn.style.display = 'none';
                },
                function(error) {
                    let errorMessage = 'Unable to retrieve location. ';
                    switch(error.code) {
                        case error.PERMISSION_DENIED:
                            errorMessage += 'Location access denied by user.';
                            break;
                        case error.POSITION_UNAVAILABLE:
                            errorMessage += 'Location information unavailable.';
                            break;
                        case error.TIMEOUT:
                            errorMessage += 'Location request timed out.';
                            break;
                        default:
                            errorMessage += 'Unknown error occurred.';
                            break;
                    }
                    alert(errorMessage);
                    getLocationBtn.textContent = 'Get My Location';
                    getLocationBtn.disabled = false;
                }
            );
        } else {
            alert('Geolocation is not supported by this browser.');
        }
    });

    const feedbackForm = document.getElementById('feedback-form');
    const feedbackList = document.getElementById('feedback-list');

    loadFeedback();

    feedbackForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value.trim();
        const comment = document.getElementById('comment').value.trim();
        
        if (name && comment) {
            const feedback = {
                id: Date.now(),
                name: name,
                comment: comment,
                timestamp: new Date().toLocaleString()
            };
            
            let existingFeedback = JSON.parse(localStorage.getItem('financeFeedback')) || [];
            
            existingFeedback.unshift(feedback);

            localStorage.setItem('financeFeedback', JSON.stringify(existingFeedback));

            feedbackForm.reset();
            
            loadFeedback();

            showSuccessMessage('Thank you for your feedback!');
        }
    });

    function loadFeedback() {
        const feedback = JSON.parse(localStorage.getItem('financeFeedback')) || [];
        
        feedbackList.innerHTML = '';
        
        if (feedback.length === 0) {
            feedbackList.innerHTML = '<p style="text-align: center; color: #a8b2d1; font-style: italic;">No feedback yet. Be the first to share your thoughts!</p>';
            return;
        }
        
        feedback.forEach(function(item) {
            const feedbackDiv = document.createElement('div');
            feedbackDiv.className = 'feedback-item';
            feedbackDiv.innerHTML = `
                <div class="feedback-name">${escapeHtml(item.name)}</div>
                <div class="feedback-comment">${escapeHtml(item.comment)}</div>
                <div style="color: #64ffda; font-size: 0.8rem; margin-top: 0.5rem;">${item.timestamp}</div>
            `;
            feedbackList.appendChild(feedbackDiv);
        });
    }
    
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    document.querySelectorAll('nav a[href^="#"]').forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.analysis-card, .strategy-card').forEach(function(card) {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
});
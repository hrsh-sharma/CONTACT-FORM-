document.addEventListener('DOMContentLoaded', function() {
    // Populate country codes
    const countries = [
        { code: '+1', name: 'United States' },
        { code: '+44', name: 'United Kingdom' },
        { code: '+91', name: 'India' },
        // Add more countries as needed
    ];

    const countrySelect = document.getElementById('country');
    countries.forEach(country => {
        const option = document.createElement('option');
        option.value = country.code;
        option.textContent = `${country.name} (${country.code})`;
        countrySelect.appendChild(option);
    });

    countrySelect.value = '+91'; // Set default country code

    function updatePhoneNumber() {
        const selectedCountryCode = countrySelect.value;
        const phoneInput = document.getElementById('phone');
        phoneInput.placeholder = `Enter phone number (${selectedCountryCode})`;
    }

    countrySelect.addEventListener('change', updatePhoneNumber);

    // Custom captcha logic
    const canvas = document.getElementById('captchaCanvas');
    const ctx = canvas.getContext('2d');
    const captchaInput = document.getElementById('captchaInput');
    const refreshCaptchaButton = document.getElementById('refreshCaptcha');

    function generateCaptcha() {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let captcha = '';
        for (let i = 0; i < 6; i++) {
            captcha += characters.charAt(Math.floor(Math.random() * characters.length));
        }

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Set canvas background
        ctx.fillStyle = '#f4f4f4';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Set text properties
        ctx.font = '30px Arial';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#333';

        // Calculate text width and height to center it
        const textWidth = ctx.measureText(captcha).width;
        const textHeight = 30; // Approximate height of the text

        // Draw the captcha text in the center of the canvas
        const x = (canvas.width - textWidth) / 2;
        const y = (canvas.height + textHeight) / 2;

        // Apply slight distortion
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(Math.random() * 0.05 - 0.025);
        ctx.scale(1 + Math.random() * 0.1, 1 + Math.random() * 0.1);

        // Draw the captcha text
        ctx.fillText(captcha, 0, 0);

        ctx.restore();

        // Add noise for obfuscation
        ctx.fillStyle = '#ddd';
        for (let i = 0; i < 20; i++) {
            ctx.beginPath();
            ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, 1 + Math.random() * 2, 0, 2 * Math.PI);
            ctx.fill();
        }
        for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
            ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
            ctx.strokeStyle = '#ddd';
            ctx.stroke();
        }

        // Store the generated captcha for validation
        canvas.dataset.captcha = captcha;
    }

    refreshCaptchaButton.addEventListener('click', generateCaptcha);

    document.getElementById('contactForm').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the default form submission

        // Validate all required fields
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const captcha = captchaInput.value.trim();

        if (!name || !email || captcha !== canvas.dataset.captcha) {
            alert('Please fill out all required fields correctly and enter the correct CAPTCHA.');
            if (captcha !== canvas.dataset.captcha) {
                generateCaptcha(); // Refresh captcha on failed attempt
            }
            return;
        }

        // For demonstration purposes, just alert the success
        alert('Form submitted successfully!');

        // Reset the form and generate a new CAPTCHA
        document.getElementById('contactForm').reset();
        generateCaptcha();
    });

    // Initial captcha generation
    generateCaptcha();
});

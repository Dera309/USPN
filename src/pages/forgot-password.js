import '../../assets/css/tailwind.css'
import '../../assets/css/responsive.css'
import '../../assets/css/uspn.css'

document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('reset-form');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('reset-email').value.trim();
    const emailErr = document.getElementById('email-err');
    const errBanner = document.getElementById('error-banner');
    
    if (emailErr) emailErr.classList.add('hidden');
    if (errBanner) errBanner.classList.add('hidden');

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      if (emailErr) {
        emailErr.textContent = 'Please enter a valid email address.';
        emailErr.classList.remove('hidden');
      }
      return;
    }

    // Show success regardless (don't reveal if email exists)
    const sentEmailEl = document.getElementById('sent-email');
    if (sentEmailEl) sentEmailEl.textContent = email;
    
    const formState = document.getElementById('form-state');
    const successState = document.getElementById('success-state');
    
    if (formState) formState.classList.add('hidden');
    if (successState) successState.classList.remove('hidden');
  });
});

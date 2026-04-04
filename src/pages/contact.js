import '../../assets/css/tailwind.css'
import '../../assets/css/responsive.css'
import '../../assets/css/uspn.css'

document.getElementById('contact-form').addEventListener('submit', function(e) {
  e.preventDefault();
  let valid = true;
  function req(id, errId, msg) {
    const val = document.getElementById(id).value.trim();
    const err = document.getElementById(errId);
    if (!val) { err.textContent = msg; err.classList.remove('hidden'); valid = false; }
    else err.classList.add('hidden');
    return val;
  }
  req('c-name','c-name-err','Full name is required.');
  const email = document.getElementById('c-email').value.trim();
  const emailErr = document.getElementById('c-email-err');
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { emailErr.textContent='Please enter a valid email.'; emailErr.classList.remove('hidden'); valid=false; } else emailErr.classList.add('hidden');
  req('c-message','c-message-err','Please enter your message.');
  if (!valid) return;
  document.getElementById('contact-form').classList.add('hidden');
  document.getElementById('form-success').classList.remove('hidden');
});

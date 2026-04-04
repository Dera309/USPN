import { DB } from '../../assets/js/data.js'
import '../../assets/css/tailwind.css'
import '../../assets/css/responsive.css'
import '../../assets/css/uspn.css'

const form        = document.getElementById('login-form')
const errorBanner = document.getElementById('error-banner')

function showError(msg) { errorBanner.textContent = msg; errorBanner.classList.remove('hidden') }
function clearErrors() {
  errorBanner.classList.add('hidden')
  document.getElementById('email-err').classList.add('hidden')
  document.getElementById('password-err').classList.add('hidden')
}

form.addEventListener('submit', async function(e) {
  e.preventDefault()
  clearErrors()
  const email    = document.getElementById('email').value.trim()
  const password = document.getElementById('password').value
  const remember = document.getElementById('remember-me').checked
  let valid = true
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    const el = document.getElementById('email-err')
    el.textContent = 'Please enter a valid email address.'; el.classList.remove('hidden'); valid = false
  }
  if (!password) {
    const el = document.getElementById('password-err')
    el.textContent = 'Password is required.'; el.classList.remove('hidden'); valid = false
  }
  if (!valid) return
  const data = await DB.login({ email, password, remember })
  if (data.error) { showError(data.error); return }
  window.location.href = data.user.role === 'admin' ? 'admin/dashboard.html' : 'dashboard.html'
})


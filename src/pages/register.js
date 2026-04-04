import { DB } from '../../assets/js/data.js'
import '../../assets/css/tailwind.css'
import '../../assets/css/responsive.css'
import '../../assets/css/uspn.css'

const form        = document.getElementById('register-form')
const errorBanner = document.getElementById('error-banner')

function fieldErr(id, msg) { const el = document.getElementById(id); el.textContent = msg; el.classList.remove('hidden') }
function clearErrors() {
  errorBanner.classList.add('hidden')
  ;['name-err','email-err','password-err','confirm-err'].forEach(id => document.getElementById(id).classList.add('hidden'))
}

form.addEventListener('submit', async function(e) {
  e.preventDefault()
  clearErrors()
  const name     = document.getElementById('name').value.trim()
  const email    = document.getElementById('email').value.trim()
  const password = document.getElementById('password').value
  const confirm  = document.getElementById('confirm-password').value
  let valid = true
  if (!name)   { fieldErr('name-err', 'Full name is required.'); valid = false }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { fieldErr('email-err', 'Please enter a valid email address.'); valid = false }
  if (!password || password.length < 8) { fieldErr('password-err', 'Password must be at least 8 characters.'); valid = false }
  if (password !== confirm) { fieldErr('confirm-err', 'Passwords do not match.'); valid = false }
  if (!valid) return
  const data = await DB.register({ name, email, password })
  if (data.error) { errorBanner.textContent = data.error; errorBanner.classList.remove('hidden'); return }
  window.location.href = 'dashboard.html'
})


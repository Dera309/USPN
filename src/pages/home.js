// Home Page Logic - src/pages/home.js
import { DB } from '../../assets/js/data.js'
import '../../assets/css/tailwind.css'
import '../../assets/css/responsive.css'
import '../../assets/css/uspn.css'

// Home-specific features
document.addEventListener('DOMContentLoaded', () => {
    // Hero Tracking Form
    const trackForm = document.getElementById('hero-track-form')
    if (trackForm) {
        trackForm.addEventListener('submit', (e) => {
            e.preventDefault()
            const input = document.getElementById('hero-track-input')
            if (input && input.value.trim()) {
                window.location.href = `pages/tracking.html?id=${encodeURIComponent(input.value.trim())}`
            }
        })
    }
})

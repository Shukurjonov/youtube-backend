let usernameInput  = document.querySelector('.user-login')
let passwordInput = document.querySelector('.user-password')
let registrationForm = document.querySelector('.site-main__form')
let title = document.querySelector('.site-main__text')  

registrationForm.onsubmit = async (event) => {
    event.preventDefault()
    let response = await request('/login', 'POST', {
        username: usernameInput.value,
        password: passwordInput.value
    })
    if (response.body) {
        title.textContent = response.message
        setTimeout(() => {
            window.localStorage.setItem('user', JSON.stringify(response.body))
            window.location = '/upload'
        }, 1000)
    } else {
        title.textContent = response.message
    }
}
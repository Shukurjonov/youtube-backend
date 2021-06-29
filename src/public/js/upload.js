const form = document.querySelector('.site-main__form')
const videoInput = document.querySelector('.file-title')
const uploadInput = document.querySelector('.user-file-input')
const fileName = document.querySelector('.file-name')
const title = document.querySelector('.site-main__text')
const videoList = document.querySelector('.users-video__list')

let user = window.localStorage.getItem('user')
user = user ? JSON.parse(user) : {}

console.log(user.user_id)

uploadInput.addEventListener('change', () => {
    let file = uploadInput.files[0].name
    file = file.length > 25 ? file.slice(0, 10) + '...' + file.slice(file.length - 5, file.length) : file
    fileName.textContent = file
})

form.addEventListener('submit', async (event) => {
    event.preventDefault()
    let formData = new FormData()
    
    formData.append('title', videoInput.value)
    formData.append('file', uploadInput.files[0])
    formData.append('time', getTime())
    
    let response = await fetch('/upload', {
        method: 'POST',
        body: formData
    })
    response = await response.json()
    if (response) {
        title.textContent = response.message
        setTimeout(() => {
            title.textContent = 'No file'
        }, 1000)
        videoInput.value = null
        fileName.textContent = 'file name'
    }
    
    getData()
})

let daysList = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
let monthList = ['January','February','March','April','May','June','July','August','September','October','November','December']

function getTime () {
    let date = new Date()
    let weekDay = daysList[date.getDay()]
    let month = monthList[date.getMonth()]
    let day = date.getDate()
    let year = date.getFullYear()
    let hours = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours() 
    let minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes() 
    let abbreviation = date.getHours() < 12 ? 'AM' : 'PM' 
    let time = weekDay + ", " + month + " " + day + ", " + year + " " + hours + ":" + minutes + ' ' + abbreviation
    
    return time
}

function videosRenderer(array) {
    let string = ""
    array.map(video => {
        string += `
        <li class="users-video__item">
        <video src="${'/videos/' + video.video_link}" controls></video>
        <p class="video__title" data-id=${video.video_id} contenteditable="true">${video.title}</p>
        <img class="delete-img" src="./img/delete.png" alt="delete icon" width="30" data-id=${video.video_id}>
        </li>
        `
    })
    
    videoList.innerHTML = string
    let deleteImgs = document.querySelectorAll('.delete-img')
    deleteImgs.forEach(deleteImg => {
        deleteImg.addEventListener('click', async () => {
            let response = await request(`/videos/${deleteImg.dataset.id}`, 'DELETE')
            let currentVideos = response.body.filter(video => video.user_id == user.user_id)
            videosRenderer(currentVideos)
        })
    })
    let videoTitles = document.querySelectorAll('.video__title')
    videoTitles.forEach(videoTitle => {
        videoTitle.addEventListener('keyup', async (e) => {
            if (e.keyCode == 13) {
                let response = await request(`/video/${videoTitle.dataset.id}`, 'PUT', {
                    title: videoTitle.textContent
                })
                let currentVideos = response.body.filter(video => video.user_id == user.user_id)
                videosRenderer(currentVideos)
            }
        })
    })
}

async function getData () {
    let response = await request('/video')
    let currentVideos = response.filter(video => video.user_id == user.user_id)
    videosRenderer(currentVideos)
}

getData()
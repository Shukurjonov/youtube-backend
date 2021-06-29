const searchForm = document.querySelector(".search-form");
const dataList = document.querySelector("#searched")
const searchInput = document.querySelector(".search-input");
const videosList = document.querySelector('.video__list'),
avatarImage  = document.querySelector('#img'),
subscriptionsList   = document.querySelector('.subscriptions-list')

let user = window.localStorage.getItem('user')
user = user ? JSON.parse(user) : {}

if (user.avatar_link) avatarImage.src = 'images/' + user.avatar_link


function usersRenderer(array) {
  let string = `
  <h3 class="subscriptions__title">Список пользователей</h3>
  <li class="subscriptions-item">
  <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" class="style-scope yt-icon" style="pointer-events: none; display: inline-block;"><g class="style-scope yt-icon"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8" class="style-scope yt-icon"></path></g></svg>
  <span>Главная</span>
  </li>
  `
  array.map(user => {
    string += `
    <li class="subscriptions-item" data-id=${user.user_id}>
    <img class="channel__image" src="${'images/' + user.avatar_link}" alt="subscriptions" width="30" height="30">
    <span class="channel__name">${user.username}</span>
    </li>
    `
  })
  
  subscriptionsList.innerHTML = string
  const subscriptionsItems = document.querySelectorAll('.subscriptions-item')
  subscriptionsItems.forEach((subscriptionsItem) => {
    subscriptionsItem.addEventListener('click', () => {
      subscriptionsItems.forEach((subscriptionsItem) => {
        subscriptionsItem.classList.remove('active')
      })
      subscriptionsItem.classList.add('active')
      if (subscriptionsItem.dataset.id) {
        let currentUser = array.find(user => user.user_id == subscriptionsItem.dataset.id)
        videosRenderer(currentUser.videos)
      } else getVideo()
    })
  })
}

function videosRenderer(array) {
  let string = ""
  array.map(video => {
    string += `
    <li class="video__item">
    <video src=${'videos/' + video.video_link} controls></video>
    
    <div class="video-info">
    <img class="video-info__creater-img" src=${'images/' + video.user.avatar_link} alt="channel-icon">
    
    <div class="heading-div">
    <h2 class="channel-name">${video.user.username[0].toUpperCase() + video.user.username.slice(1, video.user.username.length)}</h2>
    <div class="title-download-box">
    <h3 class="video__heading">${video.title}</h3>
    <a class="download" href="download?link=${video.video_link}"><img src="./img/download.png" /></a>
    </div>
    <time class="uploaded-time">${video.time}</time>
    </div>                  
    </div>
    </li>
    `
  })
  videosList.innerHTML = string
}


async function getVideo () {
  let response = await request('/video')
  videosRenderer(response)
}

async function getUsers () {
  let response = await request('/users') 
  usersRenderer(response)
}


searchInput.addEventListener('keyup', async (event) => {
  let text = searchInput.value.toLowerCase() || ""
  let response = await request(`/video/search?searchedItem=${text}`)
  let arrays = response.body
  let string = ''
  arrays.map(array => {
      string += `
          <option data-id=${array.video_id}>${array.title}<option/>
      `
  })
  dataList.innerHTML = string
})

searchForm.addEventListener("submit", async (event) => {
  event.preventDefault()
  let text = searchInput.value.toLowerCase()
  let response = await request(`/video/search?searchedItem=${text}`)
  videosRenderer(response.body)
})

getVideo()
getUsers()

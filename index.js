const searchRepositories = document.querySelector('#search-repo')
const wrapRepo = document.querySelector('#wrap-repo')
const listRepo = document.querySelector('#list-repo')


const debounce = (fn, ms) => {
  let timeout;
  return function() {
    const fnCall = () => { fn.apply(this, arguments) }
    clearTimeout(timeout)
    timeout = setTimeout (fnCall, ms)
  }
}
onChange = debounce(onChange, 500)
searchRepositories.addEventListener('input', onChange)

function getGitHub(repoName) {
  return fetch(`https://api.github.com/search/repositories?q=${repoName}&per_page=5`)
      .then(response => response.json())
      .then(repositories => repositories.items)
      .catch(err => Promise.reject(err))
}

function onChange() {
  let repoName = searchRepositories.value
  if(repoName.length === 0 ) return wrapRepo.style.display = 'none'

  wrapRepo.style.display = 'block'
  wrapRepo.innerHTML = ''
  getGitHub(repoName).then((repo) => {
    repo.forEach(elem => {
      let temp = document.createElement('div')
      temp.classList.add('autocomplete-item')
      temp.textContent = elem.name
      temp.setAttribute('data-repo-name', elem.name)
      temp.addEventListener('click', function() {
        addRepoSite(elem)

        searchRepositories.value = ''
        wrapRepo.style.display = 'none'
        wrapRepo.innerHTML = ''
      })
      wrapRepo.appendChild(temp)
    });
  }).catch(err => console.error(err))
}

function addRepoSite(repo) {
  const repoElem = document.createElement('div')
  repoElem.classList.add('list__item')
  listRepo.appendChild(repoElem)

  let repoDelete = document.createElement('div')
  repoDelete.classList.add('list__item-delete')
  repoElem.appendChild(repoDelete)
  repoDelete.addEventListener('click', function() {
    repoElem.remove()
  })

  let repoName = document.createElement('p')
  repoName.classList.add('list__item-row')
  repoName.textContent = `Название репозитория: ${repo.name}`
  repoElem.appendChild(repoName)

  let repoUser = document.createElement('p')
  repoUser.classList.add('list__item-row')
  repoUser.textContent = `Владелец репозитория: ${repo.owner.login}`
  repoElem.appendChild(repoUser)

  let repoStars = document.createElement('p')
  repoStars.classList.add('list__item-row')
  repoStars.textContent = `Звезды репозитория: ${repo.stargazers_count}`
  repoElem.appendChild(repoStars)
}
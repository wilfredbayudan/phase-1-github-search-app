document.addEventListener('DOMContentLoaded', () => {

  const form = document.querySelector('form#github-form');
  const inputValue = document.querySelector('input#search');
  form.addEventListener('submit', e => {
    e.preventDefault();

    const userUrl = 'https://api.github.com/search/users?q=';
    const repoUrl = 'https://api.github.com/users/'
    const userList = document.querySelector('#user-list');
    const reposList = document.querySelector('#repos-list');

    const searchQuery = inputValue.value;
    const fetchConfig = {
      method: 'GET',
      headers: {
        Accept: "application/vnd.github.v3+json"
      }
    }
    function renderRepos(array) {
      // Reset Repo List
      reposList.textContent = '';
      array.forEach(repo => {
        const { name , html_url } = repo;
        const li = document.createElement('li');
        const repoLink = document.createElement('a');
        repoLink.href = html_url;
        repoLink.setAttribute('target', '_blank');
        repoLink.textContent = name;
        li.appendChild(repoLink);
        reposList.appendChild(li);
      })
    }
    fetch(userUrl + searchQuery, fetchConfig)
      .then(res => res.json())
      .then(data => {
        userList.textContent = '';
        const results = data.items;
        results.forEach(user => {
          const { login, avatar_url, html_url, repos_url } = user;
          const li = document.createElement('li');
          li.addEventListener('click', () => {
            
            fetch(repos_url, fetchConfig)
              .then(res => res.json())
              .then(data => renderRepos(data))
              .catch(err => console.log(err));

          })
          const avatar = document.createElement('img');
          avatar.src = avatar_url;
          avatar.setAttribute('height', 50);
          li.appendChild(avatar);
          const span = document.createElement('span');
          span.textContent = login;
          span.classList.add('username')
          const profileLink = document.createElement('a');
          profileLink.href = html_url;
          profileLink.textContent = `View Profile`;
          profileLink.setAttribute('target', '_blank');
          span.appendChild(profileLink);
          li.appendChild(span);
          userList.appendChild(li);
        })
      })
      .catch(err => console.log(err));

    form.reset();
  })
  


})
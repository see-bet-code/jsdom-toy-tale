let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");

  function fetchToysCrud(toyData, url, method, callback) {
    let configObj = {
      method: method,
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(toyData)
    }

    fetch(url, configObj)
      .then(function(response) {
        return response.json();
      })
      .then(callback)
      .catch(function(error) {
        alert("Bad things! Ragnarők!");
        console.log(error.message);
      })
  }

  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    function createNewToy() {
      let toyData = {
        "name": toyFormContainer.querySelector("input[name='name']").value,
        "image": toyFormContainer.querySelector("input[name='image']").value,
        "likes": 0
      };

      fetchToysCrud(
        toyData,
        "http://localhost:3000/toys",
        "POST",
        renderAndysToys)
      
    }

    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
      const addToyForm = document.querySelector("form.add-toy-form")
      addToyForm.addEventListener("submit", function(e) {
        e.preventDefault()
        createNewToy()
      })
      
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  function updateLikes(toy, pTag) {
    let toyData = {
      "likes": toy.likes++
    };

    fetchToysCrud(
      toyData,
      `http://localhost:3000/toys/${toy.id}`,
      "PATCH", 
      function() { pTag.textContent = `${toy.likes} Likes` }
      )
    
  }

  function renderAndysToys(toys) {
    const toyCollection = document.querySelector("div#toy-collection")
    if (!Array.isArray(toys)) {
      toys = [toys]
    }
    toys.forEach(function(toy) {
      const div = document.createElement('div')
      div.className = 'card'
      
      div.innerHTML = `
          <h2>${toy.name}</h2>
          <img src=${toy.image} class="toy-avatar" />
          <p>${toy.likes} Likes </p>
          <button class="like-btn">Like <3</button>
      `
      toyCollection.append(div)

      const likeButton = div.querySelector("button")
      likeButton.addEventListener("click", function(e) {
        updateLikes(toy, div.querySelector("p"))
      })
    })
  }


  fetch("http://localhost:3000/toys") .then(function(response) {
    return response.json()
  }) .then(renderAndysToys)

});

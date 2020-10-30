let addToy = false;

const toyCollection = document.querySelector("#toy-collection")
const toyForm = document.querySelector(".add-toy-form")

//add event listener to toy form
toyForm.addEventListener("submit", submitToy)
//add event listener for toys (really just for like buttons)
toyCollection.addEventListener("click", likeToy)


document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});

//GET Request to toys db for character info
fetch("http://localhost:3000/toys")
.then(resp => resp.json())
.then(renderToys)


//render all toys funcrion
function renderToys(toys){
  toys.forEach(renderToy)
}

//render toy function
function renderToy(toy){
  //create card element with class card
  const card = document.createElement("div")
  card.classList.add("card")

  //set card id to toy id
  card.dataset.id = toy.id

  //create h2 element for name
  const h2 = document.createElement("h2")
  h2.innerHTML = toy.name

  //create image tag with class toy-avatar
  const image = document.createElement("img")
  image.src = toy.image
  image.classList.add("toy-avatar")

  //create p tag for likes
  const p = document.createElement("p")
  p.classList.add("likes")
  p.textContent = `${toy.likes} likes`

  //add like button
  const likeBtn = document.createElement("button")
  likeBtn.classList.add("like-btn")
  likeBtn.textContent = "Like"

  //append each element to toy-collection
  card.append(h2,image, p, likeBtn)

  toyCollection.append(card)


  //alternative code for data render
  // card.innerHTML = `
  //   <h2>${toy.name}</h2>
  //   <img src=${toy.image} class="toy-avatar" />
  //   <p>${toy.likes} Likes </p>
  //   <button class="like-btn">Like <3</button>

  // `

}

//Submit toy function POST
function  submitToy(event){
  
  event.preventDefault()
  //create new toy from form
  const newToy = {
    "name": event.target.name.value,
    "image": event.target.image.value,
    "likes": 0
  }
  //reset form params
  toyForm.reset()

  //fetch POST request
  return fetch("http://localhost:3000/toys", {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
  
    body: JSON.stringify(newToy)
  })
  .then(response => response.json())
  .then(newToy =>{
    renderToy(newToy)
  })
  
}

//Add likes function

function likeToy(event){
  if (event.target.matches(".like-btn")){
    //setting button variable to event.target (the button that was clicked)
    const button = event.target

    //setting card variable to dataset
    const card = button.closest(".card")

    // setting id to card.data
    const id = card.dataset.id

    //create like span
    const likesCountSpan = card.querySelector(".likes")

    
    //create updated likes
    const likesCount = parseInt(likesCountSpan.textContent) + 1

    //PATCH fetch request updates toy
    return fetch(`http://localhost:3000/toys/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        likes: likesCount
      }),
    })
      .then(response => {
        return response.json()
      })
      .then(updatedToy => {
        
        likesCountSpan.textContent = `${updatedToy.likes} likes`
      })

  }
}
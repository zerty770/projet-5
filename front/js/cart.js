// 1 recuperer les info produit
//pointer l'endroie ou ajouter les elements


let container = document.querySelector('#cart__items')
console.log(container)

let totalP = 0
let totalQ = 0

let displayPanier = async () => {
  const panier = JSON.parse(localStorage.getItem('panier'))
  const url = 'http://localhost:3000/api/products/'
  console.log(panier);

  // Vérification, si le panier est vide 
  // Si oui - retour page d'accueil
  if (panier.length == 0) {
    alert('votre panier est vide')
    window.location.href = 'index.html'
  }

  for (item of panier) {

    // Pour chaque item (donc en fait chaque produit) aller sur l'api récup le prix
    // ensuite insertAdjacentHTML
    try{
    let blob = await fetch('http://localhost:3000/api/products/' + item.id)
    let data = await blob.json()
      

    container.insertAdjacentHTML("beforeend", `
      <article class="cart__item" data-id="${item.id}" data-color="${item.color}" > 
              <div class="cart__item__img">
                <img src="${data.imageUrl}" alt="${data.altTxt}">
              </div>
              <div class="cart__item__content">
                <div class="cart__item__content__description">
                  <h2>${data.name}</h2>
                  <p>${item.color}</p>
                  <p>${data.price}€</p>
                </div>
                <div class="cart__item__content__settings">
                  <div class="cart__item__content__settings__quantity">
                    <p>Qté : </p>
                    <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${item.quantity}">
                  </div>
                  <div class="cart__item__content__settings__delete">
                    <p class="deleteItem">Supprimer</p>
                  </div>
                </div>
              </div>
            </article> 
      `)

    totalP += parseInt(data.price * item.quantity)
    totalQ += parseInt(item.quantity)
    displayTotal()




    }catch(err){
      console.log(err)
    } 
  }
  Supprimer()
  modifier()
  viericationFormulaire()
}

let displayTotal = () => {
  document.querySelector('#totalPrice').textContent = totalP
  console.log(document.querySelector('#totalPrice').textContent);

  document.querySelector('#totalQuantity').textContent = totalQ
  console.log(document.querySelector('#totalQuantity').textContent)
}

let Supprimer = () => {

  let elements = document.querySelectorAll('.deleteItem') 
  elements.forEach(btn => {
      btn.addEventListener('click', e=>{
        let article = e.target.closest('article')
        supprimerProduit(article.dataset.id, article.dataset.color)
        article.remove()
      })
  })
}

let supprimerProduit = (id,color) => {
  const panier = JSON.parse(localStorage.getItem('panier'))

  //recherche id
  let search = panier.findIndex(p => p.id === id && p.color === color)


  //recup produit
  fetch('http://localhost:3000/api/products/'+ id)
    .then(test => test.json())
    .then(product => { 
        console.log(product)
        //mise a jour
        miseAJour(
          -(panier[search].quantity),
          parseInt(product.price)
        )

        displayTotal()

        panier.splice(panier.findIndex(p => p.id === id && p.color === color ),1)

        sauvegarde(panier)  
        

    })
    .catch(err => console.log(err))
}

let miseAJour = (quantity, price) => {
 
  totalQ += quantity
  totalP += (quantity * price)
  console.log(quantity, price)
  console.log(totalP, totalQ)
}

let sauvegarde = (panier) => {

  // const panier = JSON.parse(localStorage.getItem('panier'))
  localStorage.setItem('panier', JSON.stringify(panier))
  console.log(JSON.stringify(panier));
}

let viderPanier = () => {
  localStorage.removeItem('panier')
}

let modifier = () => {

  let inputs = document.querySelectorAll('.itemQuantity')
  for (let input of inputs) {

    //recup localstorage   
    const panier = JSON.parse(localStorage.getItem('panier'))

    

    input.addEventListener('change', e => {
      let article = e.target.closest('article') // c'est l'input
      
      newQt = parseInt(e.target.value)

      //recup produit
      fetch('http://localhost:3000/api/products/'+ article.dataset.id)
        .then(test => test.json())
        .then(product => { 
            console.log(product)
            

            let search = panier.findIndex(p => p.id === article.dataset.id && p.color === article.dataset.color)

            // ajout de quantité
            if (newQt > panier[search].quantity) {
              console.log('je suis dans le +')
              let difference = newQt - panier[search].quantity

              //mise a jour des quantités
              miseAJour(difference, parseInt(product.price))
              displayTotal()

              //mise a jour panier
              panier[search].quantity = newQt

            }
            //diminution d'article
            if (newQt < panier[search].quantity) {
              let difference = panier[search].quantity - newQt
              console.log('je suis dans le moin');
              miseAJour(-difference, parseInt(product.price))
              displayTotal()

              //mise a jour panier
              panier[search].quantity = newQt
            }

            sauvegarde(panier)
        })
        .catch(err => console.log(err))        
    })
    


  }

}

let viericationFormulaire =  () => {
  document.querySelector('#order').addEventListener('click', e =>{
    e.preventDefault()

    //definition expression reguliere
    let regEmail = /^\w+([.-]?\w+)*@\w+([.-]?\w+)(.\w{2,3})+$/i
    let regName = /^[a-zA-Z\s'-]+$/i
    let regAdresse = /^[a-z0-9/s'-]*$/i
    let regCity = /^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*$/i


    // recuperation HTML du formulaire
    let form = e.target.closest('form').elements
    console.log(form);

    //flag valiation
    let flag = true

    // validation des champs
    if(!regName.test(form['firstName'].value)){
      form['firstName'].nextElementSibling.textContent = `Prénom invalide !`
      flag = false
    }else{
      form['firstName'].nextElementSibling.textContent = ``
      flag = true
    }

    if(!regName.test(form['lastName'].value)){
      form['lastName'].nextElementSibling.textContent = `Nom invalide !`
      flag = false
    }else{
      form['lastName'].nextElementSibling.textContent = ``
      flag = true
    }

    if(!regAdresse.test(form['address'].value)){
      form['address'].nextElementSibling.textContent = `Adresse invalide !`
      flag = false
    }else{
      form['address'].nextElementSibling.textContent = ``
      flag = true
    }

    if(!regCity.test(form['city'].value)){
      form['city'].nextElementSibling.textContent = `Ville invalide !`
      flag = false
    }else{
      form['city'].nextElementSibling.textContent = ``
      flag = true
    }

    if(!regEmail.test(form['email'].value)){
      form['email'].nextElementSibling.textContent = `Mail invalide !`
      flag = false
    }else{
      form['email'].nextElementSibling.textContent = ``
      flag = true
    }

    //Formulaire erreur
    if(!flag){
      return false
    }

    // envoie de la commande
      const panier = JSON.parse(localStorage.getItem('panier'))
    
      let order = {
        contact: {
          firstName: form['firstName'].value,
          lastName: form['lastName'].value,
          address: form['address'].value,
          city: form['city'].value,
          email: form['email'].value
        },
        products: panier.map(p => p.id)
      }
      console.log(order);
    
      let enTete = {
        method: "POST",
        body: JSON.stringify(order),
        Headers: {
          Accept: "application/json",
          "Content-Type": "application.json"
        }
      }
    
      fetch('http://localhost:3000/api/products/order', enTete)
        .then(cmd => cmd.json())
        .then(cmdId => { 
          viderPanier()
          console.log(cmdId);
          //window.location.href= 'confirmation.html?id='+cmdId
        })
        .catch(err => console.log(err))
    
      console.log('send commande');

  })
}





window.addEventListener('load', displayPanier)


// for(i=0; i<4; i++){
//   // plein d'autre code ici
//   total += 1
// }

// console.log(total)

// 1 - AddEventlistener sur quantity
// 2 - Dans quel sens ?
// 3 - Trouver l'article dans le panier
// 3 - Sauvegarde dans le panier
// 4 - Mettre à jour les totaux
















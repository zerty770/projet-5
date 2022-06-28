
let container = document.querySelector('#cart__items')
console.log(container)

// Variables pour les totaux
let totalP = 0
let totalQ = 0

// Fonction d'affichage du panier dans la page
let displayPanier = async () => {
  const panier = JSON.parse(localStorage.getItem('panier'))
  const url = 'http://localhost:3000/api/products/'
  console.log(panier);


  //si panier n'existe pas ou vide
  if (panier === null || panier.length === 0){
    alert('votre panier est vide')
    window.location.href = 'index.html'
  }

  /*si le panier ne contient pas d'article
  if (panier.length === 0) {
    alert('votre panier est vide')
    window.location.href = 'index.html'
  }*/

  //affichage des articles du panier
  for (item of panier) {

    // Pour chaque item (donc en fait chaque produit) aller sur l'api récup le prix
    // ensuite insertAdjacentHTML
    try{
      let blob = await fetch('http://localhost:3000/api/products/' + item.id)
      let data = await blob.json()
        
      // Injection du code HTML pour chaque article
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

      // Mise à jour des totaux + affichage
      totalP += parseInt(data.price * item.quantity)
      totalQ += parseInt(item.quantity)
      displayTotal()

    }catch(err){
      console.log(err)
    } 
  }

  // Appel des fonctions d'écoute d'évennement
  Supprimer()
  modifier()
  viericationFormulaire()
}

// Affichage des totaux
let displayTotal = () => {
  document.querySelector('#totalPrice').textContent = totalP
  console.log(document.querySelector('#totalPrice').textContent);

  document.querySelector('#totalQuantity').textContent = totalQ
  console.log(document.querySelector('#totalQuantity').textContent)
}

// Fonction de suppression article
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

// Mise en place unitaire du listener de suppression
let supprimerProduit = (id,color) => {
  // Récupération du panier
  const panier = JSON.parse(localStorage.getItem('panier'))

  // Recherche de l'article dans le panier
  let search = panier.findIndex(p => p.id === id && p.color === color)


  // Récupération du produit dans l'API pour valorisation
  fetch('http://localhost:3000/api/products/'+ id)
    .then(test => test.json())
    .then(product => { 
        console.log(product)
        // Mise a jour totaux
        miseAJour(
          -(panier[search].quantity),
          parseInt(product.price)
        )

        // Affichage totaux
        displayTotal()

        // Nettoyage du panier et sauvegarde localStorage
        panier.splice(panier.findIndex(p => p.id === id && p.color === color ),1)
        sauvegarde(panier)  
    })
    .catch(err => console.log(err))
}

// Fonction d'ajout ou suppression sur les totaux
let miseAJour = (quantity, price) => {
 
  totalQ += quantity
  totalP += (quantity * price)
  console.log(quantity, price)
  console.log(totalP, totalQ)
}

// Fonction de sauvegarde dans le localStorage
let sauvegarde = (panier) => {
  localStorage.setItem('panier', JSON.stringify(panier))
}

// Fonction de nettoyage du panier
let viderPanier = () => {
  localStorage.removeItem('panier')
}

// Fonction de mise en place de la modification de quantité par article
let modifier = () => {

  let inputs = document.querySelectorAll('.itemQuantity')
  for (let input of inputs) {

    // Récupération du panier  
    const panier = JSON.parse(localStorage.getItem('panier'))

    // Mise en place du listener
    input.addEventListener('change', e => {
      let article = e.target.closest('article') // c'est l'input
      
      newQt = parseInt(e.target.value)

      // Récupération du produit depuis l'API
      fetch('http://localhost:3000/api/products/'+ article.dataset.id)
        .then(test => test.json())
        .then(product => { 
            console.log(product)
            
            // Recherche du produit dans le panier par id et couleur
            let search = panier.findIndex(p => p.id === article.dataset.id && p.color === article.dataset.color)

            // Ajout de quantité
            if (newQt > panier[search].quantity) {
              console.log('je suis dans le +')
              let difference = newQt - panier[search].quantity

              // Mise a jour des quantités
              miseAJour(difference, parseInt(product.price))
              displayTotal()

              // Mise a jour panier
              panier[search].quantity = newQt

            }
            // Diminution d'article
            if (newQt < panier[search].quantity) {
              let difference = panier[search].quantity - newQt
              console.log('je suis dans le moin');
              miseAJour(-difference, parseInt(product.price))
              displayTotal()

              // Mise a jour panier
              panier[search].quantity = newQt
            }

            // Sauvegarde dans le localStorage
            sauvegarde(panier)
        })
        .catch(err => console.log(err))        
    })
  }
}

// Ecoute de la soumission du formulaire et test des champs
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

    if(!regAdresse.test(form['address'].value.trim())){
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

    // SI Formulaire erreur
    if(!flag){
      return false
    }

    // Mise en place des éléments pour la commande vers API
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
  
    const enTete = {
      method: "POST",
      body: JSON.stringify(order),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    }
    
    // Envoi de la commande
    // (Nettoyage panier et go page confirmation si cmd OK)
    fetch('http://localhost:3000/api/products/order', enTete)
      .then(cmd => cmd.json())
      .then(data => { 
        viderPanier()
        window.location.href= 'confirmation.html?id='+data.orderId
      })
      .catch(err => console.log(err))
  })
}
window.addEventListener('load', displayPanier)

















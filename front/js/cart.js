// 1 recuperer les info produit


//pointer l'endroie ou ajouter les elements


let container = document.querySelector('#cart__items')
console.log(container)

let totalP = 0
let totalQ = 0

let displayPanier = () => {
  const panier = JSON.parse(localStorage.getItem('panier'))
  const url = 'http://localhost:3000/api/products/'
  console.log(panier);

  // Vérification, si le panier est vide 
  // Si oui - retour page d'accueil
  if(panier.length == 0){
    alert('votre panier est vide')
    window.location.href = 'index.html'
  }

  for(item of panier){
    console.log(item);
    // Pour chaque item (donc en fait chaque produit) aller sur l'api récup le prix
        // ensuite insertAdjacentHTML

    fetch('http://localhost:3000/api/products/'+item.id)
      .then(panier => panier.json())
      .then(data => { 
          console.log(data)

          container.insertAdjacentHTML("beforeend",`
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

          totalP += data.price * item.quantity
          totalQ += item.quantity
          displayTotal()
          //Supprimer()
          modifier()
 
          console.log(item.id);
          console.log(item.color);
          console.log('findiplaypanier');

      })
      .catch(err => console.log(err))
  }
}

let displayTotal = () => {
  document.querySelector('#totalPrice').textContent = totalP 
  console.log(document.querySelector('#totalPrice').textContent);

  document.querySelector('#totalQuantity').textContent = totalQ
  console.log(document.querySelector('#totalQuantity').textContent)
}

/*let Supprimer = () => {
  console.log('start delete');
  const panier = JSON.parse(localStorage.getItem('panier'))
  let elements = document.querySelectorAll('.deleteItem') 
  elements.forEach(btn => {
      btn.addEventListener('click', e=>{
      let article = e.target.closest('article')
      panier.supprimerProduit(article.dataset.id, article.dataset.color)
      article.remove()
      })
  })
}

  let supprimerProduit = (id,color) => {
    const panier = JSON.parse(localStorage.getItem('panier'))

    //recherche id
    let search = panier.findIndex(p => p.id === id && p.color === color)
  

    //recup produit
    let product = this.fetch('http://localhost:3000/api/products/'+ item.id)
    .then(test => test.json())
    .then(donne => { 
        console.log(donne)
    })

    //mise a jour
    this.miseAJour(
      -(this.panier[search].quantity),
      product.price
    )

    displayTotal()

    this.panier.splice(this.panier.findIndex(p => p.id === article._id && p.color === color ),1)

    sauvegarde()  
    
    console.log(SupprimerProduit);
  }*/

  let miseAJour = (quantity, price) => {
    this.totalP += quantity
    this.totalQ += (quantity * price)
  }

  let sauvegarde = () => {
    const panier = JSON.parse(localStorage.getItem('panier'))
    localStorage.setItem('panier', JSON.stringify(panier)) 
    console.log(JSON.stringify(panier));
  }

  let viderPanier = () => {
    localStorage.removeItem('panier')
    console.log(localStorage.removeItem('panier'));
  }

  let modifier = () => {

    let inputs = document.querySelectorAll('.itemQuantity')
    for(let input of inputs){   
      
      //recup localstorage   
      const panier = JSON.parse(localStorage.getItem('panier'))

      newQt = input.value

      input.addEventListener('change', e => {
      let article = e.target.closest('article').dataset.id // c'est l'input

      //recup produit
      let product = this.fetch('http://localhost:3000/api/products/'+ item.id)
      .then(test => test.json())
      .then(data => { 
      console.log(data)
      }) 

      let search = panier.findIndex(p => p.id === article.dataset.id && p.color === article.dataset.color) 
      console.log('cooucou');

      // ajout de quantité
      if(newQt > this.panier[search].quantity){
        let difference = newQt - this.panier[search].quantity

        //mise a jour des quantités
        this.miseAJour(difference, product.price)
        displayTotal()
        
        //mise a jour panier
        this.panier[search].quantity = newQt

      }
      //diminution d'article
      if(input < this.panier[search].quantity){
        let difference =  this.panier[search].quantity - newQt}

        this.miseAJour(-difference, product.price)
        displayTotal()

        //mise a jour panier
        this.panier[search].quantity = newQt        
      })

      sauvegarde()

  console.log(input);
    }

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










        



        

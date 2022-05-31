// 1 recuperer les info produit


//pointer l'endroie ou ajouter les elements
const recupPanier = JSON.parse(localStorage.getItem('panier'))
console.log(recupPanier);

let container = document.querySelector('#cart__items')
console.log(container)

for(item of recupPanier){
  // Pour chaque item (donc en fait chaque produit) aller sur l'api récup le prix
      // ensuite insertAdjacentHTML

  fetch('http://localhost:3000/api/products/'+item.id)
    .then(panier => panier.json())
    .then(data => { 
        console.log(data)

        container.insertAdjacentHTML('beforeend',`
        <article class="cart__item" data-id="${data._id}" data-color="${data.color}">
                <div class="cart__item__img">
                  <img src="${item.imageUrl}" alt="${item.altTxt}">
                </div>
                <div class="cart__item__content">
                  <div class="cart__item__content__description">
                    <h2>"${item.name}"</h2>
                    <p>"${data.colors}"</p>
                    <p>"${item.price}"</p>
                  </div>
                  <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                      <p>Qté : </p>
                      <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${data.quantity}">
                    </div>
                    <div class="cart__item__content__settings__delete">
                      <p class="deleteItem">Supprimer</p>
                    </div>
                  </div>
                </div>
              </article> 
        `)
        console.log(container.insertAdjacentHTML);
    })

    
    .catch(err => console.log(err))
}










        let Supprimer = document.getElementsByClassName("deleteItem")
        Supprimer.onclick = supprimerProduits
        console.log(Supprimer);

        function supprimerProduits() {
            localStorage.removeItem(recupPanier.id)
            localStorage.removeItem(recupPanier.color)
            localStorage.removeItem(recupPanier.quantity)
        }



        



        

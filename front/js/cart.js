// 1 recuperer les info produit


//pointer l'endroie ou ajouter les elements

let container = document.querySelector('#cart__items')
console.log(container)



fetch('http://localhost:3000/api/products')
    .then(panier => panier.json)
    .then(data => { 
        console.log(data)


        //definir les elements
        let id = data.id
        let colors = data.colors
        let quantity = data.quantity
        let altTxt = data.altTxt
        let name = data.name
        let imageUrl = data.imageUrl
        let price= data.price
        console.log(data)



        //recuperer les produits

        localStorage.getItem('id', id)
        localStorage.getItem('colors', colors)
        localStorage.getItem('quantity',quantity)
        console.log(localStorage);

        let Supprimer = document.getElementsByClassName("deleteItem")
        Supprimer.onclick = supprimerProduits
        console.log(Supprimer);

        function supprimerProduits() {
            localStorage.removeItem('id', id)
            localStorage.removeItem('colors',colors)
            localStorage.removeItem('quantity', quantity)
        }

        //afficher les produits
        container.insertAdjacentHTML('beforeend',`
        <article class="cart__item" data-id="${id}" data-color="${colors}">
                <div class="cart__item__img">
                  <img src="${imageUrl}" alt="${altTxt}">
                </div>
                <div class="cart__item__content">
                  <div class="cart__item__content__description">
                    <h2>"${name}"</h2>
                    <p>"${colors}"</p>
                    <p>"${price}"</p>
                  </div>
                  <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                      <p>Qté : </p>
                      <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${quantity}">
                    </div>
                    <div class="cart__item__content__settings__delete">
                      <p class="deleteItem">Supprimer</p>
                    </div>
                  </div>
                </div>
              </article> 
        `)

        
        









    })
    .catch(err => console.log(err))
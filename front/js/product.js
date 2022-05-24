// 1 - Récupérer l'id de l'article qui est dans l'imageUrl
// 2 - Appeler l'API avec la bonne url pour récupérer LE produit
// 3 - Injecter les information dans le DOM



// recuperer l'id du produit dans L'url
const urlId = window.location.search
console.log(urlId)

const id = urlId.slice(4)
console.log(id);

/**
 * Fonction de récupération du proiduit et mise en place dans le DOM
 */
let getProduct = () => {

    let container = document.querySelector('#colors')
    console.log(container);

    // Récupération du produit depuis l'API
    fetch(`http://localhost:3000/api/products/${id}`)
        .then(test => test.json())
        .then(data => {
            console.log(data)
            
            document.querySelector('.item__img') .innerHTML = `<img src="${data.imageUrl}" alt="${data.altTxt}">`
            document.querySelector('#title').innerHTML = data.name
            document.querySelector('#price') .innerHTML = data.price
            document.querySelector('#description').innerHTML = data.description
            document.querySelector('title').textContent = data.name;

            // Insertion des option de couleurs
            for(item of data.colors){
                console.log(item)

                container.insertAdjacentHTML('beforeend', `
                    <option value="${item}">${item}</option>
                `)
            }

            console.log(colors)
        })
        .catch(err => console.log(err))

    startListener()
}

let startListener = () => {
    //envoie des informations produit au panier

    document.getElementById("addToCart").addEventListener('click', () => {
        // 1 récupérer les infos sélectionnée (id, couleur, quantité)
        let cl = document.getElementById('colors').value
        console.log(cl);

        let qt = document.querySelector('#quantity').value
        console.log(qt)
        
        let panier = JSON.parse(localStorage.getItem('panier'))
        console.log(panier)   
        
        let choix = {
            id: id,
            color: cl,
            quantity: qt
        }        

        panier.push(choix)

      localStorage.setItem('panier', JSON.stringify(panier))
      console.log(JSON.stringify(panier));


    })
 
}
    
window.addEventListener('load', getProduct)



// AJout au panier
/*
1- je récupère mon panier
2- je rassemble les infos (choix)
3- Mise à jour du panier
    3-1 Si le produit n'existe pas dans le panier => simple ajout
    3-2 Si le produit existe déjà (id et couleur) => ajout à la quantité
4- Envoie au localStorage

*/




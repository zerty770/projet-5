// recuperer l'id du produit dans L'url
const urlId = window.location.search
console.log(urlId)

const id = urlId.slice(4)
console.log(id);


 //Fonction de récupération du produit et mise en place dans le DOM
let getProduct = () => {

    let container = document.querySelector('#colors')
    console.log(container);

    // Récupération du produit depuis l'API
    fetch(`http://localhost:3000/api/products/${id}`)
        .then(test => test.json())
        .then(data => {
            console.log(data)
            
            document.querySelector('.item__img').innerHTML = `<img src="${data.imageUrl}" alt="${data.altTxt}">`
            document.querySelector('#title').innerHTML = data.name
            document.querySelector('#price').innerHTML = data.price
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

//mise en place de l'ecout du clique et de l'envoie au panier
let startListener = () => {
    
    //écout du click
    document.getElementById("addToCart").addEventListener('click', () => {
        
        let cl = document.getElementById('colors').value
        console.log(cl);

        let qt = document.querySelector('#quantity').value
        console.log(qt)
        
        // mettre le panier en chaine de character
        let panier = JSON.parse(localStorage.getItem('panier')) ||[]
        console.log(panier)   
        
        let choix = {
            id: id,
            color: cl,
            quantity: parseInt(qt)
        }         

        //condition de recherche d'objet identique 
        let search = panier.findIndex(p => p.id === id && p.color === cl)
        console.log(search)

        //mise en place du push au apnier
        if(search === -1){
            console.log('dans le -1')
            panier.push(choix)
        } else{
            console.log('dans autre')
            panier[search].quantity += parseInt(qt)
        }  console.log(panier);
        
        //mettre le panier en chaine json
        localStorage.setItem('panier', JSON.stringify(panier)) 
        console.log(JSON.stringify(panier));
    }

    )
 
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
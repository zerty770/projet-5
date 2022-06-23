let start = () => {

    // Pointer dans le DOM - pour liste produit
    let container = document.querySelector('#items')
    console.log(container)

    // Récupération de tous les produits depuis l'API
    fetch('http://localhost:3000/api/products')
        .then(blob => blob.json())
        .then(data => {
            console.log(data)

            // Parcours des produits
            for(item of data){
                console.log(item)

                // Insertion des produit avec le model fourni
                container.insertAdjacentHTML('beforeend', `
                    <a href="./product.html?id=${item._id}">
                        <article>
                            <img src="${item.imageUrl}" alt="${item.altTxt}">
                            <h3 class="productName">${item.name}</h3>
                            <p class="productDescription">${item.description}</p>
                        </article>
                    </a>
                `)
            }
        })
        .catch(err => console.log(err))

}

window.addEventListener('load', start)
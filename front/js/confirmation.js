//recuperation de l'identifiant de l'url comme confirmation commande
let displayOrderId = () => {
    const urlParams = new URLSearchParams(window.location.search)
    document.querySelector('#orderId').textContent = urlParams.get('id')
}

window.addEventListener('load', () => displayOrderId())
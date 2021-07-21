export default (user) => {
  let contador = 0
  for (const i in user.cart) {
    contador += user.cart[i].price
  }

  return contador
}

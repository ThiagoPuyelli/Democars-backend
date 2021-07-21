export default (length: Number) => {
  const caracters = 'qwertyuiopasdfghjklñzxcvbnm1234567890'
  let code = ''
  for (let i = 0; i < length; i++) {
    code += caracters.split('')[Math.floor(Math.random() * 37)]
  }
  return code
}

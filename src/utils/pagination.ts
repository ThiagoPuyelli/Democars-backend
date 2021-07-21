export default (length: number, objects: Array<any>, page: number) => {
  let actualPage = length * (page - 1)
  const array = []
  for (let i = 0; i < length; i++) {
    if (objects[actualPage]) {
      array.push(objects[actualPage])
    }
    actualPage++
  }
  return array
}

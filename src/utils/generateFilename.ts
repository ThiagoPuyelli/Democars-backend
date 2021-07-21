import fs from 'fs'
import path from 'path'
import generateID from './generateID'

export const generate = async (length: Number, ext: string) => {
  let code = await generateID(length)
  code += '.' + ext
  const verifyToExist: boolean = fs.existsSync(path.join(__dirname, '/../uploads/' + code))
  if (verifyToExist) {
    return generate(length, ext)
  }
  return code
}

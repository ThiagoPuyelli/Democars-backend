import { Document } from 'mongoose'

interface CodePassword {
    code: string;
    date: number;
}

interface CartProduct {
    _id?: string;
    productID: string;
    price: number;
    amount: number;
}

interface FavouriteProduct {
    _id?: string;
    productID;
}

interface UserInterface extends Document {
    name: string;
    lastname: string;
    email: string;
    password: string;
    role: string;
    favourites: [FavouriteProduct];
    cart: [CartProduct];
    codePassword: CodePassword;
    image?: string;
}

export default UserInterface

import ProductInterface from './ProductInterface'

interface UserInterface {
    name: string;
    lastname: string;
    email: string;
    password: string;
    favourites: [ProductInterface];
    cart: [ProductInterface];
}

export default UserInterface

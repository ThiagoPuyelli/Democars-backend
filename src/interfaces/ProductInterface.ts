import UserInterface from './UserInterface'

export type categories = 'Rines' | 'Audio' | 'Body Kits' | 'Accesorios'

export interface CommentInterface {
    user: UserInterface;
    comment: string;
}

export interface ReviewInterface {
    user: UserInterface;
    description: string;
    rating: number;
    date: number;
}

interface ProductInterface {
    title: string;
    description: string;
    price: number;
    categories: categories;
    comments: [CommentInterface];
}

export default ProductInterface

import { Document } from 'mongoose'

export interface CommentInterface {
    _id?: string;
    userID: string;
    comment: string;
    date: number;
}

export interface ReviewInterface {
    _id?: string
    userID: string;
    review: string;
    rating: number;
    date: number;
}

interface ProductInterface extends Document {
    title: string;
    description: string;
    price: number;
    categories: string[];
    image: string;
    comments: [CommentInterface];
    reviews: ReviewInterface[];
    date: number;
    rating: number;
}

export default ProductInterface

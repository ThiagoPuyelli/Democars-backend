import { ReviewInterface } from './ProductInterface'

export interface LikeInterface {
  _id?: string;
  userID: string;
}

export interface WorkInterface {
  _id?: string;
  serviceID: string;
  title: string;
  description: string;
  images: string[];
  likes: LikeInterface[];
  rating: number;
  review: ReviewInterface
}

export interface TurnInterface {
  _id?: string;
  name: string;
  email: string;
  reason: string;
  date: Date;
  serviceID: string;
}

interface ServiceInterface {
  _id?: string;
  title: string;
  description: string;
  image: string;
  works: WorkInterface[];
  schedule: TurnInterface[];
}

export default ServiceInterface

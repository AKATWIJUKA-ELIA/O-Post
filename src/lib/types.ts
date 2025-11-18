import { Id } from "../../convex/_generated/dataModel"
import { JWTPayload } from 'jose';
export interface SessionPayload extends JWTPayload {
  userId: string;
  role: string; 
  isVerified: boolean;
  expiresAt:Date
}

export type Post = {
  title: string
  authorId: Id<"users">
  excerpt: string
  content: string
  category: string
  postImage: string|null
  upvotes?: number
  downvotes?: number
  updatedAt?: number
}

export type DwonloadPost = {
        _id: Id<"posts">
  title: string
  authorId: Id<"users">
  excerpt: string
  content: string
  category: string
  postImage: string|null
  upvotes?: number
  downvotes?: number
  updatedAt?: number
        _creationTime?:number
}

export interface User {
        _id?: Id<"users">|undefined,
        username?: string|undefined,
        email?: string|undefined,
        passwordHash?: string|undefined,
        phoneNumber?: string,
        profilePicture?: string|null,
        isVerified?: boolean | false|undefined,
        role?: string|""|undefined,
        reset_token?:string|undefined,
        reset_token_expires?:number|undefined,
        updatedAt?: number|undefined,
        lastLogin?: number,
        _creationTime?:number,
}
export interface UpstreamUser {
        _id: Id<"users">,
        username: string,
        email: string,
        passwordHash: string,
        phoneNumber?: string,
        profilePicture?: string,
        isVerified: boolean | false,
        role: string|"",
        reset_token?:string
        reset_token_expires:number,
        updatedAt: number,
        lastLogin?: number,
}

export interface UserProfile {
        userId: string;
        role: string; 
        isVerified: boolean;
        expiresAt:Date
}
export type Comment = {
        _id: Id<"comments">
        postId: Id<"posts">
        commentorId: Id<"users">
        content: string
        upvotes?: number
        downvotes?: number
        updatedAt?: number
}
export type CommentWithCommentor = Comment & {
        commentor: User|null
}
export type PostWithAuthor = DwonloadPost & {
        author: User | null
}
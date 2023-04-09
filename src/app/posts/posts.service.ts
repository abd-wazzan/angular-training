import {Post} from "./post.model";
import {Injectable} from "@angular/core";
import {map, Subject} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";

@Injectable({providedIn: 'root'})
export class PostsService {
    private posts: Post[] = [];
    private postsUpdated: Subject<{posts: Post[], count: number}> = new Subject<{posts: Post[], count: number}>();
    private postsCount = 0;

    constructor(private httpClient: HttpClient, private router: Router) {
    }

    getPostUpdatedListener() {
        return this.postsUpdated.asObservable();
    }

    getPosts(postsPerPage: number, currentPage: number) {
        const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
        this.httpClient.get<{
            message: string,
            data: any,
            count: number
        }>('http://localhost:3000/api/posts' + queryParams)
            .pipe(map((res) => {
                return {
                    count: res.count,
                    posts: res.data.map(post => {
                        return {
                            id: post._id,
                            title: post.title,
                            content: post.content,
                            imagePath: post.imagePath,
                            creator: post.creator
                        }
                    })
                };
            }))
            .subscribe((data) => {
                this.posts = data.posts;
                this.postsCount = data.count;
                this.postsUpdated.next({posts: [...this.posts], count: this.postsCount});
            });
    }

    addPost(title: string, content: string, image: File) {
        const postData = new FormData();
        postData.append("title", title);
        postData.append("content", content);
        postData.append("image", image, title);
        this.httpClient.post<{ message: string, data: any }>('http://localhost:3000/api/posts', postData)
            .subscribe(() => {
                this.router.navigate(["/"]);
            });
    }

    deletePost(id: string) {
        return this.httpClient.delete<{ message: string }>('http://localhost:3000/api/posts/' + id);
    }

    getPost(id: string) {
        return this.httpClient.get<{ message: string, data: any }>('http://localhost:3000/api/posts/' + id)
            .pipe(map((res) => {
                    return {
                        id: res.data._id,
                        title: res.data.title,
                        content: res.data.content,
                        imagePath: res.data.imagePath,
                        creator: res.data.creator
                    };
                })
            );
    }

    updatePost(id: string, title: string, content: string, image: File | String) {
        let postData: Post | FormData;
        if (typeof (image) === 'object') {
            postData = new FormData();
            postData.append("id", id);
            postData.append("title", title);
            postData.append("content", content);
            postData.append("image", image as File, title);
        } else {
            postData = {id: id, title: title, content: content, imagePath: image, creator: null};
        }
        this.httpClient.put<{ message: string, data: any }>('http://localhost:3000/api/posts/' + id, postData)
            .subscribe(() => {
                this.router.navigate(["/"]);
            });
    }
}
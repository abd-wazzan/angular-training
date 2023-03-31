import {Post} from "./post.model";
import {Injectable} from "@angular/core";
import {map, Subject} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";

@Injectable({providedIn: 'root'})
export class PostsService {
    private posts: Post[] = [];
    private postsUpdated: Subject<Post[]> = new Subject<Post[]>();

    constructor(private httpClient: HttpClient, private router: Router) {
    }

    getPostUpdatedListener() {
        return this.postsUpdated.asObservable();
    }

    getPosts() {
        this.httpClient.get<{ message: string, data: any }>('http://localhost:3000/api/posts')
            .pipe(map((res) => {
                return res.data.map(post => {
                    return {
                        id: post._id,
                        title: post.title,
                        content: post.content
                    }
                });
            }))
            .subscribe((transformedPosts) => {
                this.posts = transformedPosts;
                this.postsUpdated.next([...this.posts]);
            });
    }

    addPost(title: string, content: string) {
        const post: Post = {id: null, title: title, content: content};
        this.httpClient.post<{ message: string, data: any }>('http://localhost:3000/api/posts', post)
            .pipe(map((res) => {
                    return {
                        id: res.data._id,
                        title: res.data.title,
                        content: res.data.content
                    };
                })
            )
            .subscribe((transformedPost) => {
                this.posts.push(transformedPost);
                this.postsUpdated.next([...this.posts]);
                this.router.navigate(["/"]);
            });
    }

    deletePost(id: string) {
        this.httpClient.delete<{ message: string }>('http://localhost:3000/api/posts/' + id)
            .subscribe((response) => {
                this.posts = this.posts.filter(post => post.id != id);
                this.postsUpdated.next([...this.posts]);
            });
    }

    getPost(id: string) {
        return this.httpClient.get<{ message: string, data: any }>('http://localhost:3000/api/posts/' + id)
            .pipe(map((res) => {
                    return {
                        id: res.data._id,
                        title: res.data.title,
                        content: res.data.content
                    };
                })
            );
    }

    updatePost(id: string, title: string, content: string) {
        const post: Post = {id: id, title: title, content: content};
        this.httpClient.put<{ message: string, data: any }>('http://localhost:3000/api/posts/' + id, post)
            .pipe(map((res) => {
                    return {
                        id: res.data._id,
                        title: res.data.title,
                        content: res.data.content
                    };
                })
            )
            .subscribe((transformedPost) => {
                const updatePosts = [...this.posts];
                const oldIndex = updatePosts.findIndex(p => p.id == post.id)
                updatePosts[oldIndex] = transformedPost;
                this.posts = updatePosts;
                this.postsUpdated.next([...this.posts]);
                this.router.navigate(["/"]);
            });
    }
}
import {Component, OnDestroy, OnInit} from '@angular/core';
import {Post} from "../post.model";
import {PostsService} from "../posts.service";
import {Subscription} from "rxjs";
import {PageEvent} from "@angular/material/paginator";
import {AuthService} from "../../auth/auth.service";

@Component({
    selector: 'app-post-list',
    templateUrl: './post-list.component.html',
    styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy{
    posts: Post[] = [];
    postsSub: Subscription;
    public isLoading = false;
    public totalPosts = 0;
    public postsPerPage = 2;
    public pageSizeOptions = [2, 5, 10];
    public currentPage = 1;
    private authListenerSub: Subscription;
    userIsAuthenticated = false;
    userId: string;
    constructor(public postsService: PostsService, private authService: AuthService) {
    }
    ngOnInit() {
        this.isLoading = true;
        this.postsService.getPosts(this.postsPerPage, this.currentPage);
        this.userId = this.authService.getUserId();
        this.postsSub = this.postsService.getPostUpdatedListener()
            .subscribe((postData: {posts: Post[], count: number}) => {
                this.isLoading = false;
                this.posts = postData.posts;
                this.totalPosts = postData.count;
            });
        this.userIsAuthenticated = this.authService.getIsAuth();
        this.authListenerSub = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
            this.userIsAuthenticated = isAuthenticated;
            this.userId = this.authService.getUserId();
        });
    }

    ngOnDestroy() {
        this.postsSub.unsubscribe();
        this.authListenerSub.unsubscribe()
    }

    onDelete(id: string) {
        this.isLoading = true;
        this.postsService.deletePost(id).subscribe(() => {
            this.postsService.getPosts(this.postsPerPage, this.currentPage);
        }, () => {
            this.isLoading = false;
        });
    }

    onChangedPage(pageData: PageEvent) {
        this.isLoading = true
        this.currentPage = pageData.pageIndex + 1;
        this.postsPerPage = pageData.pageSize;
        this.postsService.getPosts(this.postsPerPage, this.currentPage);
    }
}
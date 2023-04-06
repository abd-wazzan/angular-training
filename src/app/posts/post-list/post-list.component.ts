import {Component, OnDestroy, OnInit} from '@angular/core';
import {Post} from "../post.model";
import {PostsService} from "../posts.service";
import {Subscription} from "rxjs";
import {PageEvent} from "@angular/material/paginator";

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
    public currentPage = 1
    constructor(public postsService: PostsService) {
    }
    ngOnInit() {
        this.isLoading = true;
        this.postsService.getPosts(this.postsPerPage, this.currentPage);
        this.postsSub = this.postsService.getPostUpdatedListener()
            .subscribe((postData: {posts: Post[], count: number}) => {
                this.isLoading = false;
                this.posts = postData.posts;
                this.totalPosts = postData.count;
            });
    }

    ngOnDestroy() {
        this.postsSub.unsubscribe()
    }

    onDelete(id: string) {
        this.isLoading = true;
        this.postsService.deletePost(id).subscribe(() => {
            this.postsService.getPosts(this.postsPerPage, this.currentPage);
        });
    }

    onChangedPage(pageData: PageEvent) {
        this.isLoading = true
        this.currentPage = pageData.pageIndex + 1;
        this.postsPerPage = pageData.pageSize;
        this.postsService.getPosts(this.postsPerPage, this.currentPage);
    }
}
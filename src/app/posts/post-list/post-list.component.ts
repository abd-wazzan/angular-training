import {Component, Input} from '@angular/core';
import {Post} from "../post.model";

@Component({
    selector: 'app-post-list',
    templateUrl: './post-list.component.html',
    styleUrls: ['./post-list.component.css']
})
export class PostListComponent {
    // posts = [
    //     { title: 'First post', content: 'First content' },
    //     { title: 'Second post', content: 'Second content' }
    // ]
    @Input()  posts: Post[] = [];
}
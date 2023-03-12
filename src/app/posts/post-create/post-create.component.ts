import { Component, EventEmitter, Output } from '@angular/core';
import {Post} from "../post.model";

@Component({
    selector: 'app-post-create',
    templateUrl: './post-create.component.html',
    styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent {
    currentTitle = '';
    currentContent = '';
    @Output() postCreated = new EventEmitter<Post>();

    onAddPost() {
        const post: Post = { title: this.currentTitle, content: this.currentContent };
        this.postCreated.emit(post);
    }
}
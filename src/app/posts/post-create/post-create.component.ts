import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {PostsService} from "../posts.service";
import {ActivatedRoute, ParamMap} from "@angular/router";
import {Post} from "../post.model";

@Component({
    selector: 'app-post-create',
    templateUrl: './post-create.component.html',
    styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {

    private mode = 'create';
    private postId: string;
    public post: Post;
    public isLoading = false
    form: FormGroup;

    constructor(public postService: PostsService, public route: ActivatedRoute) {
    }

    onSavePost() {
        if (this.form.invalid) return;
        this.isLoading = true;
        if (this.mode == 'create') {
            this.postService.addPost(this.form.value.title, this.form.value.content);
        } else {
            this.postService.updatePost(this.postId, this.form.value.title, this.form.value.content);
        }
        this.form.reset();
    }

    ngOnInit(): void {
        this.form = new FormGroup({
            'title': new FormControl(null, {
                validators: [Validators.required, Validators.minLength(3)]
            }),
            'content': new FormControl(null, {
                validators: [Validators.required]
            })
        });
        this.route.paramMap.subscribe((paramMap: ParamMap) => {
            if (paramMap.has('postId')) {
                this.mode = 'edit';
                this.postId = paramMap.get('postId');
                this.isLoading = true;
                this.postService.getPost(this.postId).subscribe((transformedPosts) => {
                    this.isLoading = false;
                    this.post = transformedPosts;
                    this.form.setValue({
                        'title': this.post.title,
                        'content': this.post.content
                    });
                });
            } else {
                this.mode = 'create';
                this.postId = null;
            }
        });
    }
}
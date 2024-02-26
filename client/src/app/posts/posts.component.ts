import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api/api.service';
interface CommentModel { id: string, content: string, status: string }
interface PostModel { id: string, title: string, commentInputValue: string; comments: CommentModel[] }
@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {
  postPayload: { title: string } = { title: '' };
  posts: PostModel[] = [];
  postsUrl: string = "http://localhost:4000/posts"
  getPostsUrl: string = "http://localhost:4002/posts"
  commentsUrl: string = "http://localhost:4001/posts"
  constructor(private api: ApiService) { }

  ngOnInit(): void {
    this.getPosts();
  }

  onSubmit() {
    this.savePost();
  }

  getPosts() {
    const url = this.getPostsUrl;
    this.api.get(url).subscribe(resp => {
      console.log('safd', resp);
      this.posts = Object.values(resp);
      // this.posts.forEach(post => {
      //   post.commentsList = [];
      //   this.getCommentsForPost(post);
      // });
    });
  }

  savePost() {
    const url = this.postsUrl;
    this.api.post(url, this.postPayload).subscribe(resp => {
      if (resp) {
        this.getPosts();
      }
    });
  }

  getCommentsForPost(post: PostModel) {
    const url = `${this.commentsUrl}/${post.id}/comments`;
    this.api.get(url).subscribe(resp => {
      // const comments = resp as CommentModel[];
      // post.commentsList = [];
      // comments.forEach((comment) => {
      //   post.commentsList.push(comment);
      // });
    });
  }

  saveCommentsForPost(post: PostModel, commentPayload: any) {
    const url = `${this.commentsUrl}/${post.id}/comments`;
    this.api.post(url, commentPayload).subscribe(resp => {
      if (resp) {
        // this.getCommentsForPost(post);
        this.getPosts();
      }
    });
  }

  onSubmitComment(post: PostModel) {
    const commentPayload = { content: post.commentInputValue };
    this.saveCommentsForPost(post, commentPayload);
  }
}

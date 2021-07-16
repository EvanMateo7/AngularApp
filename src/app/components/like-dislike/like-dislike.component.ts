import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-like-dislike',
  templateUrl: './like-dislike.component.html',
  styleUrls: ['./like-dislike.component.css']
})
export class LikeDislikeComponent implements OnInit {
  @Input() likes: number;
  @Input() dislikes: number;

  constructor() { }

  ngOnInit(): void {
  }

}

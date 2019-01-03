import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-sever-error-messages',
  templateUrl: './sever-error-messages.component.html',
  styleUrls: ['./sever-error-messages.component.css']
})
export class SeverErrorMessagesComponent implements OnInit {

  @Input('server-error-messages') serverErrorMessages: string[] = null;

  constructor() { }

  ngOnInit() {
  }

}

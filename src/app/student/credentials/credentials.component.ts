import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-credentials',
  templateUrl: './credentials.component.html',
  styleUrls: ['./credentials.component.css']
})
export class CredentialsComponent implements OnInit {

  @Output() copyToClipboard = new EventEmitter<any>();
  @Input() username: string;
  @Input() password: string;

  constructor() { }

  ngOnInit() {
  }

  onCopyToClipboard(event) {
    this.copyToClipboard.emit(event);
  }

}

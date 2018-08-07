import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-access',
  templateUrl: './access.component.html',
  styleUrls: ['./access.component.css']
})
export class AccessComponent implements OnInit {

  modalRef: NgbModalRef;
  model: any;

  constructor() { }

  ngOnInit() {
  }

  close() {
    this.modalRef.close();
  }

}

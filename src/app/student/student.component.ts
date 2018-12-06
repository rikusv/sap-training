import { Component, OnInit } from '@angular/core';
import { NgModel } from '@angular/forms';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
})
export class StudentComponent implements OnInit {

  course: string;
  accessCode: string;
  data: any;
  messages: string[];
  notFound: boolean;
  private courseDeliveryDoc: AngularFirestoreDocument<any>;

  constructor(
    private afs: AngularFirestore
  ) {
    this.course = '',
    this.accessCode = '';
    this.messages = [];
  }

  ngOnInit() {
    window.addEventListener('load', function() {
      const forms = document.getElementsByClassName('needs-validation');
      const validation = Array.prototype.filter.call(forms, form => {
        form.addEventListener('submit', function(event) {
          if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
          }
          form.classList.add('was-validated');
        }, false);
      });
    }, false);
  }

  findCourseDelivery(course: NgModel, accessCode: NgModel) {
    this.data = null;
    this.notFound = false;
    if (course.invalid || accessCode.invalid) {
      return;
    } else {
      const key = `courseDeliveries/${this.course.toUpperCase()}-${this.accessCode}`;
      this.courseDeliveryDoc = this.afs.doc<any>(key);
      this.courseDeliveryDoc.valueChanges().subscribe(courseDelivery => {
        if (!courseDelivery) {
          this.notFound = true;
        } else {
          this.notFound = false;
          this.data = courseDelivery;
        }
      });
    }
  }

  copyToClipboard(event) {
    event.target.select();
    this.messages.unshift(`Copied ${event.target.name} ${event.target.value}`);
    setTimeout(() => this.messages.pop(), 2000);
    document.execCommand('copy');
  }

}

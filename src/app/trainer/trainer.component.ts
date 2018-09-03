import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AccessComponent } from './access/access.component';

@Component({
  selector: 'app-trainer',
  templateUrl: './trainer.component.html',
  styleUrls: ['./trainer.component.css']
})
export class TrainerComponent implements OnInit {

  model: any;
  notFoundModel: any;
  studentUrl: string;
  state: any;
  accessModal: NgbModalRef;

  constructor(
    private afs: AngularFirestore,
    private modalService: NgbModal
  ) {
    this.model = {
      course: '',
      email: '',
      accessCode: '',
      localUser: '',
      localPassword: '',
      trainingLandscapeUser: '',
      trainingLandscapePassword: '',
      remoteServer: '',
      remoteServerUser: 'train-##',
      remoteServerPassword: 'initial',
      customInstructions: '',
      systems: []
    };
    this.state = {};
  }

  ngOnInit() {
    this.studentUrl = location.origin;
    window.addEventListener('load', function() {
      // Fetch all the forms we want to apply custom Bootstrap validation styles to
      const forms = document.getElementsByClassName('needs-validation');
      // Loop over them and prevent submission
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

  _generateId(): string {
    function generateRange(from, to): any[] {
      const range = [];
      for (let i = from.charCodeAt(0); i <= to.charCodeAt(0); i++) {
        range.push(String.fromCharCode(i));
      }
      return range;
    }
    const characters = ['!', '@', '#', '$', '%', '&']
    .concat(
      generateRange('0', '9'),
      generateRange('A', 'Z'),
      generateRange('a', 'z')
    );
    let accessCode = '';
    for (let i = 0; i < 5; i++) {
      accessCode += characters[Math.floor(Math.random() * characters.length)];
    }
    return accessCode;
  }

  createCourseDelivery(email, course) {
    if (email.invalid || course.invalid)  {
      this.state = {
        incompleteAccessData: true
      };
    } else {
      this.model.course = this.model.course.toUpperCase();
      this.model.accessCode = this._generateId();
      const courseTemplatePath = `courseTemplates/${this.model.course}`;
      const courseDeliveryPath = `courseDeliveries/${this.model.course}-${this.model.accessCode}`;
      this.afs.firestore.doc(courseTemplatePath).get()
      .then(snapshot => {
        const courseTemplate = snapshot.data();
        if (courseTemplate) {
          this.model.systems = courseTemplate.systems || [];
          this.model.remoteServer = courseTemplate.remoteServer || '';
          this.model.customInstructions = courseTemplate.customInstructions || '';
        }
        this.afs.firestore.doc(courseDeliveryPath).set(this.model);
        this.accessModal = this.modalService.open(AccessComponent);
        const accessComponent = this.accessModal.componentInstance;
        accessComponent.model = this.model;
        accessComponent.modalRef = this.accessModal;
        this.state = {
          ready: true
        };
      })
      .catch(error => console.log(error));
    }
  }

  onSubmit() {
    this.saveCourseDelivery();
  }

  saveCourseDelivery() {
    this.model.course = this.model.course.toUpperCase();
    const courseTemplatePath = `courseTemplates/${this.model.course}`;
    const courseDeliveryPath = `courseDeliveries/${this.model.course.toUpperCase()}-${this.model.accessCode}`;
    this.afs.firestore.doc(courseDeliveryPath).get()
    .then(snapshot => {
      if (snapshot.exists) {
        if (this.model.email === snapshot.data().email) {
          this.afs.firestore.doc(courseDeliveryPath).update(this.model)
          .then(_ => {
            this.state.savedMessage = true;
            setTimeout(() => this.state.savedMessage = false, 2000);
          });
          const courseTemplate = {
            remoteServer: this.model.remoteServer,
            systems: this.model.systems,
            customInstructions: this.model.customInstructions,
            email: this.model.email
          };
          this.afs.firestore.doc(courseTemplatePath).set(courseTemplate);
        } else {
          this.state = {
            conflictingRecord: true
          };
        }
      }
    })
    .catch(error => {
      console.log(error);
    });
  }

  fetchCourseDelivery(email, course) {
    if (email.invalid || course.invalid || !this.model.accessCode)  {
      this.state = {
        incompleteAccessData: true,
        missingAccessCode: !this.model.accessCode
      };
    } else {
      this.model.course = this.model.course.toUpperCase();
      const courseDeliveryPath = `courseDeliveries/${this.model.course}-${this.model.accessCode}`;
      this.afs.firestore.doc(courseDeliveryPath).get()
      .then(snapshot => {
        if (snapshot.exists) {
          const courseDelivery = snapshot.data();
          if (this.model.email === courseDelivery.email) {
            this.model = courseDelivery;
            this.state = {
              ready: true
            };
          } else {
            this.state = {
              conflictingRecord: true
            };
          }
        } else {
          this.notFoundModel = {
            course: this.model.course,
            accessCode: this.model.accessCode
          };
          this.state = {
            noRecordFound: true
          };
        }
      })
      .catch(error => {
        console.log(error);
      });
    }
  }

  openModal(content) {
    this.modalService.open(content);
  }

  addSystem(type: string) {
    const system: any = {
      type: type,
      user: this.model.course ? `${this.model.course}-##` : '',
      password: 'welcome',
      id: this._generateId()
    };
    switch (type) {
      case 'sidClient':
      case 'hostInstance':
      system.instance = '00';
      break;
      case 'url':
      system.url = 'https://';
      break;
    }
    this.model.systems.unshift(system);
  }

  removeSystem(id: string) {
    let index = null;
    let i = 0;
    while (index === null) {
      if (this.model.systems[i].id === id) {
        index = i;
      }
      i++;
    }
    this.model.systems.splice(index, 1);
  }

}

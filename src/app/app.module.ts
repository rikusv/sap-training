import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { environment } from '../environments/environment';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { TrainerComponent } from './trainer/trainer.component';
import { StudentComponent } from './student/student.component';
import { AccessComponent } from './trainer/access/access.component';
import { MarkdownPipe } from './markdown.pipe';
import { ReplaceHashesPipe } from './replace-hashes.pipe';
import { CredentialsComponent } from './student/credentials/credentials.component';

const appRoutes: Routes = [
  { path: 'trainer', component: TrainerComponent},
  { path: '', component: StudentComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    TrainerComponent,
    StudentComponent,
    AccessComponent,
    MarkdownPipe,
    ReplaceHashesPipe,
    CredentialsComponent
  ],
  imports: [
    RouterModule.forRoot(appRoutes,  { enableTracing: true }),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    BrowserModule,
    FormsModule,
    NgbModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [AccessComponent]
})
export class AppModule { }

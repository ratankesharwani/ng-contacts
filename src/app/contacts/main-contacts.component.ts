import { Component, OnInit } from '@angular/core';
import { ContactService } from './shared/contact.service';
import { IContact } from './shared/contact.model';
import { Observable, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-main-contacts',
  templateUrl: './main-contacts.component.html',
  styleUrls: [
    './main-contacts.component.css'
  ]
})

export class ContactsMainComponent implements OnInit {
  contacts: IContact[];

  constructor(private contactService: ContactService, private toastr: ToastrService) {
  }

  ngOnInit() {
    this.getContactsFromServiceSorted();
  }

  removeContact(name: string){
    this.contactService.removeContact(name);
    const index: number = this.contacts.findIndex(c => c.name === name);
    this.contacts.splice(index, 1);
    this.toastr.success(`Contact ${name} successfully removed.`);
  }

  addContact(contact: IContact){
    this.contactService.addContact(contact).subscribe(
      c => {
        this.contacts.push(c);
        this.sortContacts();
        this.toastr.success(`Contact ${c.name} successfully saved.`);
      },
      error => this.handleHttpError(error, 'Error sending contact to the server')
    );
  }

  getContactsFromServiceSorted(){
    this.contactService.getContacts().subscribe(
      contacts => {
        this.contacts = contacts;
        this.sortContacts();
      },
      err => this.handleHttpError(err, 'Error getting contacts from the server')
    );
  }

  handleHttpError(error: any, title?: string) {
    console.error(title, error);
    this.toastr.error(error.message, title);
    return throwError(error);
  }

  sortContacts() {
    this.contacts = this.contacts.sort((c1, c2) => {
      if (c1.name < c2.name) { return - 1; }
      if (c1.name > c2.name) { return 1; }
      return 0;
    });
  }
}

import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ServerResponse } from 'src/app/data/serverresponse';
import { User } from 'src/app/data/user';
import { UserService } from 'src/app/data/user.service';
import { DeleteConfirmationComponent } from 'src/app/delete-confirmation/delete-confirmation.component';

@Component({
  selector: 'edit-user',
  templateUrl: './edit-user.component.html',
})
export class EditUserComponent implements OnInit, OnChanges {
  @Input()
  public user: User = new User();

  public alertClosed: boolean = true;
  public alertType: string = 'danger';
  public alertText: string = '';

  @Output()
  public deleted: EventEmitter<boolean> = new EventEmitter(false);

  public saving: boolean = false;

  @ViewChild('deleteconfirm') deleteConfirmModal: DeleteConfirmationComponent;
  @ViewChild('userDetails') userDetails: ElementRef;

  constructor(public userService: UserService) {}

  ngOnInit(): void {
    this.userDetailsForm.valueChanges.subscribe((_event) => {
      if (!this.userDetailsForm.dirty) {
        this.userDetails.nativeElement.animate(
          [
            { opacity: 1, easing: 'ease-out' },
            { opacity: 0.1, easing: 'ease-in' },
            { opacity: 0 },
          ],
          200
        );
      }
    });
  }

  ngOnChanges(): void {
    this.reset();
  }

  public userDetailsForm: FormGroup<{
    password: FormControl<string>;
  }> = new FormGroup({
    password: new FormControl<string>('', { nonNullable: true }),
  });

  public reset(): void {
    this.userDetailsForm.reset();
    this.alertText = '';
    this.alertClosed = true;
  }

  saveDetails() {
    this.saving = true;
    var password = this.userDetailsForm.controls.password.value;

    if (password == null) {
      password = '';
    }

    this.userService
      .saveUser(this.user.id, this.user.email, password)
      .subscribe({
        next: (_s: ServerResponse) => {
          this.alertText = 'User updated';
          this.alertType = 'success';
          this.alertClosed = false;
          this.saving = false;
          setTimeout(() => {
            this.alertClosed = true;
          }, 2000);
        },
        error: (s: ServerResponse) => {
          this.alertText = 'Error updating user: ' + s.message;
          this.alertType = 'danger';
          this.alertClosed = false;
          this.saving = false;
          setTimeout(() => {
            this.alertClosed = true;
          }, 2000);
        },
      });
  }

  delete() {
    this.deleteConfirmModal.open();
  }

  doDelete() {
    this.userService.deleteUser(this.user.id).subscribe({
      next: (_s: ServerResponse) => {
        this.deleted.next(true);
      },
      error: (s: ServerResponse) => {
        this.alertText = s.message;
        this.alertType = 'danger';
        this.alertClosed = false;
        setTimeout(() => {
          this.alertClosed = true;
        }, 2000);
      },
    });
  }

  getFormattedDate(timestamp: string) {
    if (!timestamp || timestamp == '') {
      return '';
    }
    return new Date(timestamp);
  }
}

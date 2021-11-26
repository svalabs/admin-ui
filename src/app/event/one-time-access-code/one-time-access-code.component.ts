import { Component, Input, OnInit, ViewChild,Output,EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ClrWizard } from '@clr/angular';
import { OneTimeAccessCode } from 'src/app/data/onetimeaccesscode';
import { OnetimeaccesscodeService } from 'src/app/data/onetimeaccesscode.service';
import { ScheduledEvent } from 'src/app/data/scheduledevent';

@Component({
  selector: 'app-one-time-access-code',
  templateUrl: './one-time-access-code.component.html',
  styleUrls: ['./one-time-access-code.component.scss']
})
export class OneTimeAccessCodeComponent implements OnInit {
  @Output()
  public updated: EventEmitter<boolean> = new EventEmitter(false);

  @Input()
  public event: ScheduledEvent;

  public se: ScheduledEvent = new ScheduledEvent();
  public otacs: OneTimeAccessCode[] = [];

  public otac: OneTimeAccessCode = new OneTimeAccessCode;
  public wzOpen: boolean = false;

  public checked: boolean = false;
  public saving: boolean = false;

  constructor(public otacService: OnetimeaccesscodeService) { }

  @ViewChild(ClrWizard, {static: true}) otacWz: ClrWizard;

  ngOnInit() {
    /* if (this.event) {
      this.se = this.event;
    } else {
      this.se = new ScheduledEvent();
    } */
  }

  public eventDetails: FormGroup = new FormGroup({
    'quantity': new FormControl(this.otac.quantity, [
      Validators.required,
      Validators.maxLength(2),
    ]),
    "generate_one_time_access_codes": new FormControl(false)
  });

  public selectedOTACs(o: OneTimeAccessCode[]) {
    this.otacs = [];
    o.forEach(
      (oc: OneTimeAccessCode) => 
        this.otacs.push(oc)
    )
    this.otacs = o;
  }

  public open() { 
    console.log("onetimeaccesscode open log");
    this.otacWz.open()
  }

  public save() { 
    console.log("onetimeaccesscode save log");
  }

  public retrieveList() {
    this.otacService.list(this.event.access_code)
      .subscribe( (otacList: OneTimeAccessCode[]) => {
        this.otacs = otacList;
      })
  }

  public createOtac() {
    this.otacService.create(this.eventDetails.get("quantity").value, this.event.access_code)
    .subscribe(
      (reply: string) => {
        console.log(reply);
        this.updated.next(true);
      },
      (err: any) => {
        console.log(err);
        this.updated.next(true);
      }
    )
  }

}

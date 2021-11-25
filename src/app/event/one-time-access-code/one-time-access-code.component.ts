import { Component, Input, OnInit, ViewChild } from '@angular/core';
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
  @Input()
  public event: ScheduledEvent;

  public otacs: OneTimeAccessCode[] = [];

  public otac: OneTimeAccessCode = new OneTimeAccessCode;
  public wzOpen: boolean = false;

  constructor(public otacService: OnetimeaccesscodeService) { }

  @ViewChild(ClrWizard, {static: true}) otacWz: ClrWizard;

  ngOnInit() {
    
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

  public refresh() {
    this.otacService.list()
      .subscribe( (otacList: OneTimeAccessCode[]) => {
        this.otacs = otacList;
      })
  }

}

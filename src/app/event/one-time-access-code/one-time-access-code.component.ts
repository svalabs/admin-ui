import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ClrWizard } from '@clr/angular';
import { OneTimeAccessCode } from 'src/app/data/onetimeaccesscode';
import { ScheduledEvent } from 'src/app/data/scheduledevent';
import { ScheduledeventService } from 'src/app/data/scheduledevent.service';

@Component({
  selector: 'app-one-time-access-code',
  templateUrl: './one-time-access-code.component.html',
  styleUrls: ['./one-time-access-code.component.scss']
})
export class OneTimeAccessCodeComponent implements OnInit {
  @Input()
  public ac: OneTimeAccessCode;

  public event: ScheduledEvent;
  public se: ScheduledEvent = new ScheduledEvent();
  public wzOpen: boolean = false;

  constructor(
    private _fb: FormBuilder,
    public ses: ScheduledeventService
  ) { }

  @ViewChild("wizardOTAC", {static:true}) wizard: ClrWizard;

  ngOnInit() {
    if (this.event){
      this.se = this.event;
    } else {
      this.se = new ScheduledEvent();
    }
  }

  public eventDetails: FormGroup = new FormGroup({
    "generate_one_time_access_codes": new FormControl(false)
  });

  public open() { 
    this.ac = new OneTimeAccessCode();
    this.eventDetails.reset({
      "generate_one_time_access_code": false,
    })
    this.wizard.open();
  }

  public save() {  }

}

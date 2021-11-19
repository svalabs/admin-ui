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

  @Input()
  public event: ScheduledEvent;

  public wzOpen: boolean = false;

  constructor() { }

  @ViewChild(ClrWizard, {static: true}) otacWz: ClrWizard;

  ngOnInit() {

  }

  public eventDetails: FormGroup = new FormGroup({
    "generate_one_time_access_codes": new FormControl(false)
  });

  public open() { 
    this.otacWz.open()
  }

  public save() { 
    
  }

}

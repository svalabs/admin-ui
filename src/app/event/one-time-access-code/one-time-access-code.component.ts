import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ScheduledEvent } from 'src/app/data/scheduledevent';
import { ScheduledeventService } from 'src/app/data/scheduledevent.service';

@Component({
  selector: 'app-one-time-access-code',
  templateUrl: './one-time-access-code.component.html',
  styleUrls: ['./one-time-access-code.component.scss']
})
export class OneTimeAccessCodeComponent implements OnInit {

  public se: ScheduledEvent = new ScheduledEvent();

  constructor(
    private _fb: FormBuilder,
    public ses: ScheduledeventService
  ) { }

  ngOnInit(): void {
  }

}

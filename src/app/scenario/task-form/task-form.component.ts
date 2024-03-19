import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ReturnType, Task } from 'src/app/data/vm-tasks';
import { supportedLanguages } from 'src/app/configuration/code-with-syntax-highlighting/code-with-syntax-highlighting.component';

export interface EditTask extends Task {
  id: string;
  vmName: string;
}

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss'],
})
export class TaskFormComponent implements OnInit {
  @Input() virtualMachineNames: string[];

  @Input() editTask: EditTask;

  @Output() taskChanged = new EventEmitter<EditTask>();

  supportedLanguages = supportedLanguages;

  returnTypes = Object.values(ReturnType);

  taskForm: FormGroup;

  ngOnInit() {
    this.taskForm = new FormGroup({
      taskNode: new FormControl(this.editTask.vmName, [Validators.required]),
      taskName: new FormControl(this.editTask.name, [
        Validators.required,
      ]),
      taskDescription: new FormControl(this.editTask.description, [
        Validators.required,
      ]),
      taskCommand: new FormControl(this.editTask.command, [
        Validators.required,
      ]),
      taskexpectedOutput: new FormControl(
        this.editTask.expected_output_value,
        [Validators.required]
      ),
      taskExpectedReurncode: new FormControl(
        this.editTask.expected_return_code,
        [Validators.required]
      ),
      taskReturnType: new FormControl(ReturnType[this.editTask.return_type], [
        Validators.required,
      ]),
    });
    this.taskForm.valueChanges.subscribe(() => {
      this.taskChanged.emit(this.buildEditTaskFromFormData())
      this.taskForm.updateValueAndValidity({emitEvent: false})
    });
  }

  private buildEditTaskFromFormData(): EditTask {
    const rTypeString = this.taskForm.controls.taskReturnType.value
    const rTypeKey = Object.keys(ReturnType).find(key => ReturnType[key] == rTypeString) ?? "Return_Text"
    return {
      id: this.editTask.id,
      vmName: this.taskForm.controls.taskNode.value,
      name: this.taskForm.controls.taskName.value,
      description: this.taskForm.controls.taskDescription.value,
      command: this.taskForm.controls.taskCommand.value,
      expected_output_value: this.taskForm.controls.taskexpectedOutput.value,
      expected_return_code: this.taskForm.controls.taskExpectedReurncode.value,
      return_type: rTypeKey,
    } as unknown as EditTask;
  }

  commandOutput(command) {
    this.editTask.command = command
    this.taskForm.controls.taskCommand.setValue(command);
  }
}

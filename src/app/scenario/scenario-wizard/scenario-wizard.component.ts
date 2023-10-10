import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ClrModal, ClrWizard } from '@clr/angular';
import { RbacService } from 'src/app/data/rbac.service';
import { Scenario } from 'src/app/data/scenario';
import { ScenarioService } from 'src/app/data/scenario.service';
import { ServerResponse } from 'src/app/data/serverresponse';
import { VMTemplate } from 'src/app/data/vmtemplate';
import { VmtemplateService } from 'src/app/data/vmtemplate.service';
import { KeepaliveValidator } from 'src/app/validators/keepalive.validator';
import { StepsScenarioComponent } from '../steps-scenario/steps-scenario.component';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'scenario-wizard',
  templateUrl: './scenario-wizard.component.html',
  styleUrls: ['./scenario-wizard.component.scss'],
})
export class ScenarioWizardComponent implements OnInit {
  @Input()
  wizardScenario: 'create' | 'edit';

  @Input()
  draggedScenario: Scenario;

  @Output()
  refreshFilteredScenarios: EventEmitter<string> = new EventEmitter<string>();

  @Output()
  emitMessageError: EventEmitter<string> = new EventEmitter<string>();

  public wizardTitle: string;
  public editDangerAlert: string = '';
  public editSuccessAlert: string = '';
  public scenarioDangerAlert: string = '';
  public scenarioSuccessAlert: string = '';

  public _open: boolean = false;
  public selectRbac: boolean = false;
  public scenarioTainted: boolean = false;
  public deleteVMSetOpen: boolean = false;
  public createVMOpen: boolean = false;
  public isStepsLengthNull: boolean = true;
  public editOpen: boolean = false;
  public editDangerClosed: boolean = true;
  public editSuccessClosed: boolean = true;
  public scenarioSuccessClosed: boolean = true;
  public scenarioAdded = false;
  public scenarioDangerClosed: boolean = true;
  public newCategory: boolean = false;
  public newTag: boolean = false;
  public deleteStepOpen: boolean = false;

  public deletingVMSetIndex: number = 0;
  public newvmindex: number = 0;
  public stepsToBeAdded: number = 0;
  public deletingStepIndex: number = 0;
  public editingIndex: number = 0;

  public vmtemplates: VMTemplate[] = [];

  public newScenario: Scenario = new Scenario();
  public selectedscenario: Scenario;

  get keepaliveRequired() {
    const ka = this.newScenarioDetails.get('keepalive_amount');
    const ku = this.newScenarioDetails.get('keepalive_unit');

    // validate
    if ((ka.dirty || ka.touched) && ka.invalid && ka.errors.required) {
      return true;
    } else if ((ku.dirty || ku.touched) && ku.invalid && ku.errors.required) {
      return true;
    } else {
      return false;
    }
  }

  @ViewChild('deletevmsetmodal', { static: true }) deleteVMSetModal: ClrModal;
  @ViewChild('createvmmodal', { static: true }) createVMModal: ClrModal;
  @ViewChild('stepsscenario', { static: true })
  stepScenario: StepsScenarioComponent;

  constructor(
    public scenarioService: ScenarioService,
    public vmTemplateService: VmtemplateService,
    public rbacService: RbacService
  ) {}

  @ViewChild('wizard', { static: true }) wizard: ClrWizard;

  public scenarioDetails: FormGroup;

  public newScenarioDetails: FormGroup = new FormGroup(
    {
      scenario_name: new FormControl(null, [
        Validators.required,
        Validators.minLength(4),
        Validators.pattern(/^[a-zA-Z0-9 ]+$/),
      ]),
      scenario_description: new FormControl(null, [
        Validators.required,
        Validators.minLength(4),
        Validators.pattern(/^[a-zA-Z0-9 ]+$/),
      ]),
      keepalive_amount: new FormControl(10, [Validators.required]),
      keepalive_unit: new FormControl('m', [Validators.required]),
      pause_duration: new FormControl(1, [
        Validators.required,
        Validators.min(1),
        Validators.pattern('^[0-9]+$'),
      ]),
    },
    { validators: KeepaliveValidator }
  );

  public editScenarioForm: FormGroup = new FormGroup(
    {
      scenario_name: new FormControl(null, [
        Validators.required,
        Validators.minLength(4),
      ]),
      scenario_description: new FormControl(null, [
        Validators.required,
        Validators.minLength(4),
      ]),
      keepalive_amount: new FormControl(10, [Validators.required]),
      keepalive_unit: new FormControl('m', [Validators.required]),
      pause_duration: new FormControl(1, [
        Validators.required,
        Validators.min(1),
        Validators.pattern('^[0-9]+$'),
      ]),
    },
    { validators: KeepaliveValidator }
  );

  public vmform: FormGroup = new FormGroup({
    vm_name: new FormControl(null, [
      Validators.required,
      Validators.minLength(4),
    ]),
    vm_template: new FormControl(null, [Validators.required]),
  });

  public newCategoryForm: FormGroup = new FormGroup({
    category: new FormControl(null, [Validators.required]),
  });
  public newTagForm: FormGroup = new FormGroup({
    tag: new FormControl(null, [Validators.required]),
  });
  ngOnInit() {
    if (this.wizardScenario == 'create') {
      this.scenarioDetails = this.newScenarioDetails;

      this.newScenario = new Scenario();
      this.selectedscenario = new Scenario();
      this.selectedscenario.name = '';
      this.selectedscenario.virtualmachines = [];
      this.selectedscenario.steps = [];
      this.selectedscenario.virtualmachines[0] = {};
      this.selectedscenario.categories = [];
    }

    if (this.wizardScenario == 'edit') {
      this.scenarioDetails = this.editScenarioForm;
      this.selectedscenario = this.draggedScenario;
    }

    // "Get" Permission on scenarios is required to load step content
    this.rbacService.Grants('scenarios', 'get').then((allowed: boolean) => {
      this.selectRbac = allowed;
    });

    this.rbacService
      .Grants('virtualmachinesets', 'list')
      .then((listVmSets: boolean) => {
        if (listVmSets) {
          this.vmTemplateService.list().subscribe((v: VMTemplate[]) => {
            this.vmtemplates = v;
          });
        }
      });
  }

  ngOnChanges() {
    this.wizardTitle =
      this.wizardScenario == 'create' ? 'Create new Scenario' : 'Edit Scenario';
  }
  open() {
    this.wizard.open();
  }
  doCancel(): void {
    this.wizard.reset();
    this.resetScenarioForm();

    this.isStepsLengthNull = true;
    this.scenarioTainted = false;
    this.wizard.close();
  }

  next() {
    if (this.wizardScenario == 'create') {
      this.addNewScenario();
    }
    if (this.wizardScenario == 'edit') {
      this.updateScenario();
    }
  }
  public addNewScenario() {
    this.newScenario.name = this.newScenarioDetails.get('scenario_name').value;
    this.newScenario.description = this.newScenarioDetails.get(
      'scenario_description'
    ).value;
    this.newScenario.keepalive_duration =
      this.newScenarioDetails.get('keepalive_amount').value +
      this.newScenarioDetails.get('keepalive_unit').value;
    this.newScenario.pause_duration =
      this.newScenarioDetails.get('pause_duration').value + 'h';
    if (this.newScenario.steps == null) this.newScenario.steps = [];
    if (this.newScenario.virtualmachines == null)
      this.newScenario.virtualmachines = [];
    if (this.newScenario.categories == null) this.newScenario.categories = [];
    if (this.newScenario.tags == null) this.newScenario.tags = [];
    this.selectedscenario = this.newScenario;
  }

  finishScenario() {
    if (this.wizardScenario == 'create') this.saveCreatedScenario();
    if (this.wizardScenario == 'edit') this.saveUpdatedScenario();
    this.refreshFilteredScenario();
  }
  saveCreatedScenario() {
    this.scenarioService.create(this.selectedscenario).subscribe(
      (s: Scenario) => {
        this._displayAlert(s.name, true);
        this.scenarioAdded = true;
      },
      (e: HttpErrorResponse) => {
        const errorMessage: string = e.message;
        this.emitMessageError.emit(errorMessage);
      }
    );
    this.resetScenarioForm();
  }
  updateScenario() {
    this.selectedscenario.keepalive_duration =
      this.editScenarioForm.get('keepalive_amount').value +
      this.editScenarioForm.get('keepalive_unit').value;
    this.selectedscenario.pause_duration =
      this.editScenarioForm.get('pause_duration').value + 'h';
    this.selectedscenario.name =
      this.editScenarioForm.get('scenario_name').value;
    this.selectedscenario.description = this.editScenarioForm.get(
      'scenario_description'
    ).value;
  }
  saveUpdatedScenario() {
    this.scenarioService
      .update(this.selectedscenario)
      .subscribe((s: ServerResponse) => {
        if (s.type == 'updated') {
          this.scenarioSuccessAlert = 'Scenario updated';
          this.scenarioSuccessClosed = false;
          setTimeout(() => {
            this.scenarioSuccessClosed = true;
            this.scenarioTainted = false;
          }, 1000);
        } else {
          this.scenarioDangerAlert = 'Unable to update scenario: ' + s.message;
          this.scenarioDangerClosed = false;
          setTimeout(() => {
            this.scenarioDangerClosed = true;
          }, 1000);
        }
      });
  }
  resetScenarioForm() {
    this.wizard.reset();
    this.newScenarioDetails.reset({
      keepalive_amount: 10,
      keepalive_unit: 'm',
      pause_duration: 1,
    });
    this.selectedscenario.virtualmachines = [];
    this.selectedscenario.steps = [];
    this.selectedscenario.categories = [];
    this.selectedscenario.tags = [];
  }
  addCategory() {
    let categories = this.newCategoryForm.get('category').value;
    categories = categories.split(',');
    categories.forEach((category) => {
      category = category.replace(/\s/g, ''); //remove all whitespaces
      if (
        category != '' &&
        !this.selectedscenario.categories.includes(category)
      ) {
        this.selectedscenario.categories.push(category);
      }
    });
    this.newCategoryForm.reset();
    this.newCategory = false;
  }
  deleteCategory(category: string) {
    this.selectedscenario.categories.forEach((element, index) => {
      if (element == category)
        this.selectedscenario.categories.splice(index, 1);
    });
  }
  addTag() {
    let tags = this.newTagForm.get('tag').value;
    tags = tags.split(',');
    tags.forEach((tag) => {
      tag = tag.replace(/\s/g, ''); //remove all whitespaces
      if (tag != '' && !this.selectedscenario.tags.includes(tag)) {
        this.selectedscenario.tags.push(tag);
      }
    });
    this.newTagForm.reset();
    this.newTag = false;
  }
  deleteTag(tag: string) {
    this.selectedscenario.tags.forEach((element, index) => {
      if (element == tag) this.selectedscenario.tags.splice(index, 1);
    });
  }
  private _displayAlert(alert: string, success: boolean, duration?: number) {
    if (success) {
      this.scenarioSuccessAlert = alert;
      this.scenarioSuccessClosed = false;
      setTimeout(() => {
        this.scenarioSuccessClosed = true;
      }, duration || 1000);
    } else {
      this.scenarioDangerAlert = alert;
      this.scenarioDangerClosed = false;
      setTimeout(() => {
        this.scenarioDangerClosed = true;
      }, duration || 1000);
    }
  }
  scenarioHasVM(scenario: Scenario): boolean {
    if (this.selectedscenario.virtualmachines.length != 0) {
      const validVMSet = this.selectedscenario.virtualmachines.filter(
        (virtualmachine, i) => {
          if (Object.keys(virtualmachine).length != 0) {
            return true;
          }
          return false;
        }
      );
      if (validVMSet.length == this.selectedscenario.virtualmachines.length) {
        return true;
      }
    }
    return false;
  }
  addVMSet() {
    this.scenarioTainted = true;
    this.selectedscenario.virtualmachines.push({});
  }
  addVM() {
    this.scenarioHasVM(this.selectedscenario);
    this.scenarioTainted = true;
    this.selectedscenario.virtualmachines[this.newvmindex][
      this.vmform.get('vm_name').value
    ] = this.vmform.get('vm_template').value;
    this.createVMModal.close();
  }

  deleteVMSet(i: number) {
    this.scenarioTainted = true;
    this.deletingVMSetIndex = i;
    this.deleteVMSetModal.open();
  }

  public deleteVM(setIndex: number, key: string) {
    this.scenarioTainted = true;
    delete this.selectedscenario.virtualmachines[setIndex][key];
  }
  doDeleteVMSet() {
    this.selectedscenario.virtualmachines.splice(this.deletingVMSetIndex, 1);
    this.deleteVMSetModal.close();
  }
  public openCreateVM(i: number) {
    this.vmform.reset();
    this.newvmindex = i;
    this.createVMModal.open();
  }

  refreshFilteredScenario() {
    this.refreshFilteredScenarios.emit(this.wizardScenario);
  }

  editScenarioWizardfunction(scenario: Scenario) {
    this.wizard.navService.goTo(this.wizard.pages.last, true);
    this.wizard.pages.first.makeCurrent();
    this.editScenario(scenario);
    this.scenarioService
      .get(scenario.id)
      .subscribe((scenario) => (this.selectedscenario = scenario));
    this.wizard.open();
  }

  editScenario(s: Scenario) {
    if (s != undefined) {
      // this is only a partial scenario, we need to get the full
      this.scenarioService.get(s.id).subscribe((s: Scenario) => {
        this.selectedscenario = s;
        this.editScenarioForm.reset({
          scenario_name: s.name,
          scenario_description: s.description,
          keepalive_amount: s.keepalive_duration.substring(
            0,
            s.keepalive_duration.length - 1
          ),
          keepalive_unit: s.keepalive_duration.substring(
            s.keepalive_duration.length - 1,
            s.keepalive_duration.length
          ),
          pause_duration: s.pause_duration.substring(
            0,
            s.pause_duration.length - 1
          ),
        });
      });
    }
  }
}

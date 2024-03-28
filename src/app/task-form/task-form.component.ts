import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TasksService } from '../services/tasks.service';
import { Task } from '../interfaces/task';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss']
})
export class TaskFormComponent implements OnInit {
  constructor(private _TasksService: TasksService,
    private formBuilder: FormBuilder,
    private _ActivatedRoute: ActivatedRoute,
    private _Router: Router) { }

  allTasksLength!: string;
  taskForm!: FormGroup;
  dynamicControls: { label: string, controlName: string }[] = [];
  situation!: string;
  updateID!: string;



  ngOnInit(): void {
    // validate via query param whether to add new task or update exisitng task
    this._ActivatedRoute.params.subscribe((route) => {
      this.situation = route['id'];
    })

    this.getLastId();
    this.initForm();
    this.setComponentBehaviour();
  }

  // get last task id
  getLastId() {
    this._TasksService.getAllTasksReq().subscribe({
      next: (res) => {
        this.allTasksLength = res.length;
      }
    })
  }

  // determine whether the component wil behave as add or update
  setComponentBehaviour() {
    if (this.situation != 'new') {
      this._TasksService.getTaskByIdReq(this.situation).subscribe({
        next: (res) => {
          this.fillForm(res)
        }
      })
    }
  }

  // fill form with object to update data
  fillForm(res: Task) {
    this.updateID = res.id.toString();
    this.taskForm.patchValue({
      title: res.title,
      description: res.description,
      priority: res.priority,
      completed: res.status,
      startTime: res.startTime,
      endTime: res.endTime,
      numbered: res.numbered,
    });
    res.items.forEach((item, index) => {
      const newControl = this.formBuilder.control(index, this.formBuilder.control(null))
      newControl.setValue(item)
      this.Items().push(newControl);
    })
  }

  // initialize form
  initForm() {
    this.taskForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      priority: ['', Validators.pattern(/^\d+$/)],
      completed: [false],
      startTime: [''],
      endTime: [''],
      numbered: [false],
      items: this.formBuilder.array([])
    });
  }

  Items(): FormArray {
    return this.taskForm.get('items') as FormArray;
  }

  // add item field to DOM dynamically
  addItem(): void {
    const newControlName = this.dynamicControls.length + 1;
    const newControl = this.formBuilder.control(newControlName, this.formBuilder.control(null))
    newControl.setValue(null);
    this.Items().push(newControl);
  }

  // collect items into an array to maintain api requirement
  getDynamicFormData(): any {
    const dynamicFormData: string[] = [];
    this.dynamicControls.forEach(dynamicControl => {
      const controlValue: string = this.taskForm.get(dynamicControl.controlName)?.value;
      dynamicFormData.push(controlValue);
    });
    return dynamicFormData;
  }

  // validate add or update form then submit
  submitForm(): void {
    const formData: Task = {
      id: this.situation == 'new' ? Number(this.allTasksLength + 1) : Number(this.updateID),
      title: this.taskForm.get('title')?.value,
      description: this.taskForm.get('description')?.value,
      priority: parseInt(this.taskForm.get('priority')?.value),
      status: this.taskForm.get('completed')?.value,
      startTime: this.taskForm.get('startTime')?.value,
      endTime: this.taskForm.get('endTime')?.value,
      numbered: this.taskForm.get('numbered')?.value,
      items: this.Items().value
    };

    if (this.situation == 'new') {
      this._TasksService.addNewTaskReq(formData).subscribe({
        next: (res) => {
          console.log(this.taskForm.value);
          this._Router.navigate(['home'])
        }
      });
    } else {
      this._TasksService.updateTaskReq(this.updateID, formData).subscribe({
        next: (res) => {
          console.log(this.taskForm.value);
          this._Router.navigate(['home'])
        }
      });
    }
  }
}
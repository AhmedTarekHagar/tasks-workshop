import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
    // validate cia query param whether to add new task or update exisitng task
    this._ActivatedRoute.params.subscribe((route) => {
      this.situation = route['id'];
    })

    this._TasksService.getAllTasksReq().subscribe({
      next: (res) => {
        this.allTasksLength = res.length;
      }
    })

    if (this.situation == 'new') {
      this.taskForm = this.formBuilder.group({
        title: ['', Validators.required],
        description: ['', Validators.required],
        priority: ['', Validators.pattern(/^\d+$/)],
        completed: [false],
        startTime: [''],
        endTime: [''],
        numbered: [false],
        items: []
      });
    } else {
      this._TasksService.getTaskByIdReq(this.situation).subscribe({
        next: (res) => {
          this.updateID = res.id;
          this.taskForm = this.formBuilder.group({
            title: [res.title, Validators.required],
            description: [res.description, Validators.required],
            priority: [res.priority, Validators.pattern(/^\d+$/)],
            completed: [res.status],
            startTime: [res.startTime],
            endTime: [res.endTime],
            numbered: [res.numbered],
            items: [res.items]
          });
        }
      })
    }
  }

  addItem(): void {
    const newControlName = `dynamicControl${this.dynamicControls.length}`;
    this.taskForm.addControl(newControlName, this.formBuilder.control(''));
    this.dynamicControls.push({ label: `Item ${this.dynamicControls.length + 1}`, controlName: newControlName });
  }

  getDynamicFormData(): any {
    const dynamicFormData: string[] = [];
    this.dynamicControls.forEach(dynamicControl => {
      const controlValue: string = this.taskForm.get(dynamicControl.controlName)?.value;
      dynamicFormData.push(controlValue);
    });
    return dynamicFormData;
  }

  submitForm(): void {
    const formData: Task = {
      id: this.situation == 'new' ? Number(this.allTasksLength + 1) : Number(this.updateID),
      title: this.taskForm.get('title')?.value,
      description: this.taskForm.get('description')?.value,
      priority: parseInt(this.taskForm.get('priority')?.value),
      status: this.taskForm.get('completed')?.value ? 'completed' : 'pending',
      startTime: this.taskForm.get('startTime')?.value,
      endTime: this.taskForm.get('endTime')?.value,
      numbered: this.taskForm.get('numbered')?.value,
      items: this.getDynamicFormData()
    };

    if (this.situation == 'new') {
      this._TasksService.addNewTaskReq(formData).subscribe({
        next: (res) => {
          this._Router.navigate(['home'])
        }
      });
    } else {
      this._TasksService.updateTaskReq(this.updateID, formData).subscribe({
        next: (res) => {
          this._Router.navigate(['home'])
        }
      });
    }
  }
}
import { Component, OnInit } from '@angular/core';
import { TasksService } from '../services/tasks.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Task } from '../interfaces/task';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.scss']
})
export class TaskDetailsComponent implements OnInit {

  constructor(private _TasksService: TasksService,
    private _ActivatedRoute: ActivatedRoute,
    private _Router: Router,
    private _Title: Title) { }

  ngOnInit(): void {

    this._ActivatedRoute.params.subscribe((route) => {
      this.taskID = route['id']
    })

    this._TasksService.getTaskByIdReq(this.taskID).subscribe({
      next: (res) => {
        this._Title.setTitle(res.title);
        this.taskDetails = res;
        this.isLoaded = true;
      }
    })
  }

  isLoaded: boolean = false;
  taskID!: string;
  taskDetails!: Task;

  deleteTask(taskID: string | number) {
    this._TasksService.deleteTaskReq(taskID).subscribe({
      next: (res) => {
        this._Router.navigate(['home'])
      }
    })
  }

  updateTask(taskID: string | number) {
    this._Router.navigate(['task-form', taskID])
  }

  // this functions gets task by id and then adds it to tasks list
  dublicateTask(taskID: string | number) {
    this._TasksService.getTaskByIdReq(taskID).subscribe({
      next: (res) => {
        this._TasksService.addNewTaskReq(res).subscribe({
          next: (res) => {
            this._Router.navigate(['home'])
          }
        })
      }
    })
  }
}

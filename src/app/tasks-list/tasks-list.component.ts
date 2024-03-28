import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TasksService } from '../services/tasks.service';
import { Task } from '../interfaces/task';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';



@Component({
  selector: 'app-tasks-list',
  templateUrl: './tasks-list.component.html',
  styleUrls: ['./tasks-list.component.scss']
})
export class TasksListComponent implements OnInit {

  constructor(private _TasksService: TasksService,
    private _Title: Title,
    private _Router: Router) { }

  ngOnInit(): void {
    this.getAllTasks();
    this._Title.setTitle('All tasks');
  }

  getAllTasks() {
    this._TasksService.getAllTasksReq().subscribe({
      next: (res) => {
        this.tasksList = res;
        this.isLoaded = true;
      }
    })
  }

  tasksList!: Task[];
  isLoaded: boolean = false;

  listTrackBy(index: number, item: any): number {
    return item.id; // Return a unique identifier for each item
  }

  deleteTask(taskID: number | string, event: MouseEvent) {
    // to prevent opening task details on click
    event.stopPropagation();
    this._TasksService.deleteTaskReq(taskID).subscribe({
      next: (res) => {
        this.isLoaded = false;
        this.getAllTasks();
        this.isLoaded = true;
      }
    })
  }

  updateTask(taskID: string | number) {
    this._Router.navigate(['task-form', taskID])
  }

  // this functions gets task by id and then adds it to tasks list
  dublicateTask(taskID: number | string, event: MouseEvent) {
    // to prevent opening task details on click
    event.stopPropagation();
    this._TasksService.getTaskByIdReq(taskID).subscribe({
      next: (res) => {
        this._TasksService.addNewTaskReq(res).subscribe({
          next: (res) => {
            this.isLoaded = false;
            this.getAllTasks();
            this.isLoaded = true;
          }
        })
      }
    })
  }
}

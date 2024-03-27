import { Component, OnDestroy, OnInit } from '@angular/core';
import { TasksService } from '../services/tasks.service';
import { Task } from '../interfaces/task';
import { Title } from '@angular/platform-browser';


@Component({
  selector: 'app-tasks-list',
  templateUrl: './tasks-list.component.html',
  styleUrls: ['./tasks-list.component.scss']
})
export class TasksListComponent implements OnInit {

  constructor(private _TasksService: TasksService, private _Title: Title) { }

  ngOnInit(): void {
    this._TasksService.getAllTasks().subscribe({
      next: (res) => {
        this.tasksList = res;
        this.isLoaded = true;
      }
    })
    this._Title.setTitle('All tasks');
  }

  tasksList!: Task[];
  isLoaded: boolean = false;
}

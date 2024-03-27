import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Task } from '../interfaces/task';

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  constructor(private _HttpClient: HttpClient) { }

  baseURL: string = 'https://66034d142393662c31ced830.mockapi.io/tasks/api/v1/tasks/';
  pendingTasksCount: BehaviorSubject<number> = new BehaviorSubject(0);

  getAllTasks(): Observable<any> {
    return this._HttpClient.get(`${this.baseURL}`)
  }

  getTaskById(taskID: number): Observable<any> {
    return this._HttpClient.get(`${this.baseURL}${taskID}`)
  }

  addNewTask(newTask: Task): Observable<any> {
    return this._HttpClient.post(`${this.baseURL}`, newTask)
  }

  updateTask(taskID: number, updatedTask: Task): Observable<any> {
    return this._HttpClient.put(`${this.baseURL}${taskID}`, updatedTask)
  }

  deleteTask(taskId: number): Observable<any> {
    return this._HttpClient.delete(`${this.baseURL}${taskId}`)
  }
}

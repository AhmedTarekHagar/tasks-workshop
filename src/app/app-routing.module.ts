import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TasksListComponent } from './tasks-list/tasks-list.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { TaskDetailsComponent } from './task-details/task-details.component';

const routes: Routes = [
  {path: "", component:TasksListComponent},
  {path: "taskdetails/:id", component: TaskDetailsComponent},

  {path: "**", component:NotFoundComponent, title: "Page Not Found"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: "enabled" })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TasksListComponent } from './tasks-list/tasks-list.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { TaskDetailsComponent } from './task-details/task-details.component';
import { TaskFormComponent } from './task-form/task-form.component';

const routes: Routes = [
  { path: "", redirectTo: "home", pathMatch: "full" },
  { path: "home", component: TasksListComponent, title: "All Tasks" },
  { path: "taskdetails/:id", component: TaskDetailsComponent },
  { path: "task-form/:id", component: TaskFormComponent },

  { path: "**", component: NotFoundComponent, title: "Page Not Found" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: "enabled" })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

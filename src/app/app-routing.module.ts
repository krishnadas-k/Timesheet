import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {EmployeeListComponent} from './employee/employee.component'
import {TimesheetComponent} from './timesheet/timesheet.component'

const routes: Routes = [
  { path: '', redirectTo: '/employeelist', pathMatch: 'full' },
  { path: 'employeelist', component: EmployeeListComponent },
  { path: 'timesheet/:id', component: TimesheetComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
import { Component, OnInit, Input } from '@angular/core';
import {EmployeeListComponent} from '../employee/employee.component'
import { EmployeeService } from '../services/employee.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import {TimeSheet, EffortLog, Task} from '../time-sheet'

@Component({
  selector: 'app-timesheet',
  templateUrl: './timesheet.component.html',
  styleUrls: ['./timesheet.component.scss']
})

export class TimesheetComponent implements OnInit {

  timeSheet: Array<TimeSheet>;
  employees: any;
  allTasks: Array<Task>;
  notAddedTasks: Array<Task>;
  selectedTaskId: number = -1;
  selectedEmployeeId: number;
  currentTaskNames: Array<string>;
  selectedEmployee: any;
  weekStartDate: Date;
 
  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private employeeService: EmployeeService
    ) { }

  ngOnInit() {

    this.weekStartDate = this.getWeekStartDate();

      this.employeeService.getallemployees().subscribe(data => {
        this.employees = data;
        this.selectedEmployee = this.employees.filter(e => e.id == this.selectedEmployeeId)[0];
    });

    this.employeeService.getallTasks().subscribe(data =>{
      this.allTasks = <Array<Task>>data;
      this.notAddedTasks = <Array<Task>>data;
    });

    const id = +this.route.snapshot.paramMap.get('id');
    this.selectedEmployeeId = id;
    this.intTimeSheet();    
  }

   intTimeSheet(): void{

    this.timeSheet = [];
    var weekEnd = new Date(this.weekStartDate);
    weekEnd.setDate(this.weekStartDate.getDate() + 7);
    var timeSheetReq = {employeeId : this.selectedEmployeeId, StartTime: this.weekStartDate, EndTime: weekEnd};
     this.employeeService.getTimeSheet(timeSheetReq, (data) => {
                
      if (this.selectedEmployee){
        this.selectedEmployee = this.employees.filter(e => e.id == this.selectedEmployeeId)[0];
      }

      this.timeSheet = <Array<TimeSheet>>data;
      this.intTaskNames();
    });
  }

  getWeekStartDate(): Date{
    var dt = new Date();
    dt.setHours(0,0,0,0);
    dt.setDate(dt.getDate() - dt.getDay());
    return dt;
  }

  changeTimesheet(empId): void{
    this.selectedEmployeeId = empId;
    this.intTimeSheet(); 
  }

  onTaskSelectionChange(selTask): void{
    this.selectedTaskId = selTask;
  }

  onAddTaskWindowOpen(): void {
    if (this.selectedTaskId == -1) {
      alert("Please Select a task");
    } else {

      const taskExists = this.timeSheet.some(d => d.effortLogs.some(e => e.taskId == this.selectedTaskId));
      if (taskExists)
      {
        alert("Task already added");
        return;
      }

      const selTask = this.allTasks.filter(u => u.id == this.selectedTaskId)[0];

      this.timeSheet.forEach(i => {
          let newEffort = new EffortLog();
          newEffort.taskId = selTask.id;
          newEffort.taskName = selTask.name;
          newEffort.effortInHrs = 0;
          i.effortLogs.push(newEffort);
      });

      this.currentTaskNames.push(selTask.name);
    }
  }

  intTaskNames(): void{

    let taskNames : Array<string> = [];
    if (this.timeSheet){
    this.timeSheet.forEach(i => i.effortLogs.forEach(j => taskNames.push(j.taskName)));
    
    taskNames = Array.from(new Set(taskNames))
    }

    this.currentTaskNames = taskNames.sort();    
  }

  findTotalEffort(effortList: Array<EffortLog> , taskName : string) : number{

    if (effortList.length > 0)
      return effortList.reduce((ty, u) => ty + u.effortInHrs, 0);
  
    return 0;
  }

  findEffortLog(effortList: Array<EffortLog> , taskName : string) : EffortLog{

    return effortList.filter(i => i.taskName == taskName)[0];
  }

  save(): void{
    let dto = { employeeId: this.selectedEmployeeId, timeSheets: this.timeSheet };
    this.employeeService.saveTimesheet(dto, (result) => {
      if (result.success) {
        alert("Saved Successfully");
      } else {
        alert("Save Failed, Please try again");
      }
    });
  }

  goBack(): void {
    this.location.back();
  }

}

import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

@Injectable()
export class EmployeeService {
    private baseapi = environment.apiUrl;
    constructor(private http: HttpClient) { }

    getallemployees() {
        return this.http.get(this.baseapi + "/employee/getall");
    }


    getTimeSheet (timesheetReq: any, callback ) {
        return this.http.post(this.baseapi + "/timesheet/gettimesheet", timesheetReq, httpOptions).subscribe((result) => {
            callback(result);
        });;
      }

    getallTasks() {
        return this.http.get(this.baseapi + "/employee/getalltasks");
    }

     saveTimesheet (timesheetDto: any, callback) {
        return this.http.post(this.baseapi + "/timesheet/save", timesheetDto, httpOptions).subscribe((result) => {
            // This code will be executed when the HTTP call returns successfully 
            callback(result);
        });;
      }
}
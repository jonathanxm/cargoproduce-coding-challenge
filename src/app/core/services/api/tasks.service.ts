import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Task } from '../../models/task.model';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  
  private apiUrl: string = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  getTasks(): Observable<Task[]>{
    return this.httpClient.get<Task[]>(this.apiUrl);
  }

  addTask(task: Task): Observable<Task>{
    return this.httpClient.post<Task>(this.apiUrl, task, httpOptions)
  }

  updateTask(task: Task): Observable<Task>{
    return this.httpClient.put<Task>(this.apiUrl + `/${task.id}`, task, httpOptions);
  }

  deleteTask(task: Task): Observable<Task>{
    return this.httpClient.delete<Task>(this.apiUrl + `/${task.id}`);
  }

}

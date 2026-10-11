import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GroupPhaseService {
  private apiUrl = 'http://localhost:3000/group-phase'; 

  constructor(private http: HttpClient) {}

  getGroupData(groupId?: string): Observable<any> {
    const url = groupId ? `${this.apiUrl}?groupId=${groupId}` : this.apiUrl;
    return this.http.get<any>(url);
  }
}

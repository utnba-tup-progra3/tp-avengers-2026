import { Component, OnInit } from '@angular/core';
import { GroupPhaseService } from './group-phase.service';

@Component({
  selector: 'app-group-phase',
  templateUrl: './group-phase.component.html',
  styleUrls: ['./group-phase.component.css']
})
export class GroupPhaseComponent implements OnInit {
  data: any = null;
  activeGroupId: string = '';
  loading: boolean = false;
  error: string | null = null;

  constructor(private groupPhaseService: GroupPhaseService) {}

  ngOnInit(): void {
    this.loadGroupData();
  }

  loadGroupData(groupId?: string): void {
    this.loading = true;
    this.error = null;
    this.groupPhaseService.getGroupData(groupId).subscribe({
      next: (res) => {
        this.data = res;
        this.activeGroupId = groupId || res.playerGroupId;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error de conexión con Avengers Back.';
        this.loading = false;
        console.error(err);
      }
    });
  }

  onGroupChange(groupId: string): void {
    this.loadGroupData(groupId);
  }
}

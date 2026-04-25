import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { ButtonModule } from 'primeng/button';
import { IUser } from '../../models/IUser.interface';

interface ActionParams extends ICellRendererParams<IUser> {
  onEdit: (user: IUser) => void;
  onDelete: (user: IUser) => void;
}

@Component({
  standalone: true,
  imports: [ButtonModule],
  template: `
    <div style="display:flex;gap:4px;align-items:center;height:100%">
      <p-button
        icon="pi pi-pencil"
        severity="info"
        [rounded]="true"
        [text]="true"
        (onClick)="onEdit()"
      />
      <p-button
        icon="pi pi-trash"
        severity="danger"
        [rounded]="true"
        [text]="true"
        (onClick)="onDelete()"
      />
    </div>
  `,
})
export class ActionCellComponent implements ICellRendererAngularComp {
  private params!: ActionParams;

  agInit(params: ActionParams): void {
    this.params = params;
  }

  refresh(): boolean {
    return false;
  }

  onEdit(): void {
    this.params.onEdit(this.params.data!);
  }

  onDelete(): void {
    this.params.onDelete(this.params.data!);
  }
}

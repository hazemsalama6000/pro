import { Component, computed, inject, OnInit, signal } from '@angular/core';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { form, FormField, submit } from '@angular/forms/signals';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridOptions, themeQuartz } from 'ag-grid-community';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import {
  employeeSchema,
  IEmployeeForm,
  initialEmployeeForm,
} from '../models/employee-form.model';
import { IUser } from '../models/IUser.interface';
import { UsersService } from '../services/users.service';
import { ActionCellComponent } from './action-cell/action-cell.component';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.scss',
  standalone: true,
  providers: [UsersService],
  imports: [AgGridAngular, DialogModule, ButtonModule, InputTextModule, FormField],
})
export class EmployeesComponent implements OnInit {
  private usersService = inject(UsersService);

  users = signal<IUser[]>([]);
  dialogVisible = signal(false);
  isEditing = signal(false);
  private editingId = signal<number | null>(null);

  theme = themeQuartz;

  employeeModel = signal<IEmployeeForm>({ ...initialEmployeeForm });
  employeeForm = form(this.employeeModel, employeeSchema);

  formInvalid = computed(() =>
    !!this.employeeForm.name().errors()?.length ||
    !!this.employeeForm.username().errors()?.length ||
    !!this.employeeForm.email().errors()?.length
  );

  colDefs: ColDef<IUser>[] = [
    { field: 'name',     headerName: 'Name',     flex: 1,   filter: true },
    { field: 'username', headerName: 'Username', flex: 1,   filter: true },
    { field: 'email',    headerName: 'Email',    flex: 1.5, filter: true },
    { field: 'phone',    headerName: 'Phone',    flex: 1 },
    { field: 'company',  headerName: 'Company',  flex: 1,   filter: true },
    { field: 'country',  headerName: 'Country',  flex: 1,   filter: true },
    {
      headerName: 'Actions',
      flex: 0.8,
      sortable: false,
      filter: false,
      cellRenderer: ActionCellComponent,
      cellRendererParams: {
        onEdit:   (user: IUser) => this.openEditDialog(user),
        onDelete: (user: IUser) => this.confirmDelete(user),
      },
    },
  ];

  gridOptions: GridOptions<IUser> = {
    pagination: true,
    paginationPageSize: 10,
    paginationPageSizeSelector: [10, 20, 50],
    defaultColDef: { sortable: true, resizable: true },
  };

  ngOnInit(): void {
    this.usersService.getUsers().subscribe({
      next:  (users) => this.users.set(users),
      error: (err)   => console.error('Failed to load users:', err),
    });
  }

  openCreateDialog(): void {
    this.isEditing.set(false);
    this.editingId.set(null);
    this.employeeModel.set({ ...initialEmployeeForm });
    this.dialogVisible.set(true);
  }

  openEditDialog(user: IUser): void {
    this.isEditing.set(true);
    this.editingId.set(user.id);
    this.employeeModel.set({
      name:     user.name,
      username: user.username,
      email:    user.email,
      phone:    user.phone    ?? '',
      company:  user.company  ?? '',
      country:  user.country  ?? '',
    });
    this.dialogVisible.set(true);
  }

  saveUser(): void {
    submit(this.employeeForm, async (_field, _detail) => {
      const value = this.employeeModel();

      if (this.isEditing()) {
        const id = this.editingId()!;
        this.users.update(list => list.map(u => u.id === id ? { ...u, ...value } : u));
        this.dialogVisible.set(false);
        this.usersService.updateUser(id, value).subscribe({
          error: (err) => console.error('Update failed:', err),
        });
      } else {
        const newUser: IUser = { id: Date.now(), ...value } as IUser;
        this.users.update(list => [...list, newUser]);
        this.dialogVisible.set(false);
        this.usersService.createUser(value as unknown as Omit<IUser, 'id'>).subscribe({
          error: (err) => console.error('Create failed:', err),
        });
      }
    });
  }

  exportToExcel(): void {
    const rows = this.users().map(({ id, name, username, email, phone, company, country }) => ({
      'ID':                    id,
      'Name [Required]':       name,
      'Username [Required]':   username,
      'Email [Required]':      email,
      'Phone [Optional]':      phone,
      'Company [Optional]':    company,
      'Country [Optional]':    country,
    }));
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook  = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Employees');
    const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'employees.xlsx');
  }

  confirmDelete(user: IUser): void {
    Swal.fire({
      title: 'Delete Employee?',
      text: `"${user.name}" will be permanently removed.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (!result.isConfirmed) return;
      this.users.update(list => list.filter(u => u.id !== user.id));
      this.usersService.deleteUser(user.id).subscribe({
        error: (err) => console.error('Delete failed:', err),
      });
      Swal.fire({
        title: 'Deleted!',
        text: `${user.name} has been removed.`,
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
      });
    });
  }
}

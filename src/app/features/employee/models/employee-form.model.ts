import { required, schema, validate } from '@angular/forms/signals';

export interface IEmployeeForm {
  name: string;
  username: string;
  email: string;
  phone: string;
  company: string;
  country: string;
}

export const initialEmployeeForm: IEmployeeForm = {
  name: '',
  username: '',
  email: '',
  phone: '',
  company: '',
  country: '',
};

export const employeeSchema = schema<IEmployeeForm>((root) => {
  required(root.name,     { message: 'Name is required' });
  required(root.username, { message: 'Username is required' });
  required(root.email,    { message: 'Email is required' });
  validate(root.email, (ctx) => {
    if (!ctx.value()) return null;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ctx.value())
      ? null
      : { kind: 'email', message: 'Invalid email address' };
  });
});

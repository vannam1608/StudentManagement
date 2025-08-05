import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule,   Validators } from '@angular/forms';
import { ActivatedRoute,    Router} from '@angular/router';
import { UserService } from '../../../shared/services/user.service'; 
import { CreateUserDto, UpdateUserDto,UserDto } from '../../../shared/models/user.model';
import {  RouterModule } from '@angular/router';


@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './user-form.component.html',
})
export class UserFormComponent implements OnInit {
  userForm!: FormGroup;
  userId?: number;
  isEdit = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.userId = Number(this.route.snapshot.paramMap.get('id'));
    this.isEdit = !isNaN(this.userId) && this.userId > 0;

    this.initForm();

    if (this.isEdit) {
      this.userService.getById(this.userId!).subscribe((user: UserDto) => {
        this.userForm.patchValue(user);
      });
    }
  }

  initForm() {
    this.userForm = this.fb.group({
      username: [{ value: '', disabled: this.isEdit }, Validators.required],
      password: [this.isEdit ? '' : '', this.isEdit ? [] : [Validators.required, Validators.minLength(6)]],
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      role: [this.isEdit ? '' : 'Admin', Validators.required]
    });
  }

  onSubmit() {
    if (this.userForm.invalid) return;

    const formValue = this.userForm.getRawValue();

    if (this.isEdit) {
      const updateDto: UpdateUserDto = {
        fullName: formValue.fullName,
        email: formValue.email,
        phone: formValue.phone
      };
      this.userService.update(this.userId!, updateDto).subscribe(() => {
        this.router.navigate(['/admin/users']);
      });
    } else {
      const createDto: CreateUserDto = {
        username: formValue.username,
        password: formValue.password,
        fullName: formValue.fullName,
        email: formValue.email,
        phone: formValue.phone,
        role: formValue.role
      };
      this.userService.create(createDto).subscribe(() => {
        this.router.navigate(['/admin/users']);
      });
    }
  }
}

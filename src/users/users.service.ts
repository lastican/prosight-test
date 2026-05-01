import { Injectable } from '@nestjs/common';
import { Role } from 'src/auth/role.enum';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  private readonly users: User[] = [
    { id: 1, username: 'admin123', hashed_password: bcrypt.hashSync('pass1'), role: Role.ADMIN },
    { id: 2, username: 'normal123',   hashed_password: bcrypt.hashSync('pass2'), role: Role.NORMAL },
    { id: 3, username: 'limiter321', hashed_password: bcrypt.hashSync('pass3'), role: Role.LIMITED },
  ];

  async findByUsername(username: string): Promise<User | undefined> {
    return this.users.find(u => u.username === username);
  }

  async findById(id: number): Promise<User | undefined> {
    return this.users.find(u => u.id === id);
  }
}
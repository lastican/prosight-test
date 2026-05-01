import { Role } from '../role.enum';

export class LoginResponse {
  access_token: string;
  role: Role;
}
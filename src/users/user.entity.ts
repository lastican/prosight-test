import { Role } from "src/auth/role.enum";

export class User {
  id: number;
  username: string;
  hashed_password: string;
  role: Role;
}
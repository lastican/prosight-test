import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginRequest } from './dto/post-request.dto';
import { LoginResponse } from './dto/post-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  login(@Body() body: LoginRequest): Promise<LoginResponse> {
    return this.authService.login(body.username, body.password);
  }
}
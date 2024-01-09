import { AuthRepository } from "../infrastructure/repositories/auth-repositori";

export class AuthService {
  constructor(protected authQueryRepository : AuthRepository) {
    
  }
 
}

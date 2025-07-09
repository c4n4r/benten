import { UserDTO } from '../../../../domain/user.entity';

export interface LoginUserResponse {
  user: UserDTO;
  accessToken: string;
  refreshToken: string;
}

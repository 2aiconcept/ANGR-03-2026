import { User } from './user';

/**
 * Session d'authentification : token JWT + utilisateur associé.
 * C'est ce que le service Auth garde en signal et persiste dans le localStorage,
 * pour que token et user restent toujours cohérents entre eux.
 */
export interface AuthSession {
  token: string;
  user: User;
}

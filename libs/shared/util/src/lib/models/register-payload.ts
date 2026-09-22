import { Credentials } from './credentials';

/** Données d'inscription attendues par `POST /api/auth/register`. */
export interface RegisterPayload extends Credentials {
  nom: string;
  prenom: string;
}

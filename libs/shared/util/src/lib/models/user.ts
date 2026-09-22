/** Utilisateur connecté, tel que renvoyé par l'API (`POST /api/auth/login` et `/register`). */
export interface User {
  id: number;
  email: string;
  nom: string;
  prenom: string;
  role: string;
}

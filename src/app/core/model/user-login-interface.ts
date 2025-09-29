export interface LoginRequestInterface {
    username: string,
    password: string
}

export interface RegisterRequestInterface {
  username: string,
  password: string,
  email: string,
  name: string
}

export interface RegisterResponseInterface {
  username: string,
  name: string
}

export interface AuthResponseInterface {
  token: string;
  name: string;
}


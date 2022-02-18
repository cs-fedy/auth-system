export interface CreateAccountPayload {
  userId: string
}

export interface RefreshToken {
  token: string
  expiresIn: number
}

export interface AuthPayload {
  access: string
  refresh: RefreshToken
}

export interface CodePayload {
  code: string
  expiresIn: number
}

export interface VerifyEmailPayload {
  expiresIn: number
}

export interface ForgetPasswordPayload {
  expiresIn: number
}

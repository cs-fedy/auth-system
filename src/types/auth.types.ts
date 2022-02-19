export interface CreateAccountPayload {
  userId: string
}

export interface RefreshToken {
  token: string
  expiresIn: Date
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
  expiresIn: Date
}

export interface ForgetPasswordPayload {
  expiresIn: Date
}

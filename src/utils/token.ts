import jwt from 'jsonwebtoken'
import { v4 as uuid } from 'uuid'
import bcrypt from 'bcrypt'
import {config} from '@configs'
import { AuthTypes } from '@custom-types'

export const generateAccessToken = (data: any) =>
  jwt.sign(data, config.jwt.secret, {
    expiresIn: `${config.jwt.accessExpirationMinutes}m`,
  })

export const generateRefreshToken = async (): Promise<AuthTypes.RefreshToken> => {
  const code = uuid()
  const refreshTokenExpiry = new Date(
    Date.now() + parseInt(config.jwt.refreshExpirationDays) * 86400000
  )

  return {
    token: await bcrypt.hash(code, config.saltRound),
    expiresIn: refreshTokenExpiry,
  }
}

export const generateCode = () => {
  return {
    code: uuid(),
    expiresIn: new Date(
      Date.now() + parseInt(config.jwt.verifyEmailExpirationMinutes) * 6000
    ),
  }
}

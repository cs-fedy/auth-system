import express from 'express'
import { HttpStatus } from '@custom-types'
import { AdminServices } from '@services'

export default class AdminControllers {
  static async createUser(req: express.Request, res: express.Response) {
    const {
      email,
      password,
      roleId,
      firstName,
      lastName,
      role: { name: roleName },
    } = req.body
    const data = { email, password, roles: [roleId], firstName, lastName }
    const user = await AdminServices.createUser(data, roleName)
    return res.status(HttpStatus.CREATED).json({
      status: HttpStatus.CREATED,
      data: { msg: 'user created successfully', userId: user.id, roleId },
    })
  }
}

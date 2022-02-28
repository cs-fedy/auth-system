import express from 'express'
import { RoleServices } from '@services'
import { HttpStatus } from '@custom-types'

export default class RoleControllers {
  static async createRole(req: express.Request, res: express.Response) {
    const { name } = req.body
    const { id: roleId } = await RoleServices.createRole(name)
    return res.status(HttpStatus.CREATED).json({
      status: HttpStatus.CREATED,
      data: { roleId },
    })
  }

  static async grantRole(req: express.Request, res: express.Response) {
    const {
      userId,
      roleId,
      role: { name: roleName },
    } = req.body
    await RoleServices.grantRole(userId, roleId, roleName)
    return res.status(HttpStatus.CREATED).json({
      status: HttpStatus.CREATED,
      data: { msg: 'role granted successfully', userId, roleId },
    })
  }

  static async revokeRole(req: express.Request, res: express.Response) {
    const {
      userId,
      roleId,
      role: { name: roleName },
    } = req.body
    await RoleServices.revokeRole(userId, roleId, roleName)
    return res.status(HttpStatus.NO_CONTENT).json({
      status: HttpStatus.NO_CONTENT,
      data: { msg: 'role revoked successfully', userId, roleId },
    })
  }

  static async listRoles(req: express.Request, res: express.Response) {
    const roles = await RoleServices.listRoles()
    return res.status(HttpStatus.OK).json({
      status: HttpStatus.OK,
      data: { roles },
    })
  }

  static async getRole(req: express.Request, res: express.Response) {
    const role = await RoleServices.getRole(req.params.roleId)
    return res.status(HttpStatus.OK).json({
      status: HttpStatus.OK,
      data: { role },
    })
  }
}

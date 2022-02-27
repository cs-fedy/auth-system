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

  static async createResource(req: express.Request, res: express.Response) {
    const { name, permissions } = req.body
    const data = { name, permissions }
    const { id: roleId } = await RoleServices.createResource(data)
    return res.status(HttpStatus.CREATED).json({
      status: HttpStatus.CREATED,
      data: { roleId },
    })
  }

  static async assignResource(req: express.Request, res: express.Response) {
    const { roleId, resourceId } = req.body
    await RoleServices.assignResource(roleId, resourceId)
    return res.status(HttpStatus.CREATED).json({
      status: HttpStatus.CREATED,
      data: { roleId, resourceId },
    })
  }
}

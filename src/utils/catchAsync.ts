/* eslint-disable @typescript-eslint/ban-types */
import express from 'express'

export default (fn: Function) =>
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((err) => next(err))
  }

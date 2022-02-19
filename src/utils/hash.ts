import bcrypt from 'bcrypt'
import { config } from '@configs'

export const hash = async (data: any) => await bcrypt.hash(data, config.saltRound)
export const compare = async (src: any, target: any) => await bcrypt.compare(src, target)

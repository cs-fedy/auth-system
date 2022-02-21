import Queue from 'bull'
import { config } from '@configs'
import { DAOUser } from '@models'

const options = {
  redis: { ...config.db.redis },
}
const destroyAccountQueue = new Queue('destroy_account', options)

const destroy: Queue.ProcessCallbackFunction<any> = async (job) => {
  const user = await DAOUser.getUserByEmail(job.data.email)
  if (user && !user.verified) await DAOUser.deleteUser(job.data.email)
}

destroyAccountQueue.process(destroy)

const destroyAccount = (email: string) => {
  destroyAccountQueue.add({ email }, { delay: 86_400_000, attempts: 4 })
}

export default destroyAccount

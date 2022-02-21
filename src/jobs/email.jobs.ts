import Queue from 'bull'
import sgMail from '@sendgrid/mail'
import { config } from '@configs'

const options = {
  redis: { ...config.db.redis },
}
const sendEmailQueue = new Queue('send_email', options)

const send: Queue.ProcessCallbackFunction<any> = async (job) => {
  sgMail.setApiKey(config.sendGridApiKey)
  await sgMail.send(job.data)
}

sendEmailQueue.process(send)

const sendEmail = (data: any) => {
  sendEmailQueue.add(data, { attempts: 4 })
}

export default sendEmail

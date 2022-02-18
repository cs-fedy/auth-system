import swaggerJsdoc from 'swagger-jsdoc'
import { config } from '@configs'

export const swaggerDefinition: swaggerJsdoc.SwaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Auth system API Documentation',
    version: '1.0.0',
    license: {
      name: 'MIT',
      url: 'https://github.com/cs-fedy/auth-system',
    },
  },
}

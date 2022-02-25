/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const tsConfigPaths = require('tsconfig-paths')

const cleanup = tsConfigPaths.register({
  baseUrl: './src',
  paths: {
    '@root/*': ['*'],
    '@common': ['common/index.ts'],
    '@configs': ['configs'],
    '@controllers': ['controllers/index.ts'],
    '@db': ['db/index.ts'],
    '@docs': ['docs/index.ts'],
    '@jobs': ['jobs/index.ts'],
    '@middlewares': ['middlewares/index.ts'],
    '@models': ['models/index.ts'],
    '@routes': ['routes/index.ts'],
    '@services': ['services/index.ts'],
    '@custom-types': ['types/index.ts'],
    '@utils': ['utils/index.ts'],
    '@validators': ['validators/index.ts'],
  },
})

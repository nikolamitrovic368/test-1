import { fileURLToPath } from 'node:url'
import createNextIntlPlugin from 'next-intl/plugin'

import createJiti from 'jiti'
const jiti = createJiti(fileURLToPath(import.meta.url))

// Import env here to validate during build. Using jiti we can import .ts files :)
jiti('./env')

const withNextIntl = createNextIntlPlugin()

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['cdn.sanity.io'],
  },
  sassOptions: {
    quietDeps: true,
  },
}

export default withNextIntl(nextConfig)

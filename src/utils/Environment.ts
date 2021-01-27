/**
 * Checks if the current environment is a production environment.
 */
export function isProduction(): boolean {
  const env = process.env.ENVIRONMENT || 'dev'

  return env == 'prod' || env == 'production'
}

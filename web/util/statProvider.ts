export const statProvider = {
  isPrd: (): boolean => {
    return process.env.PROJECT_ENV === 'production'
  },
  isLocal: (): boolean => {
    return process.env.PROJECT_ENV === 'local'
  },
}

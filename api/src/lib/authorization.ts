export function assertNotAdmin(user) {
  if (user.role !== 'admin') {
    throw new Error('Admins cannot perform user actions.')
  }
}

export function assertAdmin(user) {
  if (user.role !== 'admin') {
    throw new Error('Only admins may perform this action.')
  }
}

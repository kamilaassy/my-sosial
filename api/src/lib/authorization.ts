export function assertNotAdmin(user) {
  if (String(user.role).toLowerCase() === 'admin') {
    throw new Error('Admins cannot perform user actions.')
  }
}

export function assertAdmin(user) {
  if (String(user.role).toLowerCase() !== 'admin') {
    throw new Error('Only admins may perform this action.')
  }
}

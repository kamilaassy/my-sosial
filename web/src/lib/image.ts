export const getLowResPlaceholder = (url: string) => {
  return url.replace('/upload/', '/upload/c_fill,w_20,h_20,q_1,e_blur:1000/')
}

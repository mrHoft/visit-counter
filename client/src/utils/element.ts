export const isFormElement = <T extends HTMLElement>(el: Element): el is T => {
  const prototype = Object.getPrototypeOf(el)
  return Object.prototype.hasOwnProperty.call(prototype, 'name')
}

import { findAll } from '@ember/test-helpers';

export default function findByText(selectorOrElements, text) {
  let elements = selectorOrElements;
  if (typeof selectorOrElements === 'string') {
    elements = findAll(selectorOrElements);
  }
  return elements.find((el) => el.textContent.includes(text));
}

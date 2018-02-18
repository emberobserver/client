import { findAll } from '@ember/test-helpers';

export default function findByText(selector, text) {
  return findAll(selector).find((el) => el.textContent.includes(text));
}

import { uncountable } from '@warp-drive/utilities/string';

export function initialize(/* application */) {
  uncountable('github-stats');
}

export default {
  name: 'inflections',
  initialize,
};

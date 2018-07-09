import { helper } from '@ember/component/helper';

export function cleanRepoUrl([repoUrl]) {
  return (repoUrl || '').replace(/\.git$/, '');
}

export default helper(cleanRepoUrl);

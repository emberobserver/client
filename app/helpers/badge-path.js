import { helper } from '@ember/component/helper';

export function badgePath([addonName]/*, hash*/) {
  let safeName = addonName.replace(/[^A-Za-z0-9]/g, '-');
  return `/badges/${safeName}.svg`;
}

export default helper(badgePath);

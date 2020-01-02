import Model, { attr, belongsTo } from '@ember-data/model';

export default Model.extend({
  stars: attr('number'),
  firstCommitDate: attr('date'),
  latestCommitDate: attr('date'),
  forks: attr('number'),
  openIssues: attr('number'),
  committedToRecently: attr('boolean'),
  addon: belongsTo('addon')
});

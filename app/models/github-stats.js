import DS from 'ember-data';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';

export default DS.Model.extend({
  stars: attr('number'),
  firstCommitDate: attr('date'),
  latestCommitDate: attr('date'),
  forks: attr('number'),
  openIssues: attr('number'),
  committedToRecently: attr('boolean'),
  addon: belongsTo('addon')
});

import classic from 'ember-classic-decorator';
import Model, { attr, belongsTo } from '@ember-data/model';

@classic
export default class GithubStats extends Model {
  @attr('number')
  stars;

  @attr('date')
  firstCommitDate;

  @attr('date')
  latestCommitDate;

  @attr('number')
  forks;

  @attr('number')
  openIssues;

  @attr('boolean')
  committedToRecently;

  @belongsTo('addon')
  addon;
}

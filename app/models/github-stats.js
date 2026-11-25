import Model, { attr, belongsTo } from '@ember-data/model';

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

  @belongsTo('addon', { async: true, inverse: 'githubStats' })
  addon;
}

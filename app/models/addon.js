import classic from 'ember-classic-decorator';
import { computed } from '@ember/object';
import { gt } from '@ember/object/computed';
import Model, { hasMany, belongsTo, attr } from '@ember-data/model';
import moment from 'moment';

@classic
export default class Addon extends Model {
  isAddon = true;

  @attr('string')
  name;

  @attr('string')
  description;

  @attr('string')
  repositoryUrl;

  @attr('date')
  latestVersionDate;

  @attr('date')
  publishedDate;

  @attr('string')
  license;

  @attr('boolean')
  isDeprecated;

  @attr('string')
  note;

  @attr('boolean')
  isOfficial;

  @attr('boolean')
  isCliDependency;

  @attr('boolean')
  isHidden;

  @attr('boolean')
  hasInvalidGithubRepo;

  @attr('number')
  score;

  @attr('number')
  ranking;

  @hasMany('github-user')
  githubUsers;

  @attr('number')
  lastMonthDownloads;

  @attr('boolean')
  isWip;

  @attr('boolean')
  isTopDownloaded;

  @attr('boolean')
  isTopStarred;

  @attr('string')
  demoUrl;

  @attr('date')
  updatedAt;

  @attr('string')
  overrideRepositoryUrl;

  @attr('boolean')
  extendsEmber;

  @attr('boolean')
  extendsEmberCli;

  @attr('boolean')
  isMonorepo;

  @attr('boolean')
  hasBeenReviewed;

  @belongsTo('github-stats', { async: true })
  githubStats;

  @belongsTo('version', { async: true })
  latestAddonVersion;

  @belongsTo('review', { async: true })
  latestReview;

  @hasMany('category', { async: true })
  categories;

  @hasMany('keyword', { async: true })
  keywords;

  @hasMany('version', { async: true })
  versions;

  @hasMany('maintainer', { async: true })
  maintainers;

  @belongsTo('readme', { async: true })
  readme;

  @gt('githubUsers.length', 1)
  hasMoreThan1Contributor;

  @computed('name')
  get npmUrl() {
    return `https://www.npmjs.com/package/${this.name}`;
  }

  @computed('publishedDate')
  get isNewAddon() {
    return moment(this.publishedDate).isAfter(moment().subtract(2, 'weeks'));
  }
}

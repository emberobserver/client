import classic from 'ember-classic-decorator';
import { computed } from '@ember/object';
import { gt } from '@ember/object/computed';
import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { hasMany, belongsTo } from 'ember-data/relationships';
import moment from 'moment';

@classic
export default class AddonEmberObject extends Model {
  isAddon = true;

  @attr
  name;

  @attr
  description;

  @attr
  repositoryUrl;

  @attr
  latestVersionDate;

  @attr
  publishedDate;

  @attr
  license;

  @attr
  isDeprecated;

  @attr
  note;

  @attr
  isOfficial;

  @attr
  isCliDependency;

  @attr
  isHidden;

  @attr
  hasInvalidGithubRepo;

  @attr
  score;

  @attr
  ranking;

  @hasMany
  githubUsers;

  @attr
  lastMonthDownloads;

  @attr
  isWip;

  @attr
  isTopDownloaded;

  @attr
  isTopStarred;

  @attr
  demoUrl;

  @attr
  updatedAt;

  @attr
  overrideRepositoryUrl;

  @attr
  extendsEmber;

  @attr
  extendsEmberCli;

  @attr
  isMonorepo;

  @attr
  hasBeenReviewed;

  @belongsTo
  githubStats;

  @belongsTo
  latestAddonVersion;

  @belongsTo
  latestReview;

  @hasMany
  categories;

  @hasMany
  keywords;

  @hasMany
  versions;

  @hasMany
  maintainers;

  @belongsTo
  readme;

  @gt('githubUsers.length', 1)
  hasMoreThan1Contributor;

  @computed('name')
  get npmUrl() {
    return `https://www.npmjs.com/package/${this.get('name')}`;
  }

  @computed('publishedDate')
  get isNewAddon() {
    return moment(this.get('publishedDate')).isAfter(moment().subtract(2, 'weeks'));
  }
}

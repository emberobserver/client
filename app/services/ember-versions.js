import Ember from 'ember';

export default Ember.Service.extend({
  ajax: Ember.inject.service(),
  features: Ember.inject.service(),
  store: Ember.inject.service(),
  data: null,
  url: 'https://api.github.com/repos/emberjs/ember.js/releases?per_page=100',
  isLoaded: Ember.computed.notEmpty('data'),
  versionData: Ember.computed('isLoaded', 'data', function() {
    if (!this.get('isLoaded')) {
      return [];
    }
    let data = this.get('data');
    return data.map(dataForVersion).compact();
  }),
  fetch() {
    if (this.get('isLoaded')) {
      return;
    }

    if (this.get('features').isEnabled('ember-versions-model')) {
      this.get('store').queryRecord('ember-versions', {}).then((response) => {
        this.set('data', response.get('githubResponse'));
      }).catch(() => {
        this.set('data', null);
      });
    } else {
      this.get('ajax').request(this.url).then((response) => {
        this.set('data', response);
      }).catch(() => {
        this.set('data', null);
      });
    }
  }
});

const betaRegex = /beta/;
const majorOrMinorRegex = /\.0$/;

function dataForVersion(version) {
  if (!version.tag_name || !version.published_at) {
    return null;
  }
  if (version.tag_name.match(betaRegex)) {
    return null;
  }
  if (!version.tag_name.match(majorOrMinorRegex)) {
    return null;
  }

  return {
    version: `Ember ${version.tag_name}`,
    released: new Date(version.published_at),
    isEmber: true
  };
}

import Ember from 'ember';

export default Ember.Service.extend({
  ajax: Ember.inject.service(),
  data: null,
  url: 'https://api.github.com/repos/emberjs/ember.js/releases?per_page=100',
  isLoaded: Ember.computed.notEmpty('data'),
  versionData: function() {
    if (!this.get('isLoaded')) {
      return [];
    }
    let data = this.get('data');
    return data.map(dataForVersion).compact();
  }.property('isLoaded', 'data'),
  fetch() {
    if (this.get('isLoaded')) {
      return;
    }
    this.get('ajax').request(this.url).then((response) => {
      this.set('data', response);
    }).catch(() => {
      this.set('data', null);
    });
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

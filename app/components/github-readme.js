import Ember from 'ember';

export default Ember.Component.extend({
  readme: '',
  actionMessage: 'Show Readme',
  showReadme: false,

  actions: {
    toggleReadme: function() {
      if (!this.get('readme')) {
        var result = this.get('url').split('/');
        var owner = result[result.length - 2];
        var repo = result[result.length - 1];
        var path = ['https://api.github.com/repos', owner, repo, 'readme'];
        path = path.join('/');

        var _this = this;

        $.ajax({
          url: path,
          headers: {
              Accept: 'application/vnd.github.3.html'
          }
        }).done(function (result) {
          _this.set('readme', result);
        });
      }

      if (this.get('showReadme')) {
        this.set('actionMessage', 'Hide Readme');
        this.set('showReadme', false);
      } else {
        this.set('actionMessage', 'Show Readme');
        this.set('showReadme', true);
      }
    }
  }
});

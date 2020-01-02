import { hbs } from 'ember-cli-htmlbars';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';

module('Integration | Helper | clean-repo-url', function(hooks) {
  setupRenderingTest(hooks);

  test('it removes trailing .git from repo URLs', async function(assert) {
    this.set('repoUrl', 'http://example.com/someone/something.git');

    await render(hbs`{{clean-repo-url repoUrl}}`);

    assert.equal(this.element.textContent.trim(), 'http://example.com/someone/something');
  });

  test('it does not remove non-trailing ".git"', async function(assert) {
    let repoUrl = 'http://example.com/someone.git/something';
    this.set('repoUrl', repoUrl);

    await render(hbs`{{clean-repo-url repoUrl}}`);

    assert.equal(this.element.textContent.trim(), repoUrl);
  });

  test('it does nothing to URLs that lack .git', async function(assert) {
    let repoUrl = 'http://example.com/someone/something';
    this.set('repoUrl', repoUrl);

    await render(hbs`{{clean-repo-url repoUrl}}`);

    assert.equal(this.element.textContent.trim(), repoUrl);
  });
});

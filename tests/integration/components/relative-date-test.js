import { hbs } from 'ember-cli-htmlbars';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import Service from '@ember/service';
import { render } from '@ember/test-helpers';
import moment from 'moment';

module('Integration | Component | relative-date', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders as a <time> tag', async function (assert) {
    await render(hbs`
      <RelativeTime/>
    `);

    assert.dom('time').exists();
  });

  test('it displays the relative time from the given date', async function (assert) {
    this.date = moment().subtract(3, 'days');

    await render(hbs`
      <RelativeTime @date={{this.date}} />
    `);

    assert.dom('time').hasText('3 days ago');
  });

  test('it uses the currentDate service to determine the current date', async function (assert) {
    this.owner.register(
      'service:current-date',
      class extends Service {
        get date() {
          return moment('2006-10-30T00:00:00Z');
        }
      }
    );

    this.date = moment('2006-09-30T00:00:00Z');
    await render(hbs`
      <RelativeTime @date={{this.date}} />
    `);

    assert.dom('time').hasText('a month ago');
  });

  test('it sets the datetime and title attributes to the ISO-formatted date string', async function (assert) {
    this.date = moment('2020-09-30T00:00:00Z');

    await render(hbs`
      <RelativeTime @date={{this.date}} />
    `);

    assert.dom('time').hasAttribute('datetime', '2020-09-30T00:00:00.000Z');
    assert.dom('time').hasAttribute('title', '2020-09-30T00:00:00.000Z');
  });
});

import ApplicationSerializer from './application';

export default ApplicationSerializer.extend({
  serialize() {
    let json = ApplicationSerializer.prototype.serialize.apply(this, arguments);

    json.data.forEach((object) => {
      object.relationships['github-stats'] = {
        links: {
          related: `/api/v2/addons/${object.id}/github-stats`
        }
      };

      object.relationships['github-users'] = {
        links: {
          related: `/api/v2/addons/${object.id}/github-users`
        }
      };
    });

    return json;
  }
});

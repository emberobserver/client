import ApplicationSerializer from './application';

export default ApplicationSerializer.extend({
  serialize() {
    let json = ApplicationSerializer.prototype.serialize.apply(this, arguments);
    if (json.data.length) {
      json.data.forEach((object) => {
        setRelationshipLinks(object);
      });
    } else {
      setRelationshipLinks(json.data);
    }

    return json;
  }
});

function setRelationshipLinks(object) {
  if (object && object.relationships) {
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

    object.relationships['latest-review'] = {
      links: {
        related: `/api/v2/addons/${object.id}/latest-review`
      }
    };
  }
}

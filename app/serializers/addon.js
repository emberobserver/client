import DS from 'ember-data';

export default DS.JSONAPISerializer.extend({
  attrs: {
    name: { serialize: false },
    description: { serialize: false },
    repositoryUrl: { serialize: false },
    latestVersionDate: { serialize: false },
    publishedDate: { serialize: false },
    license: { serialize: false },
    score: { serialize: false },
    ranking: { serialize: false },
    githubUsers: { serialize: false },
    lastMonthDownloads: { serialize: false },
    isTopDownloaded: { serialize: false },
    isTopStarred: { serialize: false },
    demoUrl: { serialize: false },
    githubStats: { serialize: false },
    keywords: { serialize: false },
    versions: { serialize: false },
    maintainers: { serialize: false },
    readme: { serialize: false },
    reviews: { serialize: false },
  }
});

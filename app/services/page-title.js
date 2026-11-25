import PageTitleService from 'ember-page-title/services/page-title';

/**
 * ember-cli-document-title built the title with the application route's title(tokens),
 * from each route's titleToken, outermost first. The route templates give those titles now.
 */
export default class PageTitle extends PageTitleService {
  toString() {
    return title(
      this.visibleTokens.map((token) => token.title).filter(Boolean),
    );
  }
}

function title(tokens) {
  let tokenStr = tokens.join(' | ');
  if (tokenStr) {
    return `${tokenStr} - Ember Observer`;
  } else {
    return 'Ember Observer';
  }
}

import { helper } from '@ember/component/helper';
import { htmlSafe } from '@ember/string';
import createDOMPurify from 'dom-purify';

const config = {
  ALLOWED_TAGS: ['#text', 'a', 'b', 'blockquote', 'br', 'caption', 'cite', 'code', 'col',
                 'colgroup', 'dd', 'dl', 'dt', 'em', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
                 'i', 'img', 'li', 'ol', 'p', 'pre', 'q', 'small', 'strike', 'strong',
                 'sub', 'sup', 'table', 'tbody', 'td', 'tfoot', 'th', 'thead', 'tr', 'u',
                 'ul', 'span'],
  ALLOWED_ATTR: ['class', 'href', 'title', 'span', 'width', 'cite', 'align', 'alt', 'height',
                 'src', 'title', 'type', 'abbr', 'axis', 'colspan', 'rowspan', 'scope'],
  KEEP_CONTENT: false,
};

export function domPurify([content]/* , hash*/) {
  let DOMPurify = createDOMPurify(window);

  DOMPurify.addHook('afterSanitizeAttributes', function(node) {
    if (node instanceof HTMLAnchorElement) {
      node.setAttribute('target', '_blank');
      node.setAttribute('rel', 'noopener nofollow');
    }
  });

  return htmlSafe(DOMPurify.sanitize(content, config));
}

export default helper(domPurify);

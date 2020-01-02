import classic from 'ember-classic-decorator';
import Controller from '@ember/controller';

@classic
export default class CodeSearchController extends Controller {
  queryParams = ['codeQuery', 'sort', 'sortAscending', 'regex', 'fileFilter'];
  codeQuery = '';
  sort = 'name';
  sortAscending = true;
  regex = false;
  fileFilter = null;
}

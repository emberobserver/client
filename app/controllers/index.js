import classic from 'ember-classic-decorator';
import Controller from '@ember/controller';

@classic
export default class IndexController extends Controller {
  queryParams = ['query', 'searchReadmes'];
  query = '';
  searchReadmes = false;
}

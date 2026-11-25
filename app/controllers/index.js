import Controller from '@ember/controller';

export default class IndexController extends Controller {
  queryParams = ['query', 'searchReadmes'];
  query = '';
  searchReadmes = false;
}

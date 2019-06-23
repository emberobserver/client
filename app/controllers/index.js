import classic from 'ember-classic-decorator';
import Controller from '@ember/controller';
import ControllerWithSearch from '../mixins/controller-with-search';

@classic
export default class IndexController extends Controller.extend(ControllerWithSearch) {}

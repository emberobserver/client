import classic from 'ember-classic-decorator';
import { sort } from '@ember/object/computed';
import Controller from '@ember/controller';

@classic
export default class SizeCalculationResultsIndexController extends Controller {
  queryParams = ['date'];
  sizeCalculationResultSorting = ['testsRunAt:desc'];

  @sort('model', 'sizeCalculationResultSorting')
  sortedSizeCalculationResults;
}

import { sort } from '@ember/object/computed';
import Controller from '@ember/controller';

export default Controller.extend({
  queryParams: ['date'],
  sizeCalculationResultSorting: ['testsRunAt:desc'],
  sortedSizeCalculationResults: sort('model', 'sizeCalculationResultSorting'),
});

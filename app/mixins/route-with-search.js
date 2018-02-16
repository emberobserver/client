import Mixin from '@ember/object/mixin';

export default Mixin.create({
  queryParams: {
    query: {
      replace: true
    },
    searchReadmes: {
      replace: true
    }
  }
});

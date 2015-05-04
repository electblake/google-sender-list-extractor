angular.module('addressBundlerConfig')
	.run(['DS', function(DS) {
		DS.defineResource({
			name: 'user',
			endpoint: 'users',
			idAttribute: '_id',
			beforeUpdate: function(resource, attrs, cb) {
				attrs.updated = (new Date);
				cb(null, attrs);
			}
		});
	}])
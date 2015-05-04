var log = require('../../lib/logger');
var cfg = require('../../lib/config');

var router = require('express').Router();
var auth_session = require('../lib/auth-session');

var gLib = require('../../lib/google');
var gmail = gLib.google.gmail('v1');

var _ = require('lodash');
var async = require('async');

function getEmailsFromString(input) {
  var ret = [];
  var email = /\"([^\"]+)\"\s+\<([^\>]+)\>/g

  var match;
  while (match = email.exec(input))
    ret.push({'name':match[1], 'email':match[2]})

  return ret;
}

router.get('/capture', auth_session, function(req, res, next) {
	if (req.user.email) {

		var authClient = gLib.client;
		authClient.setCredentials(req.user.auth.google.tokens);

		var user_labels = req.user.labels;
		var capture_labels = _.filter(req.user.labels, { use: true });

		var label_ids = _.map(capture_labels, function(row) { return row.id; });

		var base_params = { userId: 'me', id: req.user.email, auth: authClient, maxResults: 1000 };
		var threads = [];
		var threadLimit = 500;

		var getThreadMeta = function(threadId, cb) {
			params.id = threadId;
			params.format = "metadata";
			gmail.users.threads.get(params, function(err, result) {
				console.log('result', result);
				cb(null, result);
			});
		};

		async.each(label_ids, function(label_id, next_label) {

			var params = base_params;
				params.labelIds = label_id;

			log.debug('Capturing Label', label_id);

			var getThreadsLoop = function(nextPageToken) {
				if (nextPageToken && nextPageToken.length > 0) {
					log.debug('Capturing nextPage', label_id);
					params.pageToken = nextPageToken;
				}

				gmail.users.threads.list(params, function(err, result) {
					if (err) {
						next_label(err);
					} else {

						if (result.threads) {
							threads = threads.concat(result.threads);
							log.info('Threads Count:', threads.length);
						}

						if (result.nextPageToken && threads.length < threadLimit) {
							getThreadsLoop(result.nextPageToken);
						} else {
							next_label()
						}
					}
				});
			};

			getThreadsLoop(null);

		}, function(err, results) {
			if (err) {
				log.error(err);
				res.status(400).send('Gmail User Threads Get ' + err.toString());
			} else {

				// populate thread meta
				async.map(threads, function(thread, next_thread) {
					log.debug('Metaing Thread', thread.id);
					params = _.merge(base_params, { id: thread.id })
					gmail.users.threads.get(params, function(err, thread_info) {
						// log.debug('meta', meta);
						if (err) {
							next_thread(err);
						} else {

							var contacts = {};
							_.each(thread_info.messages, function(message, next_message) {
								var headers = message.payload.headers;
								var subject = _.find(headers, { name: 'Subject' }).value;
								var from = getEmailsFromString(_.find(headers, { name: 'From' }).value)[0];

								contacts[from] = { subject: subject, from: from };
							});
							log.debug('contacts', contacts);

							next_thread(null, contacts);
						}
					});
				}, function(err, contacts) {
					if (err) {
						log.error(err);
						res.status(400).send(err);
					} else {
						res.send({ contacts: contacts });
					}
				});
			}
		});

	} else {
		res.status(401).send('Error: Session Email not Found, Login Required.');
	}
});

module.exports = router;
var log = require('../../lib/logger');
var cfg = require('../../lib/config');

var router = require('express').Router();
var auth_session = require('../lib/auth-session');

var gLib = require('../../lib/google');
var gmail = gLib.google.gmail('v1');

var _ = require('lodash');
var async = require('async');
var fs = require('fs-extra');
var path = require('path');

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

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
		var threadLimit = 0;

		var getThreadMeta = function(threadId, cb) {
			params.id = threadId;
			params.format = "metadata";
			gmail.users.threads.get(params, function(err, result) {
				// console.log('result', result);
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

						if (result.nextPageToken) {
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

				var contacts = [];

				// populate thread meta
				async.map(threads, function(thread, next_thread) {
					log.debug('Metaing Thread', thread.id);
					params = _.merge(base_params, { id: thread.id })
					gmail.users.threads.get(params, function(err, thread_info) {
						if (err) {
							next_thread(err);
						} else {
							_.each(thread_info.messages, function(message, next_message) {
								var headers = message.payload.headers;
								var subject = _.find(headers, { name: 'Subject' }).value;
								var from = _.find(headers, { name: 'From' }).value;
								var date = _.find(headers, { name: 'Date' }).value;
								var dupes = _.where(contacts, { from: from });

								if (!dupes || dupes.length < 1) {
									contacts.push({ subject: subject, from: from, date: date });
								}
							});

							next_thread(null);
						}
					});
				}, function(err) {
					if (err) {
						log.error(err);
						res.status(400).send(err);
					} else {

						var report = {
							count: contacts.length,
							sample: contacts[0]
						};

						var user_files = path.resolve(path.join('user-files', req.user._id.toString()));

						fs.ensureDirSync(user_files);

						fs.writeFile(path.join(user_files, contacts.length+'-contacts--'+(new Date).getTime()+'.json'), JSON.stringify(contacts, null, 2), function(err, result) {
							if (err) {
								log.error(err);
								res.status(400).send(err);
							} else {
								res.send(report);
							}
						});
					}
				});
			}
		});

	} else {
		res.status(401).send('Error: Session Email not Found, Login Required.');
	}
});

module.exports = router;
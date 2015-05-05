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
var moment = require('moment');
var watcher = require('time-calc');

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
		var after_unit = req.user.capture.after_unit;
		var after_num = req.user.capture.after_num;
		var capture_labels = _.filter(req.user.labels, { use: true });
		var label_ids = _.map(capture_labels, function(row) { return row.id; });
		var base_params = { userId: 'me', id: req.user.email, auth: authClient, maxResults: 1000 };


		var threads = [];
		var threadLimit = 0;
		var pageCount = 0;

		var getThreadMeta = function(threadId, cb) {
			params.id = threadId;
			params.format = "metadata";
			gmail.users.threads.get(params, function(err, result) {
				// console.log('result', result);
				cb(null, result);
			});
		};

		async.eachLimit(label_ids, 50, function(label_id, next_label) {

			var params = { labelIds: label_id };
			var after = moment().subtract(parseInt(after_num), after_unit).format('YYYY/MM/D');
			params.q = 'after:' + after;

			log.debug('Capturing Label', params);
			var params = _.extend(base_params, params);

			var getThreadsLoop = function(nextPageToken) {
				if (nextPageToken && nextPageToken.length > 0) {
					log.debug('--> Capturing nextPage', label_id);
					params.pageToken = nextPageToken;
				}

				pageCount += 1;
				gmail.users.threads.list(params, function(err, result) {
					if (err) {
						next_label(err);
					} else {

						if (result.threads) {
							threads = threads.concat(result.threads);
							log.debug('Threads Count:', threads.length);
							log.debug('Page Count:', pageCount);
							// log.debug('Taken:', watcher(params));
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
				var query_estimate = threads.length;
				var threadQueryCount = 0;
				log.info('--> Thread Meta, estimated:', threads.length, 'queries from', pageCount, 'pages');

				// populate thread meta
				async.mapLimit(threads, 220, function(thread, next_thread) {
					threadQueryCount += 1;
					log.debug('------> Meta Thread', thread.id, Math.ceil(threadQueryCount / query_estimate * 100)+'%', thread.snippet);

					params = _.merge(base_params, { id: thread.id })
					gmail.users.threads.get(params, function(err, thread_info) {
						if (err) {
							next_thread(err);
						} else {
							_.each(thread_info.messages, function(message, next_message) {

								var headers = message.payload.headers;
								var subject = _.find(headers, { name: 'Subject' }).value.replace(',', '');
								var from = _.find(headers, { name: 'From' }).value;
								var message_date = moment(new Date(_.find(headers, { name: 'Date' }).value));
								var date = message_date.format();
								var dupes = _.where(contacts, { from: from });

								if (!dupes || dupes.length < 1) {
									contacts.push({ subject: subject, from: from, date: date });
								} else {
									log.debug('From', from, 'is duplicate', dupes);
								}
							});
							// log.debug('----> Taken:', watcher(params));
							next_thread(null);
						}
					});
				}, function(err) {
					if (err) {
						log.error(err);
						res.status(400).send(err);
					} else {
						log.info('--> Finishing..');
						var report = {
							count: contacts.length,
							sample: contacts[0]
						};

						if (contacts.length > 0) {
							var user_files = path.resolve(path.join('user-files', req.user._id.toString()));
							log.info('----> Writing', contacts.length, 'contacts to', user_files);

							fs.ensureDirSync(user_files);

							fs.writeFile(path.join(user_files, contacts.length+'-contacts--'+(new Date).getTime()+'.json'), JSON.stringify(contacts, null, 2), function(err, result) {
								if (err) {
									log.error(err);
									res.status(400).send(err);
								} else {
									res.send(report);
								}
							});
						} else {
							res.send(report);
						}
					}
				});
			}
		});

	} else {
		res.status(401).send('Error: Session Email not Found, Login Required.');
	}
});

module.exports = router;
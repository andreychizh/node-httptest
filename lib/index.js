var querystring = require('querystring'),
    request = require('request'),
    assert = require('assert'),
    lodash = require('lodash');

module.exports = function(baseUri) {
    'use strict';

    var params = {
        uri: baseUri || '',
        method: 'GET'
    };

    var expects = {};

    return {

        /**
         * POST request
         *
         * @param uri
         * @returns {Object}
         */
        post: function(uri) {
            if (uri) {
                params.uri += uri;
            }
            params.method = 'POST';
            return this;
        },

        /**
         * GET request
         *
         * @param uri
         * @returns {Object}
         */
        get: function(uri) {
            if (uri) {
                params.uri += uri;
            }
            params.method = 'GET';
            return this;
        },

        /**
         * PUT request
         *
         * @param uri
         * @returns {Object}
         */
        put: function(uri) {
            if (uri) {
                params.uri += uri;
            }
            params.method = 'PUT';
            return this;
        },

        /**
         * DELETE request
         *
         * @param uri
         * @returns {Object}
         */
        del: function(uri) {
            if (uri) {
                params.uri += uri;
            }
            params.method = 'DELETE';
            return this;
        },

        /**
         * Body for POST, PUT, DELETE
         *
         * @param body
         * @returns {Object}
         */
        body: function(body) {
            if (body) {
                params.body = querystring.stringify(body);
                params.headers = {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': params.body.length
                };
            }
            return this;
        },

        /**
         * Set custom headers
         *
         * @param headers
         * @returns {*}
         */
        headers: function(headers) {
            if (headers) {
                params.headers = headers;
            }
            return this;
        },

        /**
         * Set expected HTTP status code
         *
         * @param status
         * @returns {*}
         */
        expect: function(status) {
            if (status) {
                expects.status = status;
            }
            return this;
        },

        /**
         * Check max response time, in ms
         *
         * @param time
         * @returns {*}
         */
        time: function(time) {
            if (time) {
                expects.time = new Date() + time;
            }
            return this;
        },

        /**
         * Final method, provide request
         *
         * @param callback
         */
        end: function(callback) {
            request(params, function(error, response, body) {
                if (error) {
                    callback(error, null);
                    return;
                }

                var res;

                if (expects.status) {
                    assert.equal(response.statusCode, expects.status, 'Error response status code!');
                }

                if (expects.time) {
                    var now = new Date();
                    assert.ok(now <= expects.time, 'Too long response time!');
                }

                if (body && lodash.isObject(body)) {
                    res = JSON.parse(body);
                } else {
                    res = body;
                }

                callback(error, res);
            });

        }
    };
};
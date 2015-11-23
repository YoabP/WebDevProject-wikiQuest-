'use strict';

var _ = require('lodash');
var Match = require('./match.model');

// Get list of matchs
exports.index = function(req, res) {
  Match.find(function (err, matchs) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(matchs);
  });
};

// Get a single match
exports.show = function(req, res) {
  Match.findById(req.params.id, function (err, match) {
    if(err) { return handleError(res, err); }
    if(!match) { return res.status(404).send('Not Found'); }
    return res.json(match);
  });
};

// Creates a new match in the DB.
exports.create = function(req, res) {
  Match.create(req.body, function(err, match) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(match);
  });
};

// Updates an existing match in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Match.findById(req.params.id, function (err, match) {
    if (err) { return handleError(res, err); }
    if(!match) { return res.status(404).send('Not Found'); }
    /*var updated = _.merge(match, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(match);
    });*/
    /* update fix
     * from: https://www.bountysource.com/issues/2987491-fixing-generator-endpoint-exports-update-save-function
     */
    _.extend(match, req.body);
    match.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(match);
    });
  });
};
// Updates an existing match in the DB. Oddly
exports.replace = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Match.findById(req.params.id, function (err, match) {
    if (err) { return handleError(res, err); }
    if(!match) { return res.status(404).send('Not Found'); }
      if(match.guests){delete match.guests;}
      _.extend(match, req.body);
      match.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(match);
    });
  });
};

// Deletes a match from the DB.
exports.destroy = function(req, res) {
  Match.findById(req.params.id, function (err, match) {
    if(err) { return handleError(res, err); }
    if(!match) { return res.status(404).send('Not Found'); }
    match.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}

/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var Thing = require('../api/thing/thing.model');
var Match = require('../api/match/match.model');
Match.find({}).remove(function() {
  Match.create({
    creator : 'Juan',
    started : false,
    ended: false,
    guests: ['Mercurio', 'Venus', 'Tierra', 'Marte', 'Jupiter','Saturno']
  }, {
    creator : 'KOKO',
    started : false,
    ended: false,
    guests: ['Mercurio', 'Venus', 'Tierra', 'Marte', 'Jupiter','Saturno']
  },{
    creator : 'JULIO',
    started : false,
    ended: false,
    guests: ['Mercurio', 'Venus', 'Tierra', 'Marte', 'Jupiter','Saturno']
  },{
    creator : 'Name',
    started : false,
    ended: false,
    guests: ['Mercurio', 'Venus', 'Tierra', 'Marte', 'Jupiter','Saturno']
  },{
    creator : 'Fake',
    started : false,
    ended: false,
    guests: ['Mercurio', 'Venus', 'Tierra', 'Marte', 'Jupiter','Saturno']
  },{
    creator : 'Semilla',
    started : false,
    ended: false,
    guests: ['Mercurio', 'Venus', 'Tierra', 'Marte', 'Jupiter','Saturno']
  });
});

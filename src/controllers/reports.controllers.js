const reportsCtrl = {};

const Publication = require('../models/publications')
const User = require('../models/User')
const Autor = require('../models/autor')
const ISSN = require('../models/ISSN')
const path = require('path');
const multer = require('multer');
const uuid = require('uuid/v4');
const fs = require('fs');
const moment = require('moment');
var {Types} = require('mongoose');
const { query } = require('express');
let {ObjectId} = Types



module.exports = reportsCtrl;
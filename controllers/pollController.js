const Poll = require("./../models/pollModel");
const factory = require("./handlerFactory");

exports.getAllPolls = factory.getAll(Poll);
exports.queryAllPolls = factory.queryAll(Poll);
exports.getPoll = factory.getOne(Poll);
exports.createPoll = factory.createOne(Poll);
exports.updatePoll = factory.updateOne(Poll);
exports.deletePoll = factory.deleteOne(Poll);

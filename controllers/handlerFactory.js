const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const APIFeatures = require("./../utils/apiFeatures");

exports.deleteOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    res.status(204).json({
      status: "success",
      data: null
    });
  });

exports.updateOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        data: doc
      }
    });
  });

exports.createOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        data: doc
      }
    });
  });

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    if (!doc) {
      // return next(new AppError("No document found with that ID", 404));
      res.status(200).json({
        status: "success",
        data: {
          data: {
            name: "DELETED",
            question: "DELETED",
            options: ["DELETED"]
          }
        }
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        data: doc
      }
    });
  });

exports.getAll = Model =>
  catchAsync(async (req, res, next) => {
    // To allow for nested GET reviews on tour (hack)
    let filter = {};
    if (req.params.pollId) filter = { poll: req.params.pollId };

    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    // const doc = await features.query.explain();
    const doc = await features.query;

    // SEND RESPONSE
    res.status(200).json({
      status: "success",
      results: doc.length,
      data: {
        data: doc
      }
    });
  });

exports.queryAll = Model =>
  catchAsync(async (req, res, next) => {
    let query = Model.find({ tags: req.body.tag });
    const doc = await query;
    res.status(200).json({
      status: "success",
      results: doc.length,
      data: {
        data: doc
      }
    });
  });

exports.filterAll = Model =>
  catchAsync(async (req, res, next) => {
    let obj = req.body.query;
    Object.keys(obj).forEach(category => {
      if (category === "Salary" || category === "Weight") {
        const lower = obj[category][0];
        const higher = obj[category][1];
        obj[category] = {
          $gte: lower,
          $lte: higher
        };
      }
      if (category === "Birthday") {
        const lower =
          Date.now() - (obj[category][0] + 0.999) * 365 * 24 * 60 * 60 * 1000;
        const higher =
          Date.now() - (obj[category][1] + 0.999) * 365 * 24 * 60 * 60 * 1000;
        obj[category] = {
          $gte: higher,
          $lte: lower
        };
      }
      if (category === "Height") {
        const lower = obj[category][0] * 12 + obj[category][1];
        const higher = obj[category][2] * 12 + obj[category][3];
        obj[category] = {
          $gte: lower,
          $lte: higher
        };
      }
      if (category === "_id") {
        const arr = obj[category];
        obj[category] = {
          $in: arr
        };
      }
    });
    let query = Model.find(req.body.query);
    const doc = await query;
    res.status(200).json({
      status: "success",
      results: doc.length
    });
  });

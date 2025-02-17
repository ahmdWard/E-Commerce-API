const catchAsync = require("../middleware/catchAsync");
const AppError = require("../utils/appError");
const ApiFeatures = require("../utils/apiFeatures");
const { Model } = require("mongoose");


exports.createOne = (Model)=>
     catchAsync(async(req,res)=>{

        const newDocument = await Model.create(req.body)

        res.status(201).json({
            status:"success",
            data:{
                newDocument
            }
        })
    })


exports.getOne = (Model,populateOption)=>
     catchAsync(async(req,res,next)=>{

        const {id} = req.params
        let query = Model.findById(id)

        if (populateOption){
            query.populate(populateOption)
        }

        const document = await query
        if(!document)
            return next(new AppError(
        'no document found',404
            ))
        
            res.status(200).json({
                status:"success",
                data:{
                    document
                }
            })
    })


exports.getAll = (Model, modelName="")=>
     catchAsync(async(req,res)=>{

     const documentCounts = await Model.countDocuments();
     const apiFeatures = new ApiFeatures(Model.find(), req.query)
      .filter()
      .search(modelName)
      .sort()
      .limitFields()
      .paginate(documentCounts);
 
      const {moongoseQuery, paginationResult} = apiFeatures

      const document = await moongoseQuery;

      res.status(200).json({
        status:"success",
        length:document.length,
        paginationResult,
        data:{
            document
        }
      })

    })


exports.deleteOne = (Model) =>
    catchAsync(async (req, res, next) => {
      const { id } = req.params;
      const document = await Model.findByIdAndDelete(id);
      if (!document) {
        return next(new AppError(`No document found `, 404));
      }
      
      res.status(204).send();
    });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const document = await Model.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators:true
    });
    if (!document) {
      return next(new AppError(`No document found for this id: ${id}`, 404));
    }

    res.status(200).json({ data: document });
  });

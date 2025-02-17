const { modelName, countDocuments } = require("../models/userModel")

class ApiFeatures{
       
    constructor(moongoseQuery, queryString){

        this.moongoseQuery=moongoseQuery
        this.queryString=queryString
    }

    filter(){
        const queryStringObj={...this.queryString}
        const execludsFields=["page","sort","keyword","fields","limits"]
        execludsFields.forEach((field)=>{
              delete queryStringObj[field]
        })
       
        let queryStr = JSON.stringify(queryStringObj)
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g,(match)=>`$${match}`)
        this.moongoseQuery = this.moongoseQuery.find(JSON.parse(queryStr))                
        return this;
    }

    sort(){
        if(this.queryString.sort){

            const sortby = this.queryString.sort.split(',').join(' ')
            this.moongoseQuery = this.moongoseQuery.sort(sortby)
        } else {
              this.moongoseQuery = this.moongoseQuery.sort('-createdAt')
        }
        return this

    }

    limitFields(){
          if (this.queryString.fields){
            const fields = this.queryString.fields.split(',').join (" ")
            this.moongoseQuery = this.moongoseQuery.select(fields)
          }else{
            this.moongoseQuery = this.moongoseQuery.select('-__v')
          }
          return this
    }

    paginate(countDocuments){

        const page = this.queryString.page * 1 || 1;
        const limit = 50;

        const limitValue = this.queryString.limit || this.queryString["limit "];

        if(limitValue){
            limit = parseInt(limitValue.toString().trim(),10) || 50;
        }

        const skip = (page - 1) * limit
        const endIndex = page * limit

        const pagination = {}
        pagination.currentPage = page
        pagination.limit = limit
        pagination.numberOfPages = Math.ceil(countDocuments / limit);
            
        if(endIndex < countDocuments){
            pagination.next = page++;
        }

        if(skip > 0){
            pagination.previous = page--;
        }

        this.moongoseQuery = this.moongoseQuery.skip(skip).limit(limit)
        this.pagination = pagination 
        return this
    
    }

    search(){
        if(this.queryString.keyword){

            const query = {}
            
                
                query.$or = [
                    {
                        name:{$regex:this.queryString.keyword,$options:'i'},
                        slug:{$regex:this.queryString.keyword,$options:'i'},
                    }
                ]
            
            this.moongoseQuery = this.moongoseQuery.find(query)
            console.log(this);
            
        }
        return this
    }

}
module.exports = ApiFeatures
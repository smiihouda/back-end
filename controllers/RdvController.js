var responsRender = require("../middleware/responseRender");
var rdvEntity = require("../Entities/RDV");

var mapper = require("automapper-js");
var ServerMessage = require("../constant/messages");
var ServerErrors = require("../constant/errors");
var Joi = require("@hapi/joi");
var uuid = require("uuid/v4");
var database = require("../data/DBconnect");

var rdvDataAccess = require("../data/RDVDataAccess")
var bcrypt = require("bcrypt");
var roles = require("../constant/appRoles");
var decoder = require("../tools/AuthorizationDecode")


module.exports = {
   
  
    addrdv: (rq, rs, nx) => {
      let RdvModel = mapper(rdvEntity, rq.body);
      const schema = Joi.object().keys({
            Id: Joi.string().optional().allow(""),
            Firstname: Joi.string().required().max(30).min(3).regex(/^[a-zA-Z_ ]+$/),
            Lastname: Joi.string().required().min(3) .max(30).regex(/^[a-zA-Z_ ]+$/),
            date: Joi.date().required(),
            
            Email: Joi.string().email({
              minDomainSegments: 2
            }).required().max(50),
            Type: Joi.string().required(),
            message: Joi.string().required(),
            State: Joi.boolean().optional().allow(""),
            CreatedAt: Joi.string().optional().allow(""),
            UpdatedAt: Joi.string().optional().allow("")
      });
  
      const {
        error,
        value
      } = Joi.validate(rq.body, schema);
  
      if (error != null) {
        return rs
          .status(400)
          .json(responsRender(error, ServerErrors.INVALID_DATA, ""));
      }
         
          RdvModel.Id = uuid()
            database.connectToDb()
            rdvDataAccess.AddRdv(RdvModel, (err, rdv) => {
              database.disconnect();
              if (err) {
                return rs.status(500).json(responsRender(err, ServerErrors.SERVER_ERROR, ""))
              }else {
                if (rdv) {
              return rs.status(200).json(responsRender(rdv, "", ServerMessage.OK))
                }}
            })
         
     
    },

    getAllRdv:(rq,rs,nx)=>{
        let token = rq.headers.authorization.split(" ")[1];
        let Id = decoder.getSubject(token)
        database.connectToDb()
        rdvDataAccess.ListByPsy(Id,(err,rdvList)=>{
          database.disconnect()
          if (err) {
            return rs.status(500).json(responsRender(null, ServerErrors.SERVER_ERROR, ""))
          }if(rdvList){
            return rs.status(200).json(responsRender(rdvList,"",ServerMessage.OK))
          }
        })
      },
}
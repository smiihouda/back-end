 class RDV {
     constructor() {
             this.Id = "",
             this.Firstname = "",
             this.Lastname = "",
             this.date = new Date(),
             this.PsyId = "",
             this.PassId = "",
             this.Email = "",
             this.Type = "",
             this.message="",
             this.State = false,
             this.CreatedAt = new Date(),
             this.UpdatedAt = new Date()
     }
 }
 module.exports = RDV;
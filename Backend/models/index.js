const User = require("./User")
const OrganisationModel = require("./OrganisationModel.js")
const BusinessUnit = require("./BusinessUnitModel.js")
const Department = require("./DepartmentModel.js")
const Country = require("./CountryModel.js")
const State = require("./StateModel.js")
const District = require("./DistrictModel.js")
const City = require("./CityModel.js")
const TimeZone = require("./TimeZoneModel.js")
const Designation = require("./employee_master/DesignationModel.js")
const Role = require("./employee_master/RoleModel.js")
const Prefix = require("./employee_master/PrefixModel.js")
const Nationality = require("./employee_master/NationalityModel.js")
const Language = require("./employee_master/LanguageModel.js")
const Education = require("./employee_master/EducationModel.js")
const Course = require("./employee_master/CourseModel.js")
const GovernmentID = require("./employee_master/GovernmentidModel.js")
const Currency = require("./employee_master/CurrencyModel.js")
const Allowance = require("./employee_master/AllowanceModel.js")
const Deduction = require("./employee_master/DeductionModel.js")

module.exports = {
    User,OrganisationModel,BusinessUnit,Department,Country,State,City,District,TimeZone,Designation,Role,Prefix,Nationality,Language,Education,Course,GovernmentID,
    Currency,Allowance,Deduction
   
}
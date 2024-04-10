const router = require("express").Router()
const userRoute = require("./users")
const OrganisationRoute = require("./Organisation")
const BusinessUnitRoute = require("./BusinessUnit")
const DepartmentRouter = require("./DepartmentRouter")
const CountryRouter = require("./CountryRouter")
const StateRouter = require("./StateRouter")
const DistrictRouter = require("./DistrictRouter")
const CityRouter = require("./CityRouter")
const TimeZoneRouter = require("./TimeZoneRouter")
const DesignationRouter = require("./employee_master/DesignationRouter")


router.use("/user", userRoute);
router.use("/organisations", OrganisationRoute)
router.use("/businessunit", BusinessUnitRoute)
router.use("/department", DepartmentRouter)
router.use("/country", CountryRouter)
router.use("/state", StateRouter)
router.use("/district", DistrictRouter)
router.use("/city", CityRouter)
router.use("/timezone", TimeZoneRouter)
router.use("/designation", DesignationRouter)



module.exports = router
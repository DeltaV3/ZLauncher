const { DistributionAPI } = require('helios-core/common')

const ConfigManager = require('./configmanager')

const constants = require('../../config/constants')

const api = new DistributionAPI(
    ConfigManager.getLauncherDirectory(),
    null, // Injected forcefully by the preloader.
    null, // Injected forcefully by the preloader.
    constants.DISTRIBUTION_URL,
    false
)

exports.DistroAPI = api
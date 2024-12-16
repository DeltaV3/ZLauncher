const got = require('got')
const { DISTRIBUTION_META_URL, DEFAULT_SERVER_META, DEFAULT_DISTRIBUTION_META } = require('../../config/constants')

class Config {
    constructor(data) {
        this.data = data
    }

    /** @param {string} key */
    get(key) {
        return this.data[key]
    }

    /**
     * @param {string} key
     * @param {any} defaultValue
     */
    getOrDefault(key, defaultValue) {
        return this.data[key] || defaultValue
    }

    /** @param {string} serverId */
    getServerById(serverId) {
        const servers = this.data.servers || []
        const server = servers.find(server => server.id === serverId)
        if (server) {
            return new Config({ ...DEFAULT_SERVER_META, ...server })
        }
        return new Config(DEFAULT_SERVER_META)
    }

    getRaw() {
        return this.data
    }
}

class DistroMetaManager {
    /** @type {Config | null}*/
    config = null

    constructor() {
        if (DistroMetaManager.instance) {
            return DistroMetaManager.instance
        }

        DistroMetaManager.instance = this
    }

    /** @return {Promise<Config>} */
    async fetch() {
        try {
            const response = await got(DISTRIBUTION_META_URL)
            const fetchedData = JSON.parse(response.body)
            const config = new Config({ ...DEFAULT_DISTRIBUTION_META, ...fetchedData })
            this.config = config
            return config
        } catch (error) {
            console.error('Error fetching DistroMetaManager:', error)
            return this.getOrDefault()
        }
    }

    getInstance() {
        if (!DistroMetaManager.instance) {
            throw new Error('DistroMetaManager has not been initialized. Call the constructor first.')
        }

        return DistroMetaManager.instance
    }

    /** @return {Config | null} */
    get() {
        return this.config
    }

    /** @return {Config} */
    getOrDefault() {
        return this.config ?? new Config(DEFAULT_DISTRIBUTION_META)
    }
}

exports.DistroMetaAPI = new DistroMetaManager()
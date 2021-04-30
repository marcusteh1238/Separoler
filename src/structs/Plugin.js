class Plugin {

    /**
     * plugin struct options.
     * @param {{name: string, handle: Function, aliases: string[], cooldowns: [number, number]}} pluginOptions 
     */
    constructor({
        name,
        handle,
        aliases = [],
        cooldowns = [3, 3]
    }) {
        this.name = name;
        this.handle = handle;
        this.aliases = aliases;
        this.cooldowns = cooldowns;
    }
}

module.exports = Plugin;

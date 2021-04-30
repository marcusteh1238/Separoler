class Plugin {

    /**
     * plugin struct options.
     * @param {{name: string, handle: Function, aliases: string[], cooldowns: [number, number], noDMs: boolean}} pluginOptions 
     */
    constructor({
        name,
        handle,
        aliases = [],
        cooldowns = [3, 3],
        noDMs = true
    }) {
        this.name = name;
        this.handle = handle;
        this.aliases = aliases;
        this.cooldowns = cooldowns;
        this.noDMs = noDMs;
    }
}

module.exports = Plugin;

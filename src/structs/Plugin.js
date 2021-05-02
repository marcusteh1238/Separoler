class Plugin {

    /**
     * plugin struct options.
     * @param {{name: string, handle: Function, type, aliases: string[], help: {description: string, usage: string, examples: string[][]}, cooldowns: [number, number], noDMs: boolean}} pluginOptions 
     */
    constructor({
        name,
        handle,
        help,
        type,
        aliases = [],
        cooldowns = [3, 3],
        noDMs = true
    }) {
        if (!help) {
            const usage = `s!${name}`
            // eslint-disable-next-line no-param-reassign
            help = {
                description: "Sorry, this plugin does not have any help information yet.",
                usage,
                examples: [[usage, "Activates this plugin."]]
            }
        }
        this.name = name;
        this.type = type;
        this.handle = handle;
        this.help = help;
        this.aliases = aliases;
        this.cooldowns = cooldowns;
        this.noDMs = noDMs;
    }
}

module.exports = Plugin;

export default class Parser {
    constructor();
    parse(str: string): object[];
    /**
     * Removes "/**", " * " and "*\/"
     */
    private removeNotNecessary;
    /**
     * Parse Classes
     * @param str
     */
    private normalizeClasses;
    private getArguments;
}

export default class EntityParser {
    private codeParser;
    /**
     * Returns AST
     * @param code
     */
    parse(code: any): any;
    getNamespace(ast: any): any;
    getClass(astNamespaceNode: any): any;
    getLeadingComment(classNode: any): {
        leadingComment: any;
    } | null;
}

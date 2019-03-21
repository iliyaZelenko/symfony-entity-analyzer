export default class FilesFinder {
    private entityParser;
    private leadingCommentParser;
    find(): Promise<({
        path: string;
        ast: any;
        code: any;
        namespace: any;
        className: any;
        fullNamespace: string;
        leadingComment: any;
        entityAnnotationArguments: any;
        tableAnnotationArguments: any;
        relations: any[];
    } | undefined)[]>;
    private findPaths;
    /**
     * Алгоритм поиска энтити:
     * - должен иметь namespace
     * - должен быть классом (не интерфейсом, не трейтом и т.д.)
     * - должен содержан коммент класса (leadingComment)
     * - в leadingComment должно быть указано что это энтити (@ORM\Entity аннотация)
     */
    private findCorrectEntity;
    private getRelations;
    private getParsedEntityData;
    private normalizeByRelation;
}



export class UserConfiguration {
    private data = {}
    
    constructor(configurationRoot) {
        this.extractData(configurationRoot);
    }

    private extractData(configurationRoot) {
        if ("fields" in configurationRoot) {
            for(let field of configurationRoot.fields){
                this.data[field.namespace_key] = field.value;
            }
        }

        if ("children_nodes" in configurationRoot) {
            for(let childNode of configurationRoot.children_nodes) {
                this.extractData(childNode);
            }
        }
    }

    getValue(key: string) {
        if(key in this.data) {
            return this.data[key];
        }
        return undefined;
    }
}
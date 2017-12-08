

export class UserConfiguration {
    private data = {}
    constructor(configurationRoot) {
        
    }

    private extractData(configurationRoot) {
        for(let field of configurationRoot.fields){
            this.data[field.namespace_key] = field.value;
        }
        for(let childNode of configurationRoot.child_nodes) {
            this.extractData(childNode);
        }
    }

    getValue(key: string) {
        if(key in this.data) {
            return this.data[key];
        }
        return undefined;
    }
}
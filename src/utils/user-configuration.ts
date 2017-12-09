import { TranslateService } from "@ngx-translate/core";



export class UserConfiguration {
    private data = {}

    public language = "en";
    public timezone = "Europe/Madrid";
    public dateFormat = "";
    
    constructor(configurationRoot, private translate: TranslateService) {
        this.extractData(configurationRoot);
        this.refreshUserConfig();

        this.language = this.getValue("dia_config__language");
        this.timezone = this.getValue("dia_config__timezone");
        this.dateFormat = this.getValue("dia_config__date_format");
    }

    updateValues(data) { // namespace_keys and values
        for(let key in data){
            this.data[key] = data[key];
        }
        this.refreshUserConfig();
    }

    private refreshUserConfig(){
        this.translate.use(this.getValue("dia_config__language"));
        this.translate.setDefaultLang(this.getValue("dia_config__language"));

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

    private getValue(key: string) {
        if(key in this.data) {
            return this.data[key];
        }
        return undefined;
    }

}
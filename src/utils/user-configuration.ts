import { TranslateService } from "@ngx-translate/core";
import * as moment from 'moment-timezone';


export class UserConfiguration {
    private translate: TranslateService
    private data = {}

    static LANGUAGE = "dia_config__language";
    static TIMEZONE = "dia_config__timezone";
    static DATE_FORMAT = "dia_config__date_format";

    constructor() {}

    injectDependencies(configurationRoot, translate: TranslateService) {
        this.extractData(configurationRoot);
        this.translate = translate;
        this.refreshUserConfig();
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
        moment.locale(this.getValue("dia_config__language"));
        moment.tz.setDefault(this.getValue("dia_config__timezone"));
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

    public getValue(key: string) {
        if(key in this.data) {
            return this.data[key];
        }
        return undefined;
    }


    /* Helper methods */

    public utcSecondsToMoment(seconds: number){
        return moment.tz(seconds * 1000, "UTC");
    }

    public formatDate(seconds) {
        let m = this.utcSecondsToMoment(seconds).tz(this.getValue(UserConfiguration.TIMEZONE));
        let dateFormat = this.getValue(UserConfiguration.DATE_FORMAT);
        if (dateFormat === 'DD/MM/YYYY') {
            return m.format("DD/MM/YYYY");
        } else {
            return m.format("MM/DD/YYYY");
        }
    }

    public formatDateTime(seconds) {
        let m = this.utcSecondsToMoment(seconds).tz(this.getValue(UserConfiguration.TIMEZONE));
        let dateFormat = this.getValue(UserConfiguration.DATE_FORMAT);
        if (dateFormat === 'DD/MM/YYYY') {
            return m.format("DD/MM/YYYY HH:mm:ss");
        } else {
            return m.format("MM/DD/YYYY HH:mm:ss");
        }
    }
}
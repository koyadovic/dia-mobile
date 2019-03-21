

export class DiaMessage {
    title: string;
    type: "success" | "warning" | "error";
    message: string;
    constructor(title, type, message) {
        this.title = title;
        this.type = type;
        this.message = message;
    }
}
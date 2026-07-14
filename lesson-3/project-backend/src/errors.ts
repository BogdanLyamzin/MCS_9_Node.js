export class NotFoundError extends Error {
    status: number;
    
    constructor(message: string) {
        super(message);
        this.name = "NotFound Error";
        this.status = 404;
    }
}

export class ValidationError extends Error {
    status: number;
    
    constructor(message: string) {
        super(message);
        this.name = "Validation Error";
        this.status = 400;
    }
}
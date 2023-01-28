import { Column, Entity, PrimaryColumn } from "typeorm";
import crypto from "crypto";

@Entity()
export class Test {
    @PrimaryColumn()
    id: string;
    
    @Column()
    message: string;
    
    constructor(message: string) {
        this.id = crypto.randomBytes(16).toString("hex");
        this.message = message;
    }
}
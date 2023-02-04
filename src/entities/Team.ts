import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { Player } from "./Player";

@Entity()
export class Team {
    @PrimaryColumn()
    name: string;

    @Column("text", { array: true })
    abbreviations: string[];

    @OneToMany(() => Player, (player) => player.team, { nullable: true })
    players?: Player[];

    constructor(name: string, abbreviations: string[]) {
        this.name = name;
        this.abbreviations = abbreviations;
    }
}

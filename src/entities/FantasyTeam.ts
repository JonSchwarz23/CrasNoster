import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { Player } from "./Player";

@Entity()
export class FantasyTeam {
    @PrimaryColumn()
    acronym: string;

    @Column()
    name: string;

    @Column()
    owner: string;

    @OneToMany(() => Player, (player) => player.fantasyTeam, { nullable: true })
    players?: Player[];

    constructor(name: string, owner: string, acronym: string) {
        this.name = name;
        this.owner = owner;
        this.acronym = acronym;
    }
}

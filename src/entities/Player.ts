import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import { FantasyTeam } from "./FantasyTeam";
import { OffensiveProjectionValue, PitcherProjectionValue } from "./Projections";
import { Team } from "./Team";

@Entity()
export class Player {
    @PrimaryColumn()
    id: string;

    @Column()
    name: string;

    @ManyToOne(() => Team, (team) => team.players, { nullable: true })
    team: Team | null;

    @Column()
    position: string;

    @Column()
    rankOverall: number;

    @ManyToOne(() => FantasyTeam, (team) => team.players, { nullable: true })
    fantasyTeam: FantasyTeam | null;

    @Column()
    age: number;

    @Column({ type: "float" })
    salary: number;

    @Column({ type: "float" })
    contract: number;

    @Column({ nullable: true })
    fangraphsId?: string;

    @Column({ type: "int", nullable: true })
    impreciseFangraphsMatch?: number;

    @OneToMany(() => OffensiveProjectionValue, (value) => value.player, { nullable: true })
    offensiveProjectionValues?: OffensiveProjectionValue[];

    @OneToMany(() => PitcherProjectionValue, (value) => value.player, { nullable: true })
    pitcherProjectionValues?: PitcherProjectionValue[];

    constructor(
        id: string,
        name: string,
        team: Team | null,
        position: string,
        rankOverall: number,
        fantasyTeam: FantasyTeam | null,
        age: number,
        salary: number,
        contract: number
    ) {
        this.id = id;
        this.name = name;
        this.team = team;
        this.position = position;
        this.rankOverall = rankOverall;
        this.fantasyTeam = fantasyTeam;
        this.age = age;
        this.salary = salary;
        this.contract = contract;
    }
}

import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Player } from "./Player";
import { randomUUID } from "crypto";

@Entity()
export class OffensiveProjectionValue {
    @PrimaryColumn()
    id: string;

    @Column()
    source: string;

    @Column({ type: "float" })
    avg: number;

    @Column({ type: "float" })
    rbi: number;

    @Column({ type: "float" })
    sb: number;

    @Column({ type: "float" })
    ops: number;

    @Column({ type: "float" })
    tb: number;

    @Column({ type: "float" })
    beforePositionalAdjustment: number;

    @Column({ type: "float" })
    positionalAdjustment: number;

    @Column({ type: "float" })
    total: number;

    @ManyToOne(() => Player, (player) => player.offensiveProjectionValues, { nullable: true })
    player: Player | null;

    constructor(
        source: string,
        avg: number,
        rbi: number,
        sb: number,
        ops: number,
        tb: number,
        beforePositionalAdjustment: number,
        positionalAdjustment: number,
        total: number,
        player: Player | null = null
    ) {
        this.id = randomUUID();
        this.source = source;
        this.avg = avg;
        this.rbi = rbi;
        this.sb = sb;
        this.ops = ops;
        this.tb = tb;
        this.beforePositionalAdjustment = beforePositionalAdjustment;
        this.positionalAdjustment = positionalAdjustment;
        this.total = total;
        this.player = player;
    }
}

@Entity()
export class PitcherProjectionValue {
    @PrimaryColumn()
    id: string;

    @Column()
    source: string;

    @Column({ type: "float" })
    era: number;

    @Column({ type: "float" })
    whip: number;

    @Column({ type: "float" })
    k: number;

    @Column({ type: "float" })
    qs: number;

    @Column({ type: "float" })
    svhld: number;

    @Column({ type: "float" })
    beforePositionalAdjustment: number;

    @Column({ type: "float" })
    positionalAdjustment: number;

    @Column({ type: "float" })
    total: number;

    @ManyToOne(() => Player, (player) => player.offensiveProjectionValues, { nullable: true })
    player: Player | null;

    constructor(
        source: string,
        era: number,
        whip: number,
        k: number,
        qs: number,
        svhld: number,
        beforePositionalAdjustment: number,
        positionalAdjustment: number,
        total: number,
        player: Player | null = null
    ) {
        this.id = randomUUID();
        this.source = source;
        this.era = era;
        this.whip = whip;
        this.k = k;
        this.qs = qs;
        this.svhld = svhld;
        this.beforePositionalAdjustment = beforePositionalAdjustment;
        this.positionalAdjustment = positionalAdjustment;
        this.total = total;
        this.player = player;
    }
}

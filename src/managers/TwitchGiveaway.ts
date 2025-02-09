import { v4 as uuidv4 } from 'uuid';

export type TwitchGiveawayOptions = {
    keyword: string;
    caseSensitive: boolean;
};

export type TwitchGiveawayParticipant = {
    userId: string;
    username: string;
    subLength: number;
    isVip: boolean;
    isMod: boolean;
    canBeDrawn: boolean;
};

export type TwitchGiveawayFilter = {
    minSubLength: number;
    maxSubLength: number;
    canDrawRegulars: boolean;
    canDrawVips: boolean;
    canDrawMods: boolean;
};

export type TwitchAdditionalOptions = {
    subMultiplier: number;
    vipMultiplier: number;
    modMultiplier: number;
};

export type TwitchGiveawaySnapshot = {
    options: TwitchGiveawayOptions;
    participants: TwitchGiveawayParticipant[];
};

export type TwitchUserWinner = {
    // Unique ID for the draw
    drawId: string;
    timestamp: string;

    // User ID of the winner
    userId: string;
    user: TwitchGiveawayParticipant;
    twitchUser: any; // Twitch User Object
    
    // Snapshot of state at the time of the draw
    snapshot: TwitchGiveawaySnapshot;
};

export default class TwitchGiveaway {
    private readonly id: string;
    private participants: TwitchGiveawayParticipant[] = [];

    constructor(private options: TwitchGiveawayOptions) {
        this.id = uuidv4();
    }

    addParticipant(
        participant: Omit<TwitchGiveawayParticipant, 'canBeDrawn'>,
    ): void {
        if (this.participants.find((p) => p.userId === participant.userId))
            return;
        this.participants.push({
            ...participant,
            canBeDrawn: true,
        });
    }

    setCanBeDrawn(userId: string, canBeDrawn: boolean): void {
        const participant = this.participants.find((p) => p.userId === userId);
        if (!participant) return;
        participant.canBeDrawn = canBeDrawn;
    }

    drawWinner(
        filter: TwitchGiveawayFilter,
        additionalOptions: TwitchAdditionalOptions,
    ): TwitchUserWinner | null {
        const drawId = uuidv4();
        const timestamp = new Date().toISOString();

        const snapshot = this.getSnapshot();
        const filteredParticipants = TwitchGiveaway.FilterParticipants(snapshot.participants, filter);
        const participantLines : string[][] = filteredParticipants.map((p) => {
            const line = TwitchGiveaway.ParticipantToLine(p);
            const multiplier = TwitchGiveaway.GetMultiplier(p, additionalOptions);
            return Array(multiplier).fill(line);
        });
        const lines = participantLines.flat();
        const allLines = lines.join('\n');
        const hash = require('crypto').createHash('sha256').update(allLines).digest('hex');
        const numberFromHash = parseInt(hash, 16);
        const winnerIndex = numberFromHash % lines.length;
        const winnerLine = lines[winnerIndex];
        const winnerId = TwitchGiveaway.LineToParticipantId(winnerLine);
        const winner = snapshot.participants.find((p) => p.userId === winnerId);
        if(!winner) throw new Error('Winner not found');
        return {
            drawId,
            timestamp,
            snapshot,
            userId: winner.userId,
            user: winner,
            twitchUser: null,
        };
    }

    private getSnapshot(): TwitchGiveawaySnapshot {
        return {
            options: this.options,
            participants: this.participants,
        };
    }

    private static FilterParticipants(
        participants: TwitchGiveawayParticipant[],
        filter: TwitchGiveawayFilter,
    ): TwitchGiveawayParticipant[] {
        return participants.filter((p) => {
            if (p.canBeDrawn == false) return false;
            if (p.subLength < filter.minSubLength) return false;
            if (p.subLength > filter.maxSubLength) return false;
            if (
                filter.canDrawRegulars == false &&
                (p.isVip || p.isMod) == false
            )
                return false;
            if (filter.canDrawVips == false && p.isVip) return false;
            if (filter.canDrawMods == false && p.isMod) return false;
            return true;
        });
    }

    private static GetMultiplier(
        participant: TwitchGiveawayParticipant,
        additionalOptions: TwitchAdditionalOptions,
    ): number {
        let multiplier = 1;
        if (participant.isVip) multiplier *= additionalOptions.vipMultiplier;
        if (participant.isMod) multiplier *= additionalOptions.modMultiplier;
        if (participant.subLength > 0)
            multiplier *= additionalOptions.subMultiplier;
        return multiplier;
    }

    private static ParticipantToLine(
        participant: TwitchGiveawayParticipant,
    ): string {
        return `${participant.userId}:${participant.username}:${participant.subLength}`;
    }

    private static LineToParticipantId(line: string): string {
        const params = line.split(':');
        return params[0];
    }
}

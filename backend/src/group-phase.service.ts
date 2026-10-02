import { Injectable, HttpService } from '@nestjs/common';

@Injectable()
export class GroupPhaseService {
  private readonly gameApiUrl = process.env.GAME_API_URL; 
  private readonly myTeamId = process.env.TEAM_ID;

  constructor(private readonly httpService: HttpService) {}

  async getData(selectedGroupId?: string): Promise<any> {
    const headers = { 'Authorization': `Bearer ${process.env.GAME_API_TOKEN}` };

    let currentJourney;
    try {
      const journeyRes = await this.httpService.get(`${this.gameApiUrl}/teams/${this.myTeamId}/journeys/current`, { headers }).toPromise();
      currentJourney = journeyRes.data;
    } catch (e) {
      return { hasJourney: false, groups: [], playerGroupId: '', standings: [], matches: [] };
    }

    if (!currentJourney || currentJourney.status === 'NO_JOURNEY') {
      return { hasJourney: false, groups: [], playerGroupId: '', standings: [], matches: [] };
    }

    const [stagesRes, teamsRes] = await Promise.all([
      this.httpService.get(`${this.gameApiUrl}/teams/${this.myTeamId}/journeys/current/stages`, { headers }).toPromise(),
      this.httpService.get(`${this.gameApiUrl}/teams/${this.myTeamId}/journeys/current/teams`, { headers }).toPromise()
    ]);

    const stagesData = stagesRes.data;
    const teamsData = teamsRes.data;

    const playerGroup = stagesData.find((s: any) => s.type === 'GROUP' && s.teamIds.includes(this.myTeamId));
    const playerGroupId = playerGroup ? playerGroup.id : stagesData?.id;
    const activeGroupId = selectedGroupId || playerGroupId;

    const encountersRes = await this.httpService.get(
      `${this.gameApiUrl}/teams/${this.myTeamId}/journeys/current/encounters?stageId=${activeGroupId}`, 
      { headers }
    ).toPromise();
    
    const encountersData = encountersRes.data;
    const activeStage = stagesData.find((s: any) => s.id === activeGroupId);
    
    const standings = (activeStage?.standings || []).map((st: any) => {
      const teamMeta = teamsData.find((t: any) => t.id === st.teamId);
      return {
        position: st.position,
        teamId: st.teamId,
        teamName: teamMeta?.name || `Team ${st.teamId}`,
        isPlayerTeam: st.teamId === this.myTeamId,
        played: st.played,
        won: st.won,
        drawn: st.drawn,
        lost: st.lost,
        points: st.points,
        damageFor: st.damageFor,
        damageAgainst: st.damageAgainst,
        damageDifference: st.damageDifference,
        qualified: st.qualified
      };
    });

    const matches = encountersData.map((enc: any) => {
      const homeMeta = teamsData.find((t: any) => t.id === enc.homeTeamId);
      const awayMeta = teamsData.find((t: any) => t.id === enc.awayTeamId);
      return {
        encounterId: enc.id,
        stageId: enc.stageId,
        homeTeam: { id: enc.homeTeamId, name: homeMeta?.name || 'Unknown' },
        awayTeam: { id: enc.awayTeamId, name: awayMeta?.name || 'Unknown' },
        status: enc.status,
        winnerId: enc.winnerId,
        homeDamage: enc.homeDamage,
        awayDamage: enc.awayDamage
      };
    });

    const groups = stagesData.filter((s: any) => s.type === 'GROUP').map((s: any) => s.id);

    return { hasJourney: true, groups, playerGroupId, standings, matches };
  }
}

import { PostgresDB } from "@config/postgres.config";

export class SolicitantesQuerys {

    private postgres: PostgresDB = new PostgresDB();

    constructor() { }

    async obtener_solicitantes(estado: string) {
        const res: any = await this.postgres.function(`public.fnc_obtener_solicitantes($1)`, [JSON.stringify({ estado })])
        return res?.rows[0].fnc_obtener_solicitantes
    }
}
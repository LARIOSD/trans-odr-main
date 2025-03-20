import { PostgresDB } from "@config/postgres.config";

export class TiposServiciosQuerys {

    private postgres: PostgresDB = new PostgresDB();

    constructor() { }

    async obtener_tipos_servicios(estado: string) {
        const res: any = await this.postgres.function(`public.fnc_obtener_tipos_servicios($1)`, [JSON.stringify({ estado })])
        return res?.rows[0].fnc_obtener_tipos_servicios
    }
}
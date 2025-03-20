import { PostgresDB } from "@config/postgres.config";

export class TiposIdentificacionesQuerys {

    private postgres: PostgresDB = new PostgresDB();

    constructor() { }

    async obtener_tipos_identificaciones(estado: string) {
        const res: any = await this.postgres.function(`public.fnc_obtener_tipos_identificaciones($1)`, [JSON.stringify({ estado })])
        return res?.rows[0].fnc_obtener_tipos_identificaciones
    }
}
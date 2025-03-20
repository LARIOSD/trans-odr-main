import { PostgresDB } from "@config/postgres.config";

export class UsuariosQuerys {

    private postgres: PostgresDB = new PostgresDB();

    constructor() { }

    async insertar_actualizar_usuario(usuario: string) {
        const res: any = await this.postgres.procedure(`public.prc_insertar_actualizar_usuario('${usuario}', '{}')`)
        return res.rows[0].results
    }

    async buscar_usuario_id(params: string) {
        const res: any = await this.postgres.function(`public.fnc_buscar_usuario_id($1::json, '{}'::json)`, [params])
        return res?.rows[0].fnc_buscar_usuario_id
    }

    async buscar_usuarios(params: string) {
        const res: any = await this.postgres.function(`public.fnc_buscar_usuarios($1::json, '{}'::json)`, [params])
        return res?.rows[0].fnc_buscar_usuarios
    }
}
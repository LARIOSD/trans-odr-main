import { PostgresDB } from "@config/postgres.config";

export class ServiciosQuerys {

    private postgres: PostgresDB = new PostgresDB();

    constructor() { }

    async obtener_servicios(params: string) {
        const res: any = await this.postgres.function('public.fnc_obtener_servicios($1)', [params])
        return res?.rows[0].fnc_obtener_servicios
    }

    async obtener_servicios_filtrados(params: string) {
        const res: any = await this.postgres.function('public.fnc_obtener_servicios_filtro($1)', [params])
        return res?.rows[0].fnc_obtener_servicios_filtro
    }

    async insertar_actualizar_servicio(servicio: string) {
        const res: any = await this.postgres.procedure(`public.prc_insertar_actualizar_servicio('${servicio}', '{}')`)
        return res.rows[0].results
    }

    async inactivar_activar_detalle_servicio(parametros: string) {
        const res: any = await this.postgres.procedure(`public.inactivar_activar_detalle_servicio('${parametros}', '{}')`)
        return res?.rows[0].results
    }
    
    async aprobar_detalle_servicio(parametros: string) {
        const res: any = await this.postgres.procedure(`public.aprobar_detalle_servicio('${parametros}', '{}')`)
        return res?.rows[0].results
    }
}
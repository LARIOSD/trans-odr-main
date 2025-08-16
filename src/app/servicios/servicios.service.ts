import { BaseService } from "@common/bases/services.base";
import { ServiciosQuerys } from "./servicios.querys";
import { ServicioDto, } from "./servicios.dto";

export class ServiciosService extends BaseService<ServiciosQuerys> {
    constructor() {
        super(ServiciosQuerys);
    }

    async obtener_servicios(estado: string, usuario: string) {
        const params = JSON.stringify({ estado, usuario })

        const response = await this.query.obtener_servicios(params)
        return response
    }

    async obtener_servicios_filtrados(params: string) {

        const response = await this.query.obtener_servicios_filtrados(params)
        return response
    }

    async insertar_actualizar_servicio(servicio: ServicioDto) {
        // usuario.usuario_accion = 1

        // PARSEAR DATA A STRING PARA PROCEDURE
        const newUsuario = JSON.stringify(servicio)
        const response = await this.query.insertar_actualizar_servicio(newUsuario)

        return response
    }

    async inactivar_activar_detalle_servicio(id: string, estado: string) {
        const data = { id, estado }
        const parametros = JSON.stringify(data)

        const response = await this.query.inactivar_activar_detalle_servicio(parametros)

        return response
    }

    async aprobar_detalle_servicio(id: string, estado: string) {
        const data = { id, estado }
        const parametros = JSON.stringify(data)

        const response = await this.query.aprobar_detalle_servicio(parametros)

        return response
    }

}
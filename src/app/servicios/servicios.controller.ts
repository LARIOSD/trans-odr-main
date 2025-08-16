import { BaseController } from "@common/bases/controller.base";
import { ServiciosService } from "./servicios.service";
import { serverResponse } from "src/helpers/server-response";
import { REPONSES_CODES } from "@common/constants/constantes";
import { ServicioSchema } from "./servicios.dto";

export class ServiciosController extends BaseController<ServiciosService> {
    constructor() {
        super(ServiciosService);
    }

    async obtener_servicios(req: any, res: any) {
        const { estado, usuario } = req.query

        if (!estado) return serverResponse(res, { statusCode: REPONSES_CODES.BAD_REQUEST, message: 'No se ha encontrado el estado para la operación' })

        const response = await this.service.obtener_servicios(estado, req?.usuario?.id_usuario ?? usuario)

        return serverResponse(res, response)
    }

    async obtener_servicios_filtrados(req: any, res: any) {
        const { estado, conductor, fecha_inicio, fecha_final, fecha_registro_i, fecha_registro_f } = req.body


        if (!estado) return serverResponse(res, { statusCode: REPONSES_CODES.BAD_REQUEST, message: 'No se ha encontrado el estado para la operación' })

        const params = JSON.stringify({ estado, conductor, fecha_inicio, fecha_final, fecha_registro_i, fecha_registro_f })

        const response = await this.service.obtener_servicios_filtrados(params)

        return serverResponse(res, response)
    }

    async insertar_servicio(req: any, res: any) {
        const servicio = req.body

        const validate = ServicioSchema.safeParse(servicio)
        if (!validate.success) return serverResponse(res, { statusCode: REPONSES_CODES.BAD_REQUEST, message: validate.error.issues[0].message })

        servicio.usuario = req?.usuario?.id_usuario ?? 0

        const response = await this.service.insertar_actualizar_servicio(servicio)

        return serverResponse(res, response)
    }

    async inactivar_activar_detalle_servicio(req: any, res: any) {
        const { id } = req.params
        const { estado } = req.query

        if (!id) return serverResponse(res, { statusCode: REPONSES_CODES.BAD_REQUEST, message: 'No se ha encontrado el identificador del detalle', data: {} })

        const response = await this.service.inactivar_activar_detalle_servicio(id, estado)

        return serverResponse(res, response)
    }

    async aprobar_detalle_servicio(req: any, res: any) {
        const { id } = req.params
        const { estado } = req.query

        if (!id) return serverResponse(res, { statusCode: REPONSES_CODES.BAD_REQUEST, message: 'No se ha encontrado el identificador del detalle', data: {} })

        const response = await this.service.aprobar_detalle_servicio(id, estado)

        return serverResponse(res, response)
    }
}
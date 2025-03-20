import { BaseController } from "@common/bases/controller.base";
import { TiposIdentificacionesService } from "./tipos-identificaciones.service";
import { serverResponse } from "src/helpers/server-response";
import { REPONSES_CODES } from "@common/constants/constantes";
import { Request } from "express";

export class TiposIdentificacionesController extends BaseController<TiposIdentificacionesService> {
    constructor() {
        super(TiposIdentificacionesService);
    }

    async obtener_tipos_identificaciones(req: Request, res: any) {
        const { estado } = req.query as { estado: string }

        if (!estado) return serverResponse(res, { statusCode: REPONSES_CODES.BAD_REQUEST, message: 'No se ha encontrado el estado para la operación', data: [] })

        const response = await this.service.obtener_tipos_identificaciones(estado)

        return serverResponse(res, response)
    }
}
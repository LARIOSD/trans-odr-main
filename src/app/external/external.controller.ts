import { BaseController } from "@common/bases/controller.base";
import { ExternalService } from "./external.service";
import { serverResponse } from "src/helpers/server-response";
import { REPONSES_CODES } from "@common/constants/constantes";

export class ExternalController extends BaseController<ExternalService> {
    constructor() {
        super(ExternalService)
    }

    async GetMaps(req: any, res: any) {
        try {
            const params = { ...req.query } as { origin: string, destination:string }

            const response = await this.service.GetMaps(params.origin, params.destination);
            return serverResponse(res, { statusCode: 200, message: 'Exito', data: response})

        } catch (error) {
            return serverResponse(res, { statusCode: REPONSES_CODES.BAD_REQUEST, message: 'Ha ocurrido un error', data: {} })
            
        }        
    }
}

import { BaseService } from "@common/bases/services.base";
import { TiposIdentificacionesQuerys } from "./tipos-identificaciones.querys";

export class TiposIdentificacionesService extends BaseService<TiposIdentificacionesQuerys> {
    constructor() {
        super(TiposIdentificacionesQuerys);
    }

    async obtener_tipos_identificaciones(estado: string) {
        const response = await this.query.obtener_tipos_identificaciones(estado)

        return response
    }


}
import { BaseService } from "@common/bases/services.base";
import { TiposServiciosQuerys } from "./tipos-servicios.querys";

export class TiposServiciosService extends BaseService<TiposServiciosQuerys> {
    constructor() {
        super(TiposServiciosQuerys);
    }

    async obtener_tipos_servicios(estado: string) {
        const response = await this.query.obtener_tipos_servicios(estado)

        return response
    }


}
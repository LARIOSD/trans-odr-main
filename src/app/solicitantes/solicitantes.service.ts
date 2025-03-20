import { BaseService } from "@common/bases/services.base";
import { SolicitantesQuerys } from "./solicitantes.querys";

export class SolicitantesService extends BaseService<SolicitantesQuerys> {
    constructor() {
        super(SolicitantesQuerys);
    }

    async obtener_solicitantes(estado: string) {
        const response = await this.query.obtener_solicitantes(estado)

        return response
    }


}
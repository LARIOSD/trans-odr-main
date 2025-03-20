import { BaseRouter } from "@common/bases/router.base";
import { TiposIdentificacionesController } from "./tipos-identificaciones.controller";
import { sessionMiddleware } from "src/middlewares/session.middleware";

export class TiposIdentificacionesRouter extends BaseRouter<TiposIdentificacionesController> {

    constructor() {
        super(TiposIdentificacionesController, "parametros/tipos-identificaciones");
    }

    routes(): void {
        this.router.route(`/${this.subcarpeta}`)
            .get(sessionMiddleware, (req, res) => this.controller.obtener_tipos_identificaciones(req, res))
    }

}

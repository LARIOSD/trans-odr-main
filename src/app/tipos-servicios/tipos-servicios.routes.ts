import { BaseRouter } from "@common/bases/router.base";
import { TiposServiciosController } from "./tipos-servicios.controller";
import { sessionMiddleware } from "src/middlewares/session.middleware";

export class TiposServiciosRouter extends BaseRouter<TiposServiciosController> {

    constructor() {
        super(TiposServiciosController, "parametros/tipos-servicios");
    }

    routes(): void {
        this.router.route(`/${this.subcarpeta}`)
            .get(sessionMiddleware, (req, res) => this.controller.obtener_tipos_servicios(req, res))
    }

}

import { BaseRouter } from "@common/bases/router.base";
import { ServiciosController } from "./servicios.controller";
import { sessionMiddleware } from "src/middlewares/session.middleware";

export class ServiciosRouter extends BaseRouter<ServiciosController> {

    constructor() {
        super(ServiciosController, "servicios");
    }

    routes(): void {
        this.router.route(`/${this.subcarpeta}`)
            .get(sessionMiddleware, (req, res) => this.controller.obtener_servicios(req, res))
            .post(sessionMiddleware, (req, res) => this.controller.insertar_servicio(req, res))

        this.router.route(`/${this.subcarpeta}/detalle/:id`)
            .delete(sessionMiddleware, (req, res) => this.controller.inactivar_activar_detalle_servicio(req, res))

        this.router.route(`/${this.subcarpeta}/filtrar`)
            .post(sessionMiddleware, (req, res) => this.controller.obtener_servicios_filtrados(req, res))

    }

}

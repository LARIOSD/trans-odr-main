import { BaseRouter } from "@common/bases/router.base";
import { SolicitantesController } from "./solicitantes.controller";
import { sessionMiddleware } from "src/middlewares/session.middleware";

export class SolicitantesRouter extends BaseRouter<SolicitantesController> {

    constructor() {
        super(SolicitantesController, "solicitantes");
    }

    routes(): void {
        this.router.route(`/${this.subcarpeta}`)
            .get(sessionMiddleware, (req, res) => this.controller.obtener_solicitantes(req, res))
    }

}

import { BaseRouter } from "@common/bases/router.base";
import { UsuariosController } from "./usuarios.controller";
import { sessionMiddleware } from "src/middlewares/session.middleware";

export class UsuariosRouter extends BaseRouter<UsuariosController> {

    constructor() {
        super(UsuariosController, "configuracion/usuarios");
    }

    routes(): void {
        this.router.route(`/${this.subcarpeta}`)
            .post(sessionMiddleware, (req, res) => this.controller.insertar_usuario(req, res))
            .get(sessionMiddleware, (req, res) => this.controller.buscar_usuarios(req, res))
    }

}

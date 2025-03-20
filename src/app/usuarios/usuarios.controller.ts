import { BaseController } from "@common/bases/controller.base";
import { UsuariosService } from "./usuarios.service";
import { serverResponse } from "src/helpers/server-response";
import { REPONSES_CODES } from "@common/constants/constantes";
import { UsuarioSchema } from "./usuarios.dto";

export class UsuariosController extends BaseController<UsuariosService> {
    constructor() {
        super(UsuariosService);
    }

    async insertar_usuario(req: any, res: any) {
        const usuario = req.body

        const validate = UsuarioSchema.safeParse(usuario)
        if (!validate.success) return serverResponse(res, { statusCode: REPONSES_CODES.BAD_REQUEST, message: validate.error.issues[0].message })

        const response = await this.service.insertar_actualizar_usuario(usuario)

        return serverResponse(res, response)
    }

    async buscar_usuarios(req: any, res: any) {
        const { perfil } = req.query

        const params = { perfil }

        const response = await this.service.buscar_usuarios(params)

        return serverResponse(res, response)
    }
}
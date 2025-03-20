import { AuthRouter } from "./auth/auth.routes";
import { ServiciosRouter } from "./servicios/servicios.routes";
import { SolicitantesRouter } from "./solicitantes/solicitantes.routes";
import { TiposIdentificacionesRouter } from "./tipos-identificaciones/tipos-identificaciones.routes";
import { TiposServiciosRouter } from "./tipos-servicios/tipos-servicios.routes";
import { UsuariosRouter } from "./usuarios/usuarios.routes";

export const ROUTES = [
    new AuthRouter().router,
    new TiposServiciosRouter().router,
    new TiposIdentificacionesRouter().router,
    new SolicitantesRouter().router,
    new UsuariosRouter().router,
    new ServiciosRouter().router,
]

import z from "zod";

export interface UsuarioDto {
    id_usuario: number;
    nombres: string;
    apellidos: string;
    usuario: string;
    correo: string;
    clave: string;
    id_estado: number;
    id_empresa: number;
    perfil: number
}

export const UsuarioSchema = z.object({
    id_usuario: z.number({
        required_error: "Debe ingresar un identificador del usuario",
        invalid_type_error: "El identificador del usuario debe ser un número",
    }).optional(),
    nombres: z.string({
        required_error: "Debe ingresar un nombre valido",
        invalid_type_error: "El nombre debe ser texto",
    }),
    apellidos: z.string({
        required_error: "Debe ingresar un apellido valido",
        invalid_type_error: "El apellido debe ser texto",
    }),
    id_tipo_identificacion: z.number({
        required_error: "Debe seleccionar un tipo identificación valido",
        invalid_type_error: "El tipo identificación debe ser un número",
    }),
    identificacion: z.string({
        required_error: "Debe ingresar una identificación valida",
        invalid_type_error: "La identificación debe ser texto",
    }),
    telefono: z.string({
        required_error: "Debe ingresar un telefono valido",
        invalid_type_error: "El telefono debe ser texto",
    }),
    clave: z.string({
        required_error: "Debe ingresar una clave valido",
        invalid_type_error: "La clave debe ser texto",
    }).optional(),
    id_estado: z.number({
        required_error: "Debe ingresar el estado del usuario",
        invalid_type_error: "El estado debe ser un número",
    }).optional(),
    perfil: z.number({
        required_error: "Debe ingresar el perfil del usuario",
        invalid_type_error: "El perfil debe ser un número",
    }),
})
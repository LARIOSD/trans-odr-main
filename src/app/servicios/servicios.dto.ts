import z from "zod";

export interface ServicioDto {
    id_servicio?: number;
    tipo_servicio: string;
    fecha_servicio: string;
    direcciones: DireccionDetalleDto[];
    precio: number;
    distancia: number;
}

export interface DireccionDetalleDto {
    id_detalle?: number;
    direc_inicio: string;
    direc_final: string;
    hora_inicio: string;
    hora_final: string;
    odr?: string;
    solicitante: string;
    referencia?: string;
    precio?: number;
    distancia?: number;
    fecha_registro?: string;
}

export const ServicioSchema = z.object({
    id_servicio: z.number().optional().nullable(),
    tipo_servicio: z.number({
        required_error: "Seleccione un tipo de servicio",
        invalid_type_error: "El tipo de servicio debe ser un número",
    }).min(1, { message: "Seleccione un tipo de servicio" }),
    fecha_servicio: z.string({
        required_error: "Ingrese la fecha del servicio",
        invalid_type_error: "La fecha del servicio debe ser una cadena",
    }).min(1, { message: "Ingrese la fecha del servicio" }),
    direcciones: z.array(
        z.object({
            id_detalle: z.number().optional().nullable(),
            direc_inicio: z.string({
                required_error: "La dirección de inicio es obligatoria",
                invalid_type_error: "La dirección de inicio debe ser una cadena",
            }).min(1, { message: "La dirección de inicio es obligatoria" }),
            direc_final: z.string({
                required_error: "La dirección de final es obligatoria",
                invalid_type_error: "La dirección de final debe ser una cadena",
            }).min(1, { message: "La dirección de final es obligatoria" }),
            hora_inicio: z.string({
                required_error: "La hora de inicio es obligatoria",
                invalid_type_error: "La hora de inicio debe ser una cadena",
            }).min(1, { message: "La hora de inicio es obligatoria" }),
            hora_final: z.string({
                required_error: "La hora de fin es obligatoria",
                invalid_type_error: "La hora de fin debe ser una cadena",
            }).min(1, { message: "La hora de fin es obligatoria" }),
            odr: z.string({
                required_error: "El ODR es obligatorio",
                invalid_type_error: "El ODR debe ser una cadena",
            }).max(3, { message: "El ODR máximo puede contener 3 números" }).optional().nullable(),
            referencia: z.string({
                required_error: "El referencia es obligatorio",
                invalid_type_error: "El referencia debe ser una cadena",
            }).max(50, { message: "El referencia máximo puede contener 50 números" }).optional().nullable(),
            solicitante: z.string({
                required_error: "El nombre del solicitante es obligatorio",
                invalid_type_error: "El nombre del solicitante debe ser una cadena",
            }).min(1, { message: "El nombre del solicitante es obligatorio" }),
            precio: z.number({
                required_error: "El precio es obligatorio",
                invalid_type_error: "El precio debe ser un número",
            }).min(0, { message: "El precio debe ser mayor o igual a 0" }),
            distancia: z.number({
                required_error: "La distancia es obligatoria",
                invalid_type_error: "La distancia debe ser un número",
            }).min(0, { message: "La distancia debe ser mayor o igual a 0" }),
        })
    )
});
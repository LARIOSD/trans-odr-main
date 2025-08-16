ALTER TABLE public.tbl_detalles_servicio DROP COLUMN precio;
ALTER TABLE public.tbl_detalles_servicio DROP COLUMN fecha_creacion;
ALTER TABLE public.tbl_detalles_servicio DROP COLUMN usuario_creacion;
ALTER TABLE public.tbl_detalles_servicio ADD precio numeric(20, 2) NOT NULL DEFAULT 0;
ALTER TABLE public.tbl_detalles_servicio ADD distancia numeric(20, 2) NULL;
ALTER TABLE public.tbl_detalles_servicio ADD fecha_creacion timestamp DEFAULT now() NOT NULL;
ALTER TABLE public.tbl_detalles_servicio ADD usuario_creacion int NOT NULL;
ALTER TABLE public.tbl_detalles_servicio ALTER COLUMN odr DROP NOT NULL;
ALTER TABLE public.tbl_detalles_servicio ADD referencia varchar(50) DEFAULT NULL;


/* 
CREATE TABLE public.tbl_estados_servicio (
	id_estado bigserial NOT NULL,
	descripcion varchar(50) NOT NULL,
	CONSTRAINT tbl_estados_servicio_pkey PRIMARY KEY (id_estado)
);

INSERT INTO public.tbl_estados_servicio (descripcion) 
VALUES ('APROBADO');

INSERT INTO public.tbl_estados_servicio (descripcion) 
VALUES ('NO APROBADO');

ALTER TABLE public.tbl_detalles_servicio
ADD COLUMN id_estado_detalle int8;

UPDATE public.tbl_detalles_servicio
SET id_estado_detalle = 1
WHERE id_estado_detalle IS NULL;

ALTER TABLE public.tbl_detalles_servicio
ALTER COLUMN id_estado_detalle SET DEFAULT 2;

ALTER TABLE public.tbl_detalles_servicio
ALTER COLUMN id_estado_detalle SET NOT NULL;

ALTER TABLE public.tbl_detalles_servicio
ADD CONSTRAINT fk_tbl_detalles_servicio_estado
FOREIGN KEY (id_estado_detalle) REFERENCES public.tbl_estados_servicio (id_estado);

 */



-- DROP FUNCTION public.fnc_obtener_servicios(json);

CREATE OR REPLACE FUNCTION public.fnc_obtener_servicios(params json)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
    v_estado_id integer := (params->>'estado')::integer;
    v_usuario_id integer := (params->>'usuario')::integer;

    v_perfil_admin_id integer := 1;
    v_es_admin boolean;

    r_data json;
BEGIN
    IF v_estado_id IS NULL THEN
        RETURN json_build_object('statusCode', 400, 'message', 'No se ha encontrado el estado para la operación', 'data', '[]'::json);
    END IF;

    IF v_usuario_id IS NULL THEN
        RETURN json_build_object('statusCode', 400, 'message', 'No se ha encontrado el usuario para la operación', 'data', '[]'::json);
    END IF;

    SELECT true INTO v_es_admin
    FROM public.tbl_usuarios tu
    INNER JOIN public.tbl_perfiles_usuarios tpu ON tpu.id_usuario = tu.id_usuario
    WHERE tu.id_usuario = v_usuario_id AND tpu.id_perfil = v_perfil_admin_id;

    r_data := (
        SELECT json_agg(to_json(t))
        FROM (
            SELECT
                ptds.id_detalle, ptst.descripcion AS tipo_servicio, pts.fecha_servicio AS fecha_trayecto,
                ptds.solicitante, ptds.direccion_inicial AS direc_inicio, ptds.direccion_final AS direc_final, 
                ptds.hora_inicio, ptds.hora_final, ptds.odr, CONCAT(ptu.nombres, ' ', ptu.apellidos) AS conductor,
				ptds.precio, ptds.distancia, ptds.referencia, ptds.fecha_recorrido, ptds.id_estado_detalle,
                CASE 
                    WHEN v_es_admin IS TRUE THEN 
                        TO_CHAR(ptds.fecha_creacion, 'YYYY-MM-DD HH24:MI')
                    ELSE 
                        ''
                END AS fecha_registro
            FROM public.tbl_servicios pts
            INNER JOIN public.tbl_detalles_servicio ptds ON ptds.id_servicio = pts.id_servicio
            INNER JOIN public.tbl_tipos_servicios ptst ON ptst.id_tipo_servicio = pts.id_tipo_servicio
			INNER JOIN public.tbl_usuarios ptu ON ptu.id_usuario = pts.usuario_creador
            WHERE ptds.id_estado = v_estado_id
            AND (v_es_admin = true OR pts.usuario_creador = v_usuario_id)
             ORDER BY pts.fecha_servicio, ptds.hora_inicio DESC
        ) t
    );

    RETURN json_build_object('statusCode', 200, 'message', 'OK', 'data', COALESCE(r_data, '[]'::json));
END
$function$
;



-- DROP PROCEDURE public.prc_insertar_actualizar_servicio(in json, out json);

CREATE OR REPLACE PROCEDURE public.prc_insertar_actualizar_servicio(IN i_servicio json, OUT results json)
 LANGUAGE plpgsql
AS $procedure$
DECLARE
    v_estado_activo integer := 1;
    v_tbl_servicios public.tbl_servicios%rowtype;
    v_tbl_detalles_servicio public.tbl_detalles_servicio%rowtype;

    v_usuario_id integer 	:= (i_servicio->>'usuario')::integer;
    v_estado_id integer 	:= COALESCE((i_servicio->>'estado')::integer, v_estado_activo);

    v_tipo_servicio_id integer  := (i_servicio->>'tipo_servicio')::integer;
    v_fecha_servicio date 		:= (i_servicio->>'fecha_servicio')::date;

    v_direcciones jsonb := (i_servicio->'direcciones')::jsonb;

    v_direccion jsonb;
BEGIN

    INSERT INTO public.tbl_servicios
    (id_tipo_servicio, fecha_servicio, id_estado, usuario_creador)
    VALUES(v_tipo_servicio_id, v_fecha_servicio, v_estado_activo, v_usuario_id) RETURNING * INTO v_tbl_servicios;

    IF v_tbl_servicios.id_servicio IS NULL THEN
        RAISE EXCEPTION 'No se ha podido insertar el servicio';
    END IF;

    FOR v_direccion IN SELECT * FROM jsonb_array_elements(v_direcciones) LOOP
        INSERT INTO public.tbl_detalles_servicio
        (
            id_servicio, 
			odr, 
			direccion_inicial, 
			hora_inicio,
            direccion_final, 
			hora_final, 
			id_estado, 
            solicitante,
			precio,
			distancia,
            referencia,
            fecha_recorrido
        )
        VALUES(
            v_tbl_servicios.id_servicio, 
			(v_direccion->>'odr')::text, 
			(v_direccion->>'direc_inicio')::text, 
			(v_direccion->>'hora_inicio')::time,
            (v_direccion->>'direc_final')::text, 
			(v_direccion->>'hora_final')::time, 
			v_estado_activo, 
			(v_direccion->>'solicitante')::text,
			(v_direccion->>'precio')::numeric(20,2),
			(v_direccion->>'distancia')::numeric(20,2),
            (v_direccion->>'referencia')::varchar(50),
            (v_direccion->>'fecha_recorrido')::timestamp
        ) RETURNING * INTO v_tbl_detalles_servicio;

        IF v_tbl_detalles_servicio.id_detalle IS NULL THEN
            RAISE EXCEPTION 'Error al insertar la direccion - %', (v_direccion->>'direc_inicio')::text;
        END IF;
    END LOOP;

    results := json_build_object('statusCode', 201, 'message', 'OK', 'data', v_tbl_servicios);


    EXCEPTION WHEN OTHERS THEN
        results := json_build_object('statusCode', 500, 'message', SQLERRM, 'data', NULL);
        RETURN;
END
$procedure$
;



CREATE OR REPLACE PROCEDURE public.inactivar_activar_detalle_servicio(IN i_parametros json, OUT results json) LANGUAGE 'plpgsql' AS $$
DECLARE
    v_estado_activo integer := 1;
    v_estado_inactivo integer := 2;
    v_detalle_id integer := (i_parametros->>'id')::integer;
    v_estado_id integer := COALESCE((i_parametros->>'estado')::integer, v_estado_inactivo);

    v_tbl_servicios public.tbl_servicios%rowtype;
    v_tbl_detalles_servicio public.tbl_detalles_servicio%rowtype;
BEGIN

    IF NOT EXISTS (SELECT 1 FROM public.tbl_detalles_servicio WHERE id_detalle = v_detalle_id) THEN
        RAISE EXCEPTION '{"statusCode": 404, "message": "No se ha encontrado el detalle"}';
    END IF;

    UPDATE public.tbl_detalles_servicio
    SET id_estado = v_estado_id
    WHERE id_detalle = v_detalle_id
    RETURNING * INTO v_tbl_detalles_servicio;

    IF v_tbl_detalles_servicio.id_detalle IS NULL THEN
        RAISE EXCEPTION  '{"statusCode": 404, "message": "No se ha encontrado el detalle - %"}', v_detalle_id;
    END IF;

    results := json_build_object('statusCode', 200, 'message', 'Registro eliminado correctamente');

    EXCEPTION WHEN OTHERS THEN
        results := json_build_object('statusCode', 500, 'message', SQLERRM);
        RETURN;
END
$$;


-- DROP FUNCTION public.fnc_obtener_servicios_filtro(json);

CREATE OR REPLACE FUNCTION public.fnc_obtener_servicios_filtro(params json)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
    v_estado_id integer := (params->>'estado')::integer;
    v_usuario_id integer := COALESCE((params->>'conductor')::integer, 0::int);

    -- Variables de fechas
    v_fecha_inicio varchar := params->>'fecha_inicio';
    v_fecha_final varchar := params->>'fecha_final';
    v_fecha_registro_i varchar := params->>'fecha_registro_i';
    v_fecha_registro_f varchar := params->>'fecha_registro_f';

    -- Parseo de fechas (evita errores con valores vacíos)
    v_fecha_ini_parsed timestamp := NULLIF(v_fecha_inicio, '')::timestamp;
    v_fecha_fin_parsed timestamp := NULLIF(v_fecha_final, '')::timestamp;
    v_fecha_reg_i_parsed timestamp := NULLIF(v_fecha_registro_i, '')::timestamp;
    v_fecha_reg_f_parsed timestamp := NULLIF(v_fecha_registro_f, '')::timestamp;

    v_perfil_admin_id integer := 1;
    v_es_admin boolean;

    r_data json;
BEGIN
    -- Validaciones iniciales
    IF v_estado_id IS NULL THEN
        RETURN json_build_object('statusCode', 400, 'message', 'No se ha encontrado el estado para la operación', 'data', '[]'::json);
    END IF;

    IF v_usuario_id IS NULL THEN
        RETURN json_build_object('statusCode', 400, 'message', 'No se ha encontrado el usuario para la operación', 'data', '[]'::json);
    END IF;

    -- Verificar si el usuario es administrador
    SELECT true INTO v_es_admin
    FROM public.tbl_usuarios tu
    INNER JOIN public.tbl_perfiles_usuarios tpu ON tpu.id_usuario = tu.id_usuario
    WHERE tu.id_usuario = v_usuario_id AND tpu.id_perfil = v_perfil_admin_id;

    -- Asegurar que la fecha final de registro sea el final del día
    IF v_fecha_reg_f_parsed IS NOT NULL THEN
        v_fecha_reg_f_parsed := v_fecha_reg_f_parsed + INTERVAL '23 hours 59 minutes 59 seconds';
    END IF;

    -- Asegurar que la fecha final del servicio sea el final del día
    IF v_fecha_fin_parsed IS NOT NULL THEN
        v_fecha_fin_parsed := v_fecha_fin_parsed + INTERVAL '23 hours 59 minutes 59 seconds';
    END IF;

    -- Consulta con filtros condicionales
    r_data := (
        SELECT json_agg(to_json(t))
        FROM (
            SELECT
                ptds.id_detalle, ptst.descripcion AS tipo_servicio, pts.fecha_servicio AS fecha_trayecto,
                ptds.solicitante, ptds.direccion_inicial AS direc_inicio, ptds.direccion_final AS direc_final, 
                ptds.hora_inicio, ptds.hora_final, ptds.odr, CONCAT(ptu.nombres, ' ', ptu.apellidos) AS conductor,
                ptds.precio, ptds.distancia, ptds.referencia, ptds.fecha_recorrido, ptds.id_estado_detalle,
                CASE 
                    WHEN v_es_admin IS TRUE THEN 
                        TO_CHAR(ptds.fecha_creacion, 'YYYY-MM-DD HH24:MI')
                    ELSE 
                        ''
                END AS fecha_registro
            FROM public.tbl_servicios pts
            INNER JOIN public.tbl_detalles_servicio ptds ON ptds.id_servicio = pts.id_servicio
            INNER JOIN public.tbl_tipos_servicios ptst ON ptst.id_tipo_servicio = pts.id_tipo_servicio
            INNER JOIN public.tbl_usuarios ptu ON ptu.id_usuario = pts.usuario_creador
            WHERE ptds.id_estado = v_estado_id
            AND (v_fecha_reg_i_parsed IS NULL OR ptds.fecha_creacion BETWEEN v_fecha_reg_i_parsed AND v_fecha_reg_f_parsed)
            AND (v_fecha_ini_parsed IS NULL OR pts.fecha_servicio BETWEEN v_fecha_ini_parsed AND v_fecha_fin_parsed)
            AND (v_usuario_id = 0 OR pts.usuario_creador = v_usuario_id)
            ORDER BY pts.fecha_servicio DESC
        ) t
    );

    RETURN json_build_object('statusCode', 200, 'message', 'OK', 'data', COALESCE(r_data, '[]'::json));
END
$function$
;



-- DROP PROCEDURE public.aprobar_detalle_servicio(in json, out json);

CREATE OR REPLACE PROCEDURE public.aprobar_detalle_servicio(IN i_parametros json, OUT results json)
 LANGUAGE plpgsql
AS $procedure$
DECLARE
    v_estado_activo integer := 1;
    v_estado_inactivo integer := 2;
    v_detalle_id integer := (i_parametros->>'id')::integer;
    v_estado_id integer := COALESCE((i_parametros->>'estado')::integer, v_estado_inactivo);

    v_tbl_servicios public.tbl_servicios%rowtype;
    v_tbl_detalles_servicio public.tbl_detalles_servicio%rowtype;
BEGIN

    IF NOT EXISTS (SELECT 1 FROM public.tbl_detalles_servicio WHERE id_detalle = v_detalle_id) THEN
        RAISE EXCEPTION  '{"statusCode": 404, "message": "No se ha encontrado el detalle - %"}', v_detalle_id;
    END IF;

    UPDATE public.tbl_detalles_servicio 
    SET id_estado_detalle = v_estado_id 
    WHERE id_detalle = v_detalle_id
    RETURNING * INTO v_tbl_detalles_servicio;
    
    IF v_tbl_detalles_servicio.id_detalle IS NULL THEN
        RAISE EXCEPTION '{"statusCode": 400, "message": "Error al cambiar el estado del detalle - %"}', v_detalle_id;
    END IF;
  
    results := json_build_object('statusCode', 200, 'message', 'Registro actualizado correctamente');

    EXCEPTION WHEN OTHERS THEN
        results := json_build_object('statusCode', 500, 'message', SQLERRM);
        RETURN;
END
$procedure$
;

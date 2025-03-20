CREATE OR REPLACE FUNCTION public.fnc_obtener_solicitantes(params json)
RETURNS json 
LANGUAGE 'plpgsql'
AS $$
DECLARE
    v_estado_id integer := (params->>'estado')::integer;

    r_data json;
BEGIN
    IF v_estado_id IS NULL THEN
        RETURN json_build_object('statusCode', 400, 'message', 'No se ha encontrado el estado para la operación', 'data', '[]'::json);
    END IF;

     SELECT json_agg(to_json(t)) INTO r_data
     FROM (
        SELECT 
            t.id_solicitante,
            t.nombres_completo,
            ti.descripcion AS tipo_identificacion,
            t.identificacion
        FROM public.tbl_solicitantes t
        INNER JOIN public.tbl_tipos_identificaciones ti ON t.id_tipo_identificacion = ti.id_tipo_identificacion
        WHERE t.id_estado = v_estado_id
        ORDER BY t.id_solicitante
    ) t;

    RETURN json_build_object('statusCode', 200, 'message', 'OK', 'data', COALESCE(r_data, '[]'::json));
END
$$;


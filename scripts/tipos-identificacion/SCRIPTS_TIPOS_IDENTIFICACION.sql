CREATE OR REPLACE FUNCTION public.fnc_obtener_tipos_identificacion(params json)
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
            t.id_tipo_identificacion,
            t.descripcion
        FROM public.tbl_tipos_identificaciones t
        WHERE t.id_estado = v_estado_id
        ORDER BY t.id_tipo_identificacion
    ) t;

    RETURN json_build_object('statusCode', 200, 'message', 'OK', 'data', COALESCE(r_data, '[]'::json));
END
$$;


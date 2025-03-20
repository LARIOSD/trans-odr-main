-- FUNCION ALMACENADA PARA BUSCAR EL USUARIO AUTENTICADO
CREATE OR REPLACE FUNCTION public.fnc_buscar_usuario_autorizado(i_usuario integer) RETURNS jsonb LANGUAGE plpgsql AS $$
DECLARE
    v_estado_activo integer := 1;
    v_data_return jsonb;
BEGIN
    IF NOT EXISTS (SELECT 1 FROM public.tbl_usuarios WHERE id_usuario = i_usuario AND id_estado = v_estado_activo) THEN
        RETURN jsonb_build_object(
            'statusCode', 404,
            'error', true,
            'message', 'No se ha encontrado el registro'
        );
    END IF;	

    v_data_return := (
        SELECT to_jsonb(q) FROM (
            SELECT 
                stu.id_usuario, stu.nombres, stu.apellidos, stu.telefono, 
                stu.identificacion, stu.id_estado, stu.id_tipo_identificacion,
                pu.id_perfil, p.descripcion AS perfil
            FROM public.tbl_usuarios stu 
            INNER JOIN public.tbl_perfiles_usuarios pu ON stu.id_usuario = pu.id_usuario
            INNER JOIN public.tbl_perfiles p ON p.id_perfil = pu.id_perfil
            WHERE stu.id_usuario = i_usuario
            AND stu.id_estado = v_estado_activo
        ) AS q
    );

    RETURN jsonb_build_object(
        'statusCode', 200,
        'error', false,
        'message', 'OK',
        'data', COALESCE(v_data_return, '{}'::jsonb)
    );
END
$$;

SELECT * FROM public.fnc_buscar_usuario_autorizado(6);
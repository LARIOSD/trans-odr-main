CREATE OR REPLACE FUNCTION public.prc_insertar_actualizar_usuario( IN params JSON, OUT results JSON )
LANGUAGE 'plpgsql'
AS $$
DECLARE
    v_tbl_usuarios public.tbl_usuarios%rowtype;

    v_id_usuario INTEGER;
    v_id_perfil_usuario INTEGER;
    v_nombres TEXT := params->>'nombres';
    v_apellidos TEXT := params->>'apellidos';
    v_id_tipo_identificacion INTEGER := (params->>'id_tipo_identificacion')::INTEGER;
    v_identificacion TEXT := params->>'identificacion';
    v_telefono TEXT := params->>'telefono';
    v_clave TEXT := params->>'clave';
    v_id_estado INTEGER := (params->>'id_estado')::INTEGER;
    v_perfil INTEGER := (params->>'perfil')::INTEGER;
BEGIN
    -- Verificar si el usuario ya existe (usando la identificación como clave única)
    SELECT id_usuario INTO v_id_usuario 
    FROM public.tbl_usuarios 
    WHERE identificacion = v_identificacion;

    IF v_id_usuario IS NULL THEN
        -- Insertar nuevo usuario
        INSERT INTO public.tbl_usuarios ( nombres, apellidos, id_tipo_identificacion, identificacion, telefono, clave, id_estado)
        VALUES (v_nombres, v_apellidos, v_id_tipo_identificacion, v_identificacion, v_telefono, v_clave, v_id_estado)
        RETURNING * INTO v_tbl_usuarios;
        
        -- Insertar perfil de usuario
        INSERT INTO public.tbl_perfiles_usuarios (id_usuario, id_perfil, id_estado)
        VALUES (v_tbl_usuarios.id_usuario, v_perfil, v_id_estado)
        RETURNING id_perfil_usuario INTO v_id_perfil_usuario;

        results := json_build_object('statusCode', 201, 'message', 'Usuario creado exitosamente', 'data', v_tbl_usuarios);
    ELSE
        -- Actualizar usuario existente
        UPDATE public.tbl_usuarios
        SET nombres = v_nombres, apellidos = v_apellidos, id_tipo_identificacion = v_id_tipo_identificacion, identificacion = v_identificacion, telefono = v_telefono, clave = v_clave, id_estado = v_id_estado
        WHERE id_usuario = v_id_usuario;

        -- Actualizar perfil del usuario
        UPDATE public.tbl_perfiles_usuarios
        SET id_perfil = v_perfil, id_estado = v_id_estado
        WHERE id_usuario = v_id_usuario;

        results := json_build_object('statusCode', 200, 'message', 'Usuario actualizado exitosamente', 'id_usuario', v_id_usuario);
    END IF;
END;
$$;














CREATE OR REPLACE FUNCTION public.fnc_buscar_usuario_id( IN params JSON, OUT results JSON )
LANGUAGE 'plpgsql'
AS $$
DECLARE
    v_id_usuario INTEGER := (params->>'id')::INTEGER;
    v_estado INTEGER := (params->>'estado')::INTEGER;
    v_ver_clave BOOLEAN := (params->>'ver_clave')::BOOLEAN;
    r_data JSON;
BEGIN

    SELECT json_build_object(
        'id_usuario', u.id_usuario,
        'nombres', u.nombres,
        'apellidos', u.apellidos,
        'id_tipo_identificacion', u.id_tipo_identificacion,
        'identificacion', u.identificacion,
        'telefono', u.telefono,
        'clave', CASE WHEN v_ver_clave IS TRUE THEN u.clave ELSE '' END,
        'id_estado', u.id_estado,
        'perfil', pu.id_perfil
    ) INTO r_data
    FROM public.tbl_usuarios u
    LEFT JOIN public.tbl_perfiles_usuarios pu ON u.id_usuario = pu.id_usuario
    WHERE u.id_usuario = v_id_usuario AND u.id_estado = v_estado;

    -- Retornar el resultado en formato JSON
    results := json_build_object(
        'statusCode', 200,
        'message', 'OK',
        'data', COALESCE(r_data, '[]'::json)
    );
END;
$$;





CREATE OR REPLACE FUNCTION public.fnc_buscar_usuarios(params JSON, results JSON )
RETURNS json
LANGUAGE 'plpgsql'
AS $$
DECLARE
	v_perfil int := COALESCE((params->>'perfil')::int, 0::int);
    r_data JSON;
BEGIN

    r_data := (
		SELECT json_agg(to_json(q)) FROM (
			SELECT u.id_usuario, u.nombres, u.apellidos,
				CONCAT(u.nombres, ' ', u.apellidos) AS nombre_concat,
		        u.id_tipo_identificacion,
		        u.identificacion,
		        u.telefono,
		        u.id_estado,
		        pu.id_perfil
		    FROM public.tbl_usuarios u
		    LEFT JOIN public.tbl_perfiles_usuarios pu ON u.id_usuario = pu.id_usuario
		    WHERE 
				(v_perfil = 0 OR pu.id_perfil = v_perfil) AND
				u.id_estado = 1
		) AS q
	);

    -- Retornar el resultado en formato JSON
    results := json_build_object(
        'statusCode', 200,
        'message', 'OK',
        'data', r_data
    );

	RETURN results;
END;
$$;

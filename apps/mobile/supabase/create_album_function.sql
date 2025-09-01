-- =====================================================
-- FUNCIÓN RPC PARA CREAR ÁLBUMES
-- Evita problemas con políticas RLS
-- =====================================================

CREATE OR REPLACE FUNCTION create_album_direct(
  p_title TEXT,
  p_description TEXT DEFAULT NULL,
  p_cover_image_url TEXT DEFAULT NULL,
  p_location TEXT DEFAULT NULL,
  p_date TEXT,
  p_is_featured BOOLEAN DEFAULT FALSE,
  p_is_public BOOLEAN DEFAULT TRUE,
  p_category_id UUID DEFAULT NULL,
  p_user_id UUID
) RETURNS JSON AS $$
DECLARE
  new_album_id UUID;
  result JSON;
BEGIN
  -- Insertar el álbum directamente
  INSERT INTO albums (
    title,
    description,
    cover_image_url,
    location,
    date,
    is_featured,
    is_public,
    category_id,
    user_id
  ) VALUES (
    p_title,
    p_description,
    p_cover_image_url,
    p_location,
    p_date,
    p_is_featured,
    p_is_public,
    p_category_id,
    p_user_id
  ) RETURNING id INTO new_album_id;

  -- Obtener el álbum creado con sus relaciones
  SELECT json_build_object(
    'id', a.id,
    'title', a.title,
    'description', a.description,
    'cover_image_url', a.cover_image_url,
    'location', a.location,
    'date', a.date,
    'is_featured', a.is_featured,
    'is_public', a.is_public,
    'user_id', a.user_id,
    'organization_id', a.organization_id,
    'category_id', a.category_id,
    'created_at', a.created_at,
    'updated_at', a.updated_at,
    'categories', json_build_object(
      'name', c.name,
      'color', c.color,
      'icon', c.icon
    )
  ) INTO result
  FROM albums a
  LEFT JOIN categories c ON a.category_id = c.id
  WHERE a.id = new_album_id;

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Dar permisos para ejecutar la función
GRANT EXECUTE ON FUNCTION create_album_direct TO authenticated;

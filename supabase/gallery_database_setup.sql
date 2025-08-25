-- =====================================================
-- GALLERY DATABASE SETUP
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- CATEGORIES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    color VARCHAR(7) DEFAULT '#65b6ad', -- Hex color for category
    icon VARCHAR(50), -- Icon name for the category
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ALBUMS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS albums (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    cover_image_url TEXT, -- Main/cover image for the album
    location VARCHAR(200), -- Where the photos were taken
    date DATE NOT NULL,
    is_featured BOOLEAN DEFAULT FALSE, -- Featured albums
    is_public BOOLEAN DEFAULT TRUE, -- Public or private album
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL, -- Optional: if album belongs to an org
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- PHOTOS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS photos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200),
    description TEXT,
    image_url TEXT NOT NULL, -- URL to the photo in storage
    thumbnail_url TEXT, -- Smaller version for thumbnails
    file_size INTEGER, -- File size in bytes
    width INTEGER, -- Image dimensions
    height INTEGER,
    album_id UUID REFERENCES albums(id) ON DELETE CASCADE,
    uploaded_by UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
    is_featured BOOLEAN DEFAULT FALSE, -- Featured photos within album
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ALBUM LIKES TABLE (for favorites)
-- =====================================================
CREATE TABLE IF NOT EXISTS album_likes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    album_id UUID REFERENCES albums(id) ON DELETE CASCADE,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(album_id, user_id) -- Prevent duplicate likes
);

-- =====================================================
-- PHOTO LIKES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS photo_likes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    photo_id UUID REFERENCES photos(id) ON DELETE CASCADE,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(photo_id, user_id) -- Prevent duplicate likes
);

-- =====================================================
-- ALBUM SHARES TABLE (for tracking shares)
-- =====================================================
CREATE TABLE IF NOT EXISTS album_shares (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    album_id UUID REFERENCES albums(id) ON DELETE CASCADE,
    shared_by UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
    shared_with UUID REFERENCES user_profiles(id) ON DELETE SET NULL, -- If shared with specific user
    share_type VARCHAR(20) DEFAULT 'public', -- 'public', 'private', 'organization'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_albums_user_id ON albums(user_id);
CREATE INDEX IF NOT EXISTS idx_albums_organization_id ON albums(organization_id);
CREATE INDEX IF NOT EXISTS idx_albums_category_id ON albums(category_id);
CREATE INDEX IF NOT EXISTS idx_albums_date ON albums(date);
CREATE INDEX IF NOT EXISTS idx_albums_featured ON albums(is_featured);
CREATE INDEX IF NOT EXISTS idx_photos_album_id ON photos(album_id);
CREATE INDEX IF NOT EXISTS idx_photos_uploaded_by ON photos(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_album_likes_album_id ON album_likes(album_id);
CREATE INDEX IF NOT EXISTS idx_album_likes_user_id ON album_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_photo_likes_photo_id ON photo_likes(photo_id);
CREATE INDEX IF NOT EXISTS idx_photo_likes_user_id ON photo_likes(user_id);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE album_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE photo_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE album_shares ENABLE ROW LEVEL SECURITY;

-- Categories: Readable by all authenticated users
CREATE POLICY "Categories are viewable by authenticated users" ON categories
    FOR SELECT USING (auth.role() = 'authenticated');

-- Categories: Users can insert new categories
CREATE POLICY "Users can insert categories" ON categories
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Categories: Users can update categories they created
CREATE POLICY "Users can update categories" ON categories
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Categories: Users can delete categories they created
CREATE POLICY "Users can delete categories" ON categories
    FOR DELETE USING (auth.role() = 'authenticated');

-- Albums: Users can see their own albums and public albums
CREATE POLICY "Users can view their own albums" ON albums
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view public albums" ON albums
    FOR SELECT USING (is_public = TRUE);

CREATE POLICY "Users can view organization albums they belong to" ON albums
    FOR SELECT USING (
        organization_id IN (
            SELECT organization_id FROM organization_members 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert their own albums" ON albums
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own albums" ON albums
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own albums" ON albums
    FOR DELETE USING (auth.uid() = user_id);

-- Photos: Users can see photos from albums they have access to
CREATE POLICY "Users can view photos from accessible albums" ON photos
    FOR SELECT USING (
        album_id IN (
            SELECT id FROM albums WHERE 
                user_id = auth.uid() OR 
                is_public = TRUE OR
                organization_id IN (
                    SELECT organization_id FROM organization_members 
                    WHERE user_id = auth.uid()
                )
        )
    );

CREATE POLICY "Users can insert photos to their albums" ON photos
    FOR INSERT WITH CHECK (
        album_id IN (
            SELECT id FROM albums WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update photos in their albums" ON photos
    FOR UPDATE USING (
        album_id IN (
            SELECT id FROM albums WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete photos from their albums" ON photos
    FOR DELETE USING (
        album_id IN (
            SELECT id FROM albums WHERE user_id = auth.uid()
        )
    );

-- Album Likes: Users can manage their own likes
CREATE POLICY "Users can view all album likes" ON album_likes
    FOR SELECT USING (TRUE);

CREATE POLICY "Users can insert their own album likes" ON album_likes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own album likes" ON album_likes
    FOR DELETE USING (auth.uid() = user_id);

-- Photo Likes: Users can manage their own likes
CREATE POLICY "Users can view all photo likes" ON photo_likes
    FOR SELECT USING (TRUE);

CREATE POLICY "Users can insert their own photo likes" ON photo_likes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own photo likes" ON photo_likes
    FOR DELETE USING (auth.uid() = user_id);

-- Album Shares: Users can manage their own shares
CREATE POLICY "Users can view album shares" ON album_shares
    FOR SELECT USING (TRUE);

CREATE POLICY "Users can insert their own album shares" ON album_shares
    FOR INSERT WITH CHECK (auth.uid() = shared_by);

CREATE POLICY "Users can delete their own album shares" ON album_shares
    FOR DELETE USING (auth.uid() = shared_by);

-- =====================================================
-- TRIGGERS FOR UPDATED_AT
-- =====================================================

-- Function to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_albums_updated_at BEFORE UPDATE ON albums
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_photos_updated_at BEFORE UPDATE ON photos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- INITIAL DATA
-- =====================================================

-- Insert default categories
INSERT INTO categories (name, description, color, icon) VALUES
('Vet Visits', 'Photos from veterinary appointments', '#FF6B6B', 'stethoscope'),
('Walks', 'Daily walks and outdoor adventures', '#4ECDC4', 'walking'),
('Birthday', 'Birthday celebrations and special moments', '#FFE66D', 'birthday-cake'),
('Training', 'Training sessions and learning moments', '#95E1D3', 'graduation-cap'),
('Beach', 'Beach adventures and water fun', '#F7CAC9', 'umbrella-beach'),
('Park', 'Park visits and playtime', '#98D8C8', 'tree'),
('Home', 'Cozy moments at home', '#B8A9C9', 'home'),
('Travel', 'Travel adventures and trips', '#F4A261', 'plane')
ON CONFLICT DO NOTHING;

-- =====================================================
-- STORAGE BUCKETS
-- =====================================================

-- Create storage bucket for gallery photos
INSERT INTO storage.buckets (id, name, public) VALUES ('gallery-photos', 'gallery-photos', true)
ON CONFLICT DO NOTHING;

-- Storage policies for gallery photos
CREATE POLICY "Gallery photos are accessible by authenticated users" ON storage.objects
    FOR SELECT USING (bucket_id = 'gallery-photos' AND auth.role() = 'authenticated');

CREATE POLICY "Users can upload gallery photos" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'gallery-photos' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own gallery photos" ON storage.objects
    FOR UPDATE USING (bucket_id = 'gallery-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own gallery photos" ON storage.objects
    FOR DELETE USING (bucket_id = 'gallery-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

-- Function to get album with photo count
CREATE OR REPLACE FUNCTION get_album_with_photo_count(album_uuid UUID)
RETURNS TABLE (
    id UUID,
    title VARCHAR(200),
    description TEXT,
    cover_image_url TEXT,
    location VARCHAR(200),
    date DATE,
    is_featured BOOLEAN,
    is_public BOOLEAN,
    user_id UUID,
    organization_id UUID,
    category_id UUID,
    photo_count BIGINT,
    like_count BIGINT,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        a.*,
        COUNT(p.id) as photo_count,
        COUNT(al.id) as like_count
    FROM albums a
    LEFT JOIN photos p ON a.id = p.album_id
    LEFT JOIN album_likes al ON a.id = al.album_id
    WHERE a.id = album_uuid
    GROUP BY a.id;
END;
$$ LANGUAGE plpgsql;

-- Function to get user's albums with counts
CREATE OR REPLACE FUNCTION get_user_albums(user_uuid UUID)
RETURNS TABLE (
    id UUID,
    title VARCHAR(200),
    description TEXT,
    cover_image_url TEXT,
    location VARCHAR(200),
    date DATE,
    is_featured BOOLEAN,
    is_public BOOLEAN,
    category_id UUID,
    category_name VARCHAR(100),
    category_color VARCHAR(7),
    photo_count BIGINT,
    like_count BIGINT,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        a.id,
        a.title,
        a.description,
        a.cover_image_url,
        a.location,
        a.date,
        a.is_featured,
        a.is_public,
        a.category_id,
        c.name as category_name,
        c.color as category_color,
        COUNT(DISTINCT p.id) as photo_count,
        COUNT(DISTINCT al.id) as like_count,
        a.created_at
    FROM albums a
    LEFT JOIN categories c ON a.category_id = c.id
    LEFT JOIN photos p ON a.id = p.album_id
    LEFT JOIN album_likes al ON a.id = al.album_id
    WHERE a.user_id = user_uuid
    GROUP BY a.id, c.name, c.color
    ORDER BY a.created_at DESC;
END;
$$ LANGUAGE plpgsql;

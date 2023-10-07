ALTER TABLE listings ADD COLUMN capacity INTEGER;
ALTER TABLE listings ADD COLUMN description TEXT;
ALTER TABLE listings DROP COLUMN title;

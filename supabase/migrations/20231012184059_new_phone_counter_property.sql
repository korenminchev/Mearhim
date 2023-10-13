alter table "public"."listings" add column "phoneClickedCounter" numeric not null default '0'::numeric;

CREATE OR REPLACE FUNCTION INCREMENT_PHONE_COUNTER (listing_id int) 
RETURNS VOID AS $$
BEGIN
  UPDATE "public"."listings"
  SET "phoneClickedCounter" = "phoneClickedCounter" + 1
  WHERE id = listing_id;
END;
$$  language plpgsql;
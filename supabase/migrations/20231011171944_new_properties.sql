create type "public"."protected_space" as enum ('MAMAD', 'MIKLAT', 'MIGUNIT', 'HEDER_MADREGOT', 'NONE');

alter table "public"."listings" add column "disabledAccessibility" boolean;

alter table "public"."listings" add column "petsExisting" boolean;

alter table "public"."listings" add column "petsFriendly" boolean;

alter table "public"."listings" add column "protectedSpace" protected_space;



-- Taskify keeps Prisma server actions as its data boundary. Supabase provides
-- Clerk-authenticated private Realtime invalidation and private file storage.

ALTER TABLE public."Board" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."List" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Card" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."AuditLog" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."OrgLimit" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."OrgSubscription" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public._prisma_migrations ENABLE ROW LEVEL SECURITY;

CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION private.broadcast_taskify_board_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  board_id text;
  clerk_org_id text;
  list_id text;
BEGIN
  IF TG_TABLE_NAME = 'Board' THEN
    board_id := COALESCE(NEW.id, OLD.id);
    clerk_org_id := COALESCE(NEW."orgId", OLD."orgId");
  ELSIF TG_TABLE_NAME = 'List' THEN
    board_id := COALESCE(NEW."boardId", OLD."boardId");
  ELSIF TG_TABLE_NAME = 'Card' THEN
    list_id := COALESCE(NEW."listId", OLD."listId");
    SELECT item."boardId" INTO board_id
    FROM public."List" AS item
    WHERE item.id = list_id;
  END IF;

  IF clerk_org_id IS NULL AND board_id IS NOT NULL THEN
    SELECT board."orgId" INTO clerk_org_id
    FROM public."Board" AS board
    WHERE board.id = board_id;
  END IF;

  IF board_id IS NOT NULL AND clerk_org_id IS NOT NULL THEN
    PERFORM realtime.broadcast_changes(
      'org:' || clerk_org_id || ':board:' || board_id,
      TG_OP,
      TG_OP,
      TG_TABLE_NAME,
      TG_TABLE_SCHEMA,
      NEW,
      OLD
    );
  END IF;

  RETURN NULL;
END;
$$;

REVOKE ALL ON FUNCTION private.broadcast_taskify_board_change() FROM PUBLIC, anon, authenticated;

CREATE TRIGGER taskify_board_broadcast
AFTER INSERT OR UPDATE OR DELETE ON public."Board"
FOR EACH ROW EXECUTE FUNCTION private.broadcast_taskify_board_change();

CREATE TRIGGER taskify_list_broadcast
AFTER INSERT OR UPDATE OR DELETE ON public."List"
FOR EACH ROW EXECUTE FUNCTION private.broadcast_taskify_board_change();

CREATE TRIGGER taskify_card_broadcast
AFTER INSERT OR UPDATE OR DELETE ON public."Card"
FOR EACH ROW EXECUTE FUNCTION private.broadcast_taskify_board_change();

CREATE POLICY "Taskify members receive board broadcasts"
ON realtime.messages
FOR SELECT
TO authenticated
USING (
  extension = 'broadcast'
  AND split_part(realtime.topic(), ':', 1) = 'org'
  AND split_part(realtime.topic(), ':', 2) = COALESCE(
    auth.jwt() ->> 'org_id',
    auth.jwt() -> 'o' ->> 'id'
  )
  AND split_part(realtime.topic(), ':', 3) = 'board'
  AND split_part(realtime.topic(), ':', 4) <> ''
);

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'task-attachments',
  'task-attachments',
  false,
  10485760,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf', 'text/plain', 'text/csv']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

CREATE POLICY "Taskify members read organization attachments"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'task-attachments'
  AND (storage.foldername(name))[1] = COALESCE(
    auth.jwt() ->> 'org_id',
    auth.jwt() -> 'o' ->> 'id'
  )
);

CREATE POLICY "Taskify members upload organization attachments"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'task-attachments'
  AND (storage.foldername(name))[1] = COALESCE(
    auth.jwt() ->> 'org_id',
    auth.jwt() -> 'o' ->> 'id'
  )
);

CREATE POLICY "Taskify members update organization attachments"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'task-attachments'
  AND (storage.foldername(name))[1] = COALESCE(
    auth.jwt() ->> 'org_id',
    auth.jwt() -> 'o' ->> 'id'
  )
)
WITH CHECK (
  bucket_id = 'task-attachments'
  AND (storage.foldername(name))[1] = COALESCE(
    auth.jwt() ->> 'org_id',
    auth.jwt() -> 'o' ->> 'id'
  )
);

CREATE POLICY "Taskify members delete organization attachments"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'task-attachments'
  AND (storage.foldername(name))[1] = COALESCE(
    auth.jwt() ->> 'org_id',
    auth.jwt() -> 'o' ->> 'id'
  )
);

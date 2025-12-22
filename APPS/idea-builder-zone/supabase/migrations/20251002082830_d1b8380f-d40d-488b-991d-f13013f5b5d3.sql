-- Fix security warnings by setting search_path on functions

CREATE OR REPLACE FUNCTION public.update_profile_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_post_counts()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_TABLE_NAME = 'forum_comments' THEN
    UPDATE public.forum_posts
    SET comments_count = (
      SELECT COUNT(*) FROM public.forum_comments WHERE post_id = NEW.post_id
    )
    WHERE id = NEW.post_id;
  ELSIF TG_TABLE_NAME = 'forum_likes' THEN
    UPDATE public.forum_posts
    SET likes_count = (
      SELECT COUNT(*) FROM public.forum_likes WHERE post_id = NEW.post_id
    )
    WHERE id = NEW.post_id;
  END IF;
  RETURN NEW;
END;
$$;
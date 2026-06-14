-- platform_messages: service-role API only; explicit deny for PostgREST clients
CREATE POLICY "Deny anon access to platform_messages"
  ON public.platform_messages
  FOR ALL
  TO anon
  USING (false)
  WITH CHECK (false);

CREATE POLICY "Deny authenticated access to platform_messages"
  ON public.platform_messages
  FOR ALL
  TO authenticated
  USING (false)
  WITH CHECK (false);

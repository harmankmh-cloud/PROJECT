-- Ensure service role can read/write outreach pool (fixes "permission denied" on import API)
GRANT ALL ON TABLE va_outreach_leads TO service_role;
GRANT ALL ON TABLE va_outreach_leads TO postgres;

namespace Day12api.Security
{
    public class JWTOption
    {
        public string Issuer { get; set; } = "";
        public string Audience { get; set; } = "";
        public string Key { get; set; }
        public int ExpirationMinutes { get; set; } = 60;
    }
}

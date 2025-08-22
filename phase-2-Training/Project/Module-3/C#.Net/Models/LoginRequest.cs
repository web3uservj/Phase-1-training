using Newtonsoft.Json;

namespace Miniproject.Models
{
    public class LoginRequest
    {
        [JsonProperty("name")]       
        public string Name { get; set; }

        [JsonProperty("password")]   
        public string Password { get; set; }
    }

}

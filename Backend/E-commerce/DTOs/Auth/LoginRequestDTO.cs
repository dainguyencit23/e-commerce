using System.ComponentModel.DataAnnotations;

namespace E_commerce.DTOs.Login
{
    public class LoginRequestDTO
    {
        [Required(ErrorMessage = "Email is required.")]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Password is required.")]
        [MinLength(6)]
        public string Password { get; set; } = string.Empty;
    }
}

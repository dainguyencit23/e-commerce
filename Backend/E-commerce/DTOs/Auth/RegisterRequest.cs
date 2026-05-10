using System.ComponentModel.DataAnnotations;

namespace E_commerce.DTOs.Auth
{
    public class RegisterRequest
    {
        [Required(ErrorMessage = "Name can't be empty")]
        public string Name { get; set; } = string.Empty;
        [Required(ErrorMessage = "Email can't be empty")]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
        [Required(ErrorMessage = "Phone number can't be empty")]
        public string PhoneNumber { get; set; } = string.Empty;
        [Required, MinLength(6, ErrorMessage = "Password has at least 6 characters")]
        public string Password { get; set; } = string.Empty;
    }
}

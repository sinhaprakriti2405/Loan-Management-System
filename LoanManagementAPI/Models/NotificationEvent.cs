namespace LoanManagementAPI.Models
{
    public class NotificationEvent
    {
        public string UserId { get; set; }   
        public string Role { get; set; }     

        public string Title { get; set; }
        public string Message { get; set; }
    }

}

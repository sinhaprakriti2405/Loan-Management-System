using System.Threading.Channels;

namespace LoanManagementAPI.Models
{
    
    public static class NotificationQueue
    {
        public static Channel<NotificationEvent> Channel =
           System.Threading.Channels.Channel.CreateUnbounded<NotificationEvent>();
    }

}

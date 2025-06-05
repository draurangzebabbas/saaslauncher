import { useEffect, useState } from 'react';
import { format, formatDistanceToNow } from 'date-fns';
import { AlertCircle, Bell, CheckCircle, Clock, Users } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';

type Notification = {
  id: string;
  type: 'Task Due Soon' | 'Task Stuck' | 'Collaborator Update' | 'Phase Unlocked' | 'Project Completed';
  message: string;
  created_at: string;
  read: boolean;
};

type Props = {
  onClose: () => void;
};

export function NotificationsPopover({ onClose }: Props) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchNotifications() {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5);

        if (error) {
          throw error;
        }

        setNotifications(data || []);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchNotifications();
  }, [user]);

  const markAllAsRead = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user.id)
        .in('id', notifications.map(n => n.id));

      if (error) {
        throw error;
      }

      // Update local state
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'Task Due Soon':
        return <Clock className="h-5 w-5 text-amber-500" />;
      case 'Task Stuck':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'Collaborator Update':
        return <Users className="h-5 w-5 text-blue-500" />;
      case 'Phase Unlocked':
        return <Bell className="h-5 w-5 text-purple-500" />;
      case 'Project Completed':
        return <CheckCircle className="h-5 w-5 text-[#007a33]" />;
      default:
        return <Bell className="h-5 w-5 text-neutral-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    
    // If it's today, show relative time
    if (date.toDateString() === now.toDateString()) {
      return formatDistanceToNow(date, { addSuffix: true });
    }
    
    // Otherwise show the date
    return format(date, 'MMM d, yyyy');
  };

  return (
    <div className="absolute right-0 top-full mt-2 w-80 rounded-md border border-neutral-200 bg-white shadow-lg z-50">
      <div className="border-b border-neutral-200 px-4 py-2 flex justify-between items-center">
        <h2 className="font-medium">Notifications</h2>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={markAllAsRead}
          className="text-xs"
        >
          Mark all as read
        </Button>
      </div>
      
      <div className="max-h-[400px] overflow-y-auto">
        {isLoading ? (
          <div className="p-4 text-center text-neutral-500">Loading...</div>
        ) : notifications.length === 0 ? (
          <div className="p-4 text-center text-neutral-500">No notifications</div>
        ) : (
          <div>
            {notifications.map((notification) => (
              <div 
                key={notification.id}
                className={`px-4 py-3 border-b border-neutral-100 hover:bg-neutral-50 ${
                  notification.read ? 'opacity-70' : 'bg-blue-50/30'
                }`}
              >
                <div className="flex gap-3">
                  <div className="mt-0.5">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">{notification.message}</p>
                    <p className="text-xs text-neutral-500 mt-1">
                      {formatDate(notification.created_at)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="border-t border-neutral-200 px-4 py-2">
        <a 
          href="/notifications" 
          className="block text-center text-sm text-[#007a33] hover:underline"
          onClick={onClose}
        >
          View all notifications
        </a>
      </div>
    </div>
  );
}
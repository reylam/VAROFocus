import { useState, useMemo } from 'react';
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Clock, User2, Check, X, UserPlus, Search, UserMinus } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from '@tanstack/react-query';
import { Modal } from "@/components/ui/Modal";
import { 
  useFriends, 
  useFriendRequests, 
  useAcceptFriendRequest, 
  useRejectFriendRequest, 
  useRemoveFriend, 
  useSendFriendRequest 
} from '../../hooks/useFriendsHooks';
import { friendsAPI } from '@/api/friends';
import type { Friend, FriendRequest, User } from '@/types/models';
import useUiStore from '../../store/uiStore';

const FriendCard = ({ 
  friendObj, 
  onRemove 
}: { 
  friendObj: Friend; 
  onRemove: (id: string) => void;
}) => {
  const fr = friendObj.friend;
  if (!fr) return null;

  return (
    <Card className="flex items-center justify-between gap-4 p-4 border border-slate-100 hover:border-slate-200 transition bg-white rounded-2xl">
      <div className="flex gap-3 items-center">
        <img 
          src={fr.avatar_url || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${fr.username}`} 
          alt={fr.username} 
          className="w-12 h-12 rounded-full border border-slate-200"
        />
        <div className="flex flex-col">
          <h3 className="font-semibold text-slate-900 text-base">{fr.username}</h3>
          <span className="text-xs text-slate-500 font-medium">{fr.title || 'Focused Warrior'}</span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="bg-slate-100 text-slate-700 text-xs px-3 py-1.5 rounded-full font-semibold">Level {fr.level}</span>
        <button
          onClick={() => {
            if (window.confirm(`Unfriend ${fr.username}?`)) {
              onRemove(friendObj.id);
            }
          }}
          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition"
          title="Unfriend"
        >
          <UserMinus size={18} />
        </button>
      </div>
    </Card>
  );
};

const FriendRequestCard = ({ 
  request, 
  onAccept, 
  onReject 
}: { 
  request: FriendRequest; 
  onAccept: (id: string) => void; 
  onReject: (id: string) => void;
}) => {
  const sender = request.sender;
  if (!sender) return null;

  return (
    <Card className="flex items-center justify-between gap-4 p-3 border border-slate-100 bg-white rounded-2xl shadow-sm">
      <div className="flex gap-2.5 items-center">
        <img 
          src={sender.avatar_url || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${sender.username}`} 
          alt={sender.username} 
          className="w-10 h-10 rounded-full border border-slate-200"
        />
        <div className="flex flex-col">
          <h3 className="font-semibold text-slate-855 text-sm truncate max-w-[100px]">{sender.username}</h3>
          <span className="text-xs text-slate-400">Level {sender.level}</span>
        </div>
      </div>
      <div className="flex gap-1.5 shrink-0">
        <button 
          onClick={() => onAccept(request.id)}
          className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-100 flex items-center justify-center transition"
          title="Accept Request"
        >
          <Check size={16} />
        </button>
        <button 
          onClick={() => onReject(request.id)}
          className="w-8 h-8 rounded-full bg-rose-50 text-rose-600 hover:bg-rose-100 flex items-center justify-center transition"
          title="Decline Request"
        >
          <X size={16} />
        </button>
      </div>
    </Card>
  );
};

const RecommendedFriendCard = ({ 
  user, 
  onSendRequest,
  isSent
}: { 
  user: User; 
  onSendRequest: (id: string) => void;
  isSent: boolean;
}) => {
  return (
    <Card className="flex items-center justify-between gap-4 p-3 border border-slate-100 bg-white rounded-2xl shadow-sm">
      <div className="flex gap-2.5 items-center">
        <img 
          src={user.avatar_url || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${user.username}`} 
          alt={user.username} 
          className="w-10 h-10 rounded-full border border-slate-200"
        />
        <div className="flex flex-col">
          <h3 className="font-semibold text-slate-800 text-sm truncate max-w-[100px]">{user.username}</h3>
          <span className="text-xs text-slate-400">Level {user.level}</span>
        </div>
      </div>
      <Button 
        variant={isSent ? 'secondary' : 'primary'} 
        size="sm"
        disabled={isSent}
        onClick={() => onSendRequest(user.id)}
        className="flex items-center gap-1 py-1 px-3 text-xs shrink-0"
      >
        <UserPlus size={14} />
        {isSent ? 'Sent' : 'Add'}
      </Button>
    </Card>
  );
};

export function FriendsPage() {
  const addToast = useUiStore((state) => state.addToast);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Queries
  const { data: friends = [], isLoading: isFriendsLoading } = useFriends();
  const { data: friendRequests = [], isLoading: isRequestsLoading } = useFriendRequests();
  
  const { data: recommended = [] } = useQuery<User[]>({
    queryKey: ['recommendedUsers'],
    queryFn: () => friendsAPI.searchUsers('').then(res => res.data as User[]),
  });

  // Mutations
  const acceptMutation = useAcceptFriendRequest();
  const rejectMutation = useRejectFriendRequest();
  const removeMutation = useRemoveFriend();
  const sendRequestMutation = useSendFriendRequest();

  // Handle Actions
  const handleAccept = (requestId: string) => {
    acceptMutation.mutate(requestId, {
      onSuccess: () => addToast({ title: 'Request accepted', description: 'You are now friends!', variant: 'success' }),
      onError: () => addToast({ title: 'Failed to accept', description: 'Please try again.', variant: 'warning' })
    });
  };

  const handleReject = (requestId: string) => {
    rejectMutation.mutate(requestId, {
      onSuccess: () => addToast({ title: 'Request declined', description: 'Request removed.', variant: 'info' }),
      onError: () => addToast({ title: 'Failed to decline', description: 'Please try again.', variant: 'warning' })
    });
  };

  const handleRemove = (friendId: string) => {
    removeMutation.mutate(friendId, {
      onSuccess: () => addToast({ title: 'Friend removed', description: 'Removed from your friends list.', variant: 'info' }),
      onError: () => addToast({ title: 'Failed to remove', description: 'Please try again.', variant: 'warning' })
    });
  };

  const handleSendRequest = (userId: string) => {
    sendRequestMutation.mutate(userId, {
      onSuccess: () => addToast({ title: 'Request sent', description: 'Friend request sent successfully.', variant: 'success' }),
      onError: () => addToast({ title: 'Failed to send request', description: 'Please try again.', variant: 'warning' })
    });
  };

  // Search logic for adding friend modal
  const filteredSearch = useMemo(() => {
    if (!searchQuery.trim()) return recommended;
    return recommended.filter(u => u.username.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [searchQuery, recommended]);

  // Check if a recommended user has an active pending request or is already a friend
  const isRequestSent = (userId: string) => {
    return friendRequests.some(r => r.receiver_id === userId && r.status === 'pending');
  };

  return (
    <>
      <main className="space-y-6 pb-12">
        <header className="flex flex-col gap-2">
          <p className="text-sm uppercase tracking-[0.32em] text-[#17937f] font-semibold">Social Hub</p>
          <h1 className="text-3xl font-semibold text-slate-900">Friends Portal</h1>
          <p className="text-sm text-slate-500">Connect with other slayers, track streaks, and build your party.</p>
        </header>

        <div className="grid grid-cols-12 gap-6">
          {/* Main Friends List */}
          <Card className="col-span-8 p-6 flex flex-col min-h-[500px]">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-slate-900">All Friends</h2>
                <span className="bg-[#17937f]/10 text-[#17937f] text-xs font-bold px-2.5 py-1 rounded-full">
                  {friends.length}
                </span>
              </div>
              <Button 
                variant="primary" 
                size="sm" 
                icon={<UserPlus size={16} />} 
                onClick={() => setIsAddModalOpen(true)}
              >
                Add Friend
              </Button>
            </div>

            <div className="flex flex-col gap-4 mt-6 flex-1">
              {isFriendsLoading ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#17937f]" />
                  <p className="mt-3 text-sm">Loading party members...</p>
                </div>
              ) : friends.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <span className="text-4xl">👥</span>
                  <h3 className="mt-4 font-semibold text-slate-800">No friends yet</h3>
                  <p className="text-slate-500 text-sm max-w-sm mt-1">Adventure is better together. Click "Add Friend" to find other slayers!</p>
                </div>
              ) : (
                friends.map((friend) => (
                  <FriendCard key={friend.id} friendObj={friend} onRemove={handleRemove} />
                ))
              )}
            </div>
          </Card>

          {/* Right Sidebar: Requests & Recommended */}
          <div className="col-span-4 space-y-6">
            {/* Friend Requests */}
            <Card className="p-5 max-h-[350px] flex flex-col overflow-hidden">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
                <h2 className="text-lg font-bold text-slate-900">Friend Requests</h2>
                {friendRequests.length > 0 && (
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-xs font-bold text-red-600">
                    {friendRequests.length}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-3 overflow-y-auto flex-1 pr-1">
                {isRequestsLoading ? (
                  <p className="text-center py-8 text-xs text-slate-400">Loading requests...</p>
                ) : friendRequests.length === 0 ? (
                  <div className="text-center py-12 text-slate-400 text-sm">
                    <p>No pending requests.</p>
                  </div>
                ) : (
                  friendRequests.map((request) => (
                    <FriendRequestCard 
                      key={request.id} 
                      request={request} 
                      onAccept={handleAccept} 
                      onReject={handleReject} 
                    />
                  ))
                )}
              </div>
            </Card>

            {/* Recommended Friends */}
            <Card className="p-5 max-h-[380px] flex flex-col overflow-hidden">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
                <h2 className="text-lg font-bold text-slate-900">Recommended</h2>
              </div>

              <div className="flex flex-col gap-3 overflow-y-auto flex-1 pr-1">
                {recommended.length === 0 ? (
                  <div className="text-center py-12 text-slate-400 text-sm">
                    <p>No recommendations.</p>
                  </div>
                ) : (
                  recommended
                    .filter(u => !friends.some(f => f.friend_id === u.id))
                    .map((recUser) => (
                      <RecommendedFriendCard 
                        key={recUser.id} 
                        user={recUser} 
                        onSendRequest={handleSendRequest}
                        isSent={isRequestSent(recUser.id)}
                      />
                    ))
                )}
              </div>
            </Card>
          </div>
        </div>
      </main>

      {/* Add Friend Search Modal */}
      <Modal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        title="Add Friend"
      >
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by username..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 focus:border-[#17937f] focus:outline-none focus:ring-2 focus:ring-[#17937f]/20 transition text-slate-900"
            />
          </div>

          <div className="max-h-[300px] overflow-y-auto space-y-3 pr-1">
            {filteredSearch.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-sm">
                <p>No players found.</p>
              </div>
            ) : (
              filteredSearch.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 border border-slate-100 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <img 
                      src={user.avatar_url || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${user.username}`} 
                      alt={user.username} 
                      className="w-10 h-10 rounded-full border border-slate-200"
                    />
                    <div>
                      <h4 className="font-semibold text-slate-900 text-sm">{user.username}</h4>
                      <p className="text-xs text-slate-400">Level {user.level}</p>
                    </div>
                  </div>
                  <Button 
                    variant={isRequestSent(user.id) ? 'secondary' : 'primary'} 
                    size="sm"
                    disabled={isRequestSent(user.id)}
                    onClick={() => handleSendRequest(user.id)}
                    className="flex items-center gap-1 py-1.5 px-3 text-xs"
                  >
                    <UserPlus size={14} />
                    {isRequestSent(user.id) ? 'Sent' : 'Add'}
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      </Modal>
    </>
  );
}
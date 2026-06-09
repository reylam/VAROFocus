import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Clock, User2 } from "lucide-react";
import { Link } from "react-router-dom";


const FriendRequestCard = () => (
    <Card className="flex items-center justify-between gap-2">
        {/* Avatar */}
        <div className="flex gap-2 items-center">
            <div className="w-10 h-10 rounded-full bg-[#17937f] flex items-center justify-center">
                <Clock className="h-4 w-4 text-white" />
            </div>
            <div className="flex flex-col">
                <h2 className="font-semibold">Player Name</h2>
                <h2 className="text-slate-400">Level 2</h2>
            </div>

        </div>
        <div className="flex gap-2">

            <div className="w-10 h-10 rounded-full bg-[#17937f] flex items-center justify-center">
                <Clock className="h-4 w-4 text-white" />
            </div>
            <div className="w-10 h-10 rounded-full bg-red-700 flex items-center justify-center">
                <Clock className="h-4 w-4 text-white" />
            </div>
        </div>
    </Card>
)

const FriendCard = () => (
    <Card className="flex items-center justify-between gap-2">
        {/* Avatar */}
        <div className="flex gap-2 items-center">
            <div className="w-10 h-10 rounded-full bg-[#17937f] flex items-center justify-center">
                <Clock className="h-4 w-4 text-white" />
            </div>
            <h2 className="font-semibold">Player Name</h2>
        </div>
        <div className="flex gap-2">
            <h2 className="bg-slate-100 px-4 py-2 rounded-full">Level 2</h2>

            <div className="bg-orange-500 p-2 rounded-sm">
                <Clock className="h-5 w-5 text-white" />
            </div>
            <div className="bg-emerald-600 p-2 rounded-sm">
                <Clock className="h-5 w-5 text-white" />
            </div>
            <div className="bg-red-700 p-2 rounded-sm">
                <Clock className="h-5 w-5 text-white" />
            </div>
        </div>
    </Card>
)

export function FriendsPage() {
    return <>
        <main>
            <p className="text-slate-400"><Link to={"/Dashboard"}>Dashboard</Link> &gt; Friends</p>

            <div className="grid grid-cols-12 gap-4">
                <Card className="col-span-8 h-screen mb-10">
                    <div className="flex items-center gap-6 justify-between">
                        <div className="flex items-center gap-2">
                            <h2 className="text-2xl">All Friend</h2>
                            <h2 className="bg-[#f6fbfa] rounded-sm">99</h2>
                        </div>
                        <Button variant="ghost" size="sm">
                            <User2 /> Add Friend
                        </Button>
                    </div>

                    <div className="flex flex-col gap-4 pt-5">
                        <FriendCard />
                    </div>
                </Card>

                <div className="col-span-4">
                    {/* Friend Requests */}
                    <Card className="h-96 overflow-y-scroll">
                        <div className="flex justify-between">
                            <h2 className="text-2xl">Friend Requests</h2>
                            <div className="flex justify-center items-center bg-slate-100 w-10 h-10 rounded-full">
                                <span >4</span>
                            </div>
                        </div>


                        <div className="flex flex-col gap-4 pt-5">
                            <FriendRequestCard />
                            <FriendRequestCard />
                            <FriendRequestCard />
                            <FriendRequestCard />
                            <FriendRequestCard />
                            <FriendRequestCard />
                            <FriendRequestCard />
                        </div>
                    </Card>

                    {/* Recommended Friend */}
                    <Card className="h-96 overflow-y-scroll">
                        <div className="flex justify-between">
                            <h2 className="text-2xl">Recommended Friend</h2>
                            <div className="flex justify-center items-center bg-slate-100 w-10 h-10 rounded-full">
                                <span >4</span>
                            </div>
                        </div>


                        <div className="flex flex-col gap-4 pt-5">
                            <FriendRequestCard />
                            <FriendRequestCard />
                            <FriendRequestCard />
                            <FriendRequestCard />
                            <FriendRequestCard />
                            <FriendRequestCard />
                            <FriendRequestCard />
                        </div>
                    </Card>
                </div>

            </div>

        </main>
    </>
}
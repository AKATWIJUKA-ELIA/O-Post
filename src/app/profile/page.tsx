"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, Calendar, LayoutDashboardIcon, PenBoxIcon, Camera, BadgeCheck, ShieldAlert, KeyRound, LogOut, Phone, Clock, User as UserIcon, FileText, ThumbsUp, Check, X } from "lucide-react"
import useGetAllPosts from "@/hooks/useGetAllPosts"
import useLogout from "@/hooks/useLogout"
import { PostCard, BlockHeading } from "@/components/news-blocks"
import type { StoryLike } from "@/components/story-card"
import Link from "next/link"
import { useUser } from "@/hooks/useUser"
import type { Id } from "../../../convex/_generated/dataModel"
import type { UserProfile } from "@/lib/types"
import { getUserById } from "@/lib/convex"
import { User } from "@/lib/types"
import { formatDate, formatShortDate } from "@/lib/utils"
import { useNotification } from "../NotificationContext"
import { useUpdateUser } from "@/hooks/useUpdateUser"
import { useMutation } from "convex/react"
import { api } from "../../../convex/_generated/api"

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>()
        const [profile, setprofile] = useState<User|null>(null);
        const [profilepreview, setprofilepreview] = useState<string|null>(null);
        const [profileUpload, setprofileUpload] = useState<File|null>(null);
        const [username, setusername] = useState<string|null>(null);
        const [editUserName, setEditUserName] = useState<boolean>(false);
        const {setNotification} = useNotification();
        const {UpdateUser} = useUpdateUser();
        const [updatingProfile, setUpdatingProfile] = useState<boolean>(false);
          const generateUploadUrl = useMutation(api.posts.generateUploadUrl);

          const handleUpload = async (file:File|null) => {
        if(!file) {
                setNotification({
                        status: 'info',
                        message: 'No file selected for upload.',
                })
                return
         };
          const uploadUrl = await generateUploadUrl();
                        const res = await fetch(uploadUrl,
                        {
                                method:"post",
                                headers:{"Content-Type": file.type },
                                body: file
                        }
                )
                if(!res.ok){
                        throw new Error("Upload failed, Are you connected to the internet?");
                }
                const { storageId } = await res.json();
                        return storageId;

}
  useEffect(()=>{(async()=>{
          const{success,session}=await useUser();
          if(success&&session){
                  setUser({
                          userId:session.userId as Id<"users">,
                          role:session.role as string,
                          isVerified:session.isVerified as boolean,
                          expiresAt:session.expiresAt as Date,});
                          return;
                        }
                        setUser(null);
                })();
        },[]);

         useEffect(()=>{
                async function fetchAuthor(){
                                                                const response = await getUserById(user?.userId as Id<"users">);
                                                                setprofile(response.user);
                                                        }
                                                        fetchAuthor();
                                                  },[user?.userId])
        


          const handleImageChange = () => {
        const fileInput = document.createElement("input")
        fileInput.type = "file"
        fileInput.accept = "image/*"
        fileInput.onchange = () => {
          const file = fileInput.files ? fileInput.files[0] : null
                if (!file) {
                        setNotification({
                                status: 'info',
                                message: 'No file selected.',
                        })
                }

                if (file && file.size <= 3 * 1024 * 1024) {
                                setprofilepreview(URL.createObjectURL(file))
                                setprofileUpload(file)
                                return
                        
                
                }
                else {
                        setNotification({
                                status: 'error',
                                message: `File ${file?.name} size exceeds 3MB limit.`,
                        })
                }
        }
          fileInput.click();
} 
const handleCancel=()=>{
        setEditUserName(false);
        setusername(null);
        setprofilepreview(null);
        setprofileUpload(null);
}
        const handleUpdateProfile=async()=>{
                setUpdatingProfile(true);
                if(!profile){
                        setNotification({
                                status: 'error',
                                message: 'User profile not found.',
                        })
                        setUpdatingProfile(false);
                        return;
                }
                const storageId = profileUpload ? await handleUpload(profileUpload) : null;
                const response = await UpdateUser({
                        id: profile._id as Id<"users">,
                        username: username || profile.username||"",
                        profileImage: storageId
                });
                if (!response.success) {
                        setNotification({
                                status: 'error',
                                message: response.message||'Failed to update profile.',
                        });
                        setUpdatingProfile(false);
                        return;
                }
                setNotification({
                        status: 'success',
                        message: 'Profile updated successfully.',
                });
                setEditUserName(false);
                setusername(null);
                setprofilepreview(null);
                setprofileUpload(null);
                setUpdatingProfile(false);
                // Refresh the displayed profile with the saved values
                const refreshed = await getUserById(profile._id as Id<"users">);
                setprofile(refreshed.user);
        };

  const { data: posts } = useGetAllPosts()
  const { LogOut: logOut } = useLogout()

  const myPosts = ((posts ?? []) as unknown as (StoryLike & { authorId?: string; upvotes?: number })[]).filter(
    (post) => profile?._id && post.authorId === profile._id,
  )
  const upvotesReceived = myPosts.reduce((sum, post) => sum + (post.upvotes ?? 0), 0)
  const shownPosts = (myPosts.length > 0 ? myPosts : ((posts ?? []) as unknown as StoryLike[])).slice(0, 4)
  const hasPendingChanges = (editUserName && !!username?.trim()) || !!profileUpload
  const initial = profile?.username?.charAt(0).toUpperCase() ?? "U"

  const details = [
    { label: "Username", value: profile?.username, icon: UserIcon },
    { label: "Email", value: profile?.email, icon: Mail },
    { label: "Phone", value: profile?.phoneNumber || "Not provided", icon: Phone },
    { label: "Member since", value: profile?._creationTime ? formatShortDate(profile._creationTime) : "—", icon: Calendar },
    { label: "Last login", value: profile?.lastLogin ? formatDate(profile.lastLogin) : "—", icon: Clock },
  ]

  if (user === null) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 bg-[#f4f4f6] px-4 text-center">
        <p className="text-muted-foreground">You need to be signed in to view your account.</p>
        <Button asChild className="bg-crimson text-white hover:bg-crimson/90">
          <Link href="/sign-in">Log in</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f4f4f6] pb-16">
      {/* Cover */}
      <div className="relative h-40 overflow-hidden bg-gradient-to-r from-[#16161d] via-[#2a0d18] to-crimson sm:h-48">
        <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(115deg,transparent_0_28px,rgba(255,255,255,0.04)_28px_56px)]" />
      </div>

      <div className="mx-auto w-[95%] xl:w-[85%]">
        {/* Identity card */}
        <section className="relative -mt-16 rounded-lg border border-border bg-card p-5 shadow-sm sm:-mt-20 sm:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-end">
            <div className="relative -mt-16 w-fit sm:-mt-20">
              <Avatar className="h-28 w-28 border-4 border-card shadow-lg sm:h-32 sm:w-32">
                <AvatarImage src={profilepreview || profile?.profilePicture || undefined} alt={profile?.username} />
                <AvatarFallback className="bg-crimson font-serif text-5xl font-bold text-white">{initial}</AvatarFallback>
              </Avatar>
              <button
                onClick={() => handleImageChange()}
                className="absolute bottom-1 right-1 flex h-9 w-9 items-center justify-center rounded-full border-2 border-card bg-[#16161d] text-white shadow transition hover:bg-crimson"
                aria-label="Change profile picture"
                title="Change profile picture"
              >
                <Camera className="h-4 w-4" />
              </button>
            </div>

            <div className="min-w-0 flex-1">
              {editUserName ? (
                <div className="flex max-w-md items-center gap-2">
                  <Input
                    autoFocus
                    aria-label="New username"
                    value={username || ""}
                    placeholder={profile?.username || "Username"}
                    onChange={(e) => setusername(e.target.value)}
                    className="h-11 text-lg font-semibold"
                  />
                  <Button variant="ghost" size="icon" onClick={() => handleCancel()} aria-label="Cancel">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <h1 className="flex flex-wrap items-center gap-3 font-serif text-3xl font-bold text-foreground sm:text-4xl">
                  {profile?.username || "Your account"}
                  <button
                    onClick={() => setEditUserName(true)}
                    className="rounded-md p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                    aria-label="Edit username"
                    title="Edit username"
                  >
                    <PenBoxIcon className="h-5 w-5" />
                  </button>
                </h1>
              )}

              <div className="mt-3 flex flex-wrap items-center gap-2">
                {profile?.isVerified ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                    <BadgeCheck className="h-3.5 w-3.5" /> Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-700">
                    <ShieldAlert className="h-3.5 w-3.5" /> Not verified
                  </span>
                )}
                {profile?.role && (
                  <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold capitalize text-primary">{profile.role}</span>
                )}
                <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" /> <span className="break-all">{profile?.email}</span>
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {hasPendingChanges && (
                <Button onClick={() => handleUpdateProfile()} disabled={updatingProfile} className="bg-crimson text-white hover:bg-crimson/90">
                  <Check className="mr-1.5 h-4 w-4" />
                  {updatingProfile ? "Saving…" : "Save changes"}
                </Button>
              )}
              {profileUpload && !updatingProfile && (
                <Button variant="outline" onClick={() => handleCancel()}>
                  Discard
                </Button>
              )}
              {user?.role === "admin" && (
                <Button asChild variant="outline">
                  <Link href="/admin">
                    <LayoutDashboardIcon className="mr-1.5 h-4 w-4" /> Dashboard
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {/* Account details */}
          <section className="rounded-lg border border-border bg-card shadow-sm lg:col-span-2">
            <div className="border-b border-border px-5 py-4 sm:px-6">
              <h2 className="font-bold text-foreground">Account details</h2>
              <p className="text-xs text-muted-foreground">The information connected to your O-Post account.</p>
            </div>
            <dl className="divide-y divide-border">
              {details.map(({ label, value, icon: Icon }) => (
                <div key={label} className="flex items-center gap-4 px-5 py-3.5 sm:px-6">
                  <Icon className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                  <dt className="w-32 flex-shrink-0 text-sm text-muted-foreground">{label}</dt>
                  <dd className="min-w-0 break-words text-sm font-medium text-foreground">{value || "—"}</dd>
                </div>
              ))}
            </dl>
          </section>

          <div className="space-y-6">
            {myPosts.length > 0 && (
              <section className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
                  <FileText className="h-5 w-5 text-primary" />
                  <p className="mt-2 text-2xl font-bold tabular-nums">{myPosts.length}</p>
                  <p className="text-xs text-muted-foreground">Articles published</p>
                </div>
                <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
                  <ThumbsUp className="h-5 w-5 text-emerald-600" />
                  <p className="mt-2 text-2xl font-bold tabular-nums">{upvotesReceived}</p>
                  <p className="text-xs text-muted-foreground">Upvotes received</p>
                </div>
              </section>
            )}

            <section className="rounded-lg border border-border bg-card shadow-sm">
              <div className="border-b border-border px-5 py-4">
                <h2 className="font-bold text-foreground">Security</h2>
              </div>
              <div className="space-y-1 p-2">
                <Link href="/password-reset" className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition hover:bg-muted">
                  <KeyRound className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Change password</span>
                </Link>
                <button
                  onClick={() => logOut()}
                  className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm text-destructive transition hover:bg-destructive/10"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="font-medium">Log out</span>
                </button>
              </div>
            </section>
          </div>
        </div>

        {shownPosts.length > 0 && (
          <section className="mt-10">
            <BlockHeading title={myPosts.length > 0 ? "Your articles" : "Recommended for you"} />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {shownPosts.map((story) => (
                <PostCard key={story._id} story={story} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

// app/profile/page.jsx
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"   // ← this is correct if your auth.js is in lib/auth.js
import ProfileImageUpload from "@/components/ProfileImageUpload"
import { redirect } from "next/navigation"

export const metadata = { title: "My Profile" }

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)

  // If not logged in → redirect to signin
  if (!session) {
    redirect("/auth/signin")
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-8">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>
        
        <div className="space-y-6">
          <div>
            <span className="font-medium text-gray-600">Name:</span> {session.user.name || "—"}
          </div>
          <div>
            <span className="font-medium text-gray-600">Email:</span> {session.user.email}
          </div>
          <div>
            <span className="font-medium text-gray-600">Role:</span> {session.user.role}
          </div>

          <div className="pt-6 border-t">
            <h2 className="text-xl font-semibold mb-4">Profile Picture</h2>
            <ProfileImageUpload initialImage={session.user.profileImage} />
          </div>
        </div>
      </div>
    </div>
  )
}
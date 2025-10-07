"use client"
import React, { useEffect, useState } from 'react';
import { Mail, MapPin, Phone, Calendar ,Settings } from 'lucide-react';
import { useUser } from '@/hooks/useUser';
import { UserProfile } from '@/lib/types';
import { Id } from '../../../convex/_generated/dataModel';
import useGetUserById from '@/hooks/useGetUserById';
import {formatDate} from '@/lib/utils';
import Link from 'next/link';

const Profile = ()=> {

        const [user, setUser] = useState<UserProfile|null>(null);
        useEffect(() => {
                (async () => {
                        const { success, session } = await useUser();
                        if (success && session) {
                                setUser({
                                        userId: session.userId as Id<"users">,
                                        role: session.role as string,
                                        isVerified: session.isVerified as boolean,
                                        expiresAt: session.expiresAt as Date,
                                });
                                return;
                        }
                        setUser(null);

                })();
        }, []);
        const { user: userData, } = useGetUserById(user?.userId as Id<"users">);
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="relative h-48 bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500">
            <div className="absolute top-4 right-4 flex gap-2">
              <button className="p-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm hover:cursor-pointer rounded-lg transition-all duration-200">
                <Settings className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          <div className="relative px-6 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-6">
              <div className="relative -mt-20 mb-4 sm:mb-0">
                <div className="w-48 h-48 rounded-full border-4 border-blue shadow-xl overflow-hidden bg-gradient-to-br from-blue-400 to-cyan-600">
                  <img
                    src={userData?.profilePicture || '/default-profile.png'}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 border-4 border-white rounded-full"></div>
              </div>

              <div className="flex w-full p-4  justify-between">
                <h1 className="flex text-3xl font-bold text-gray-900">{userData?.username}</h1>
                <p className="flex text-lg text-gray-600 mt-1"> {userData?.role==="admin"?(
                        <Link href="/admin">
                        <span className="text-blue-600 hover:underline">Admin Dashboard</span>
                        </Link>
                ):(
                        <span className="text-gray-500">User</span>
                )} </p>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Email</p>
                  <p className="text-sm text-gray-900">{userData?.email}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Phone className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Phone</p>
                  <p className="text-sm text-gray-900">{userData?.phoneNumber}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Location</p>
                  <p className="text-sm text-gray-900">San Francisco, CA</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-cyan-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Member Since</p>
                  <p className="text-sm text-gray-900">{formatDate(userData?._creationTime||0)}</p>
                </div>
              </div>
            </div>


          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;

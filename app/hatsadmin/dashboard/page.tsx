"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronDown, Calendar, CheckCircle, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardMetrics } from "@/components/admin/dashboard-metrics"
import { RecentActivity } from "@/components/admin/recent-activity"

interface AdminUser {
  username: string;
  email: string;
  role: string;
  loginMethod: string;
}

export default function DashboardPage() {
  // Authentication is already handled by the layout
  // No need for separate auth check here
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Main content inside global layout header/sidebar */}
      <main className="p-3 sm:p-4 lg:p-6 xl:p-8 space-y-4 sm:space-y-6 lg:space-y-8">
          {/* Top Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 w-full sm:w-auto">
              <Button variant="outline" size="sm" className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border-slate-200/50 hover:bg-white hover:shadow-lg transition-all duration-200 rounded-xl px-3 sm:px-4 py-2 text-slate-700 hover:text-slate-900 text-xs sm:text-sm">
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-slate-600" />
                <span className="hidden sm:inline">Last 30 days</span>
                <span className="sm:hidden">30d</span>
                <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 text-slate-600" />
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border-slate-200/50 hover:bg-white hover:shadow-lg transition-all duration-200 rounded-xl px-3 sm:px-4 py-2 text-slate-700 hover:text-slate-900 text-xs sm:text-sm">
                <span className="hidden sm:inline">All channels</span>
                <span className="sm:hidden">All</span>
                <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 text-slate-600" />
              </Button>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 bg-white/60 backdrop-blur-sm px-2 sm:px-3 py-2 rounded-xl border border-slate-200/50">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-lg shadow-emerald-500/50"></div>
                <span className="hidden sm:inline">0 live visitors</span>
                <span className="sm:hidden">0 live</span>
              </div>
            </div>
          </div>

          <DashboardMetrics />

          {/* Guide/Tasks card (visual only) */}
          <Card className="bg-white/80 backdrop-blur-sm border-slate-200/50 shadow-xl rounded-2xl overflow-hidden">
            <CardContent className="p-4 sm:p-6 lg:p-8">
              <div className="flex flex-col lg:flex-row items-start justify-between gap-4">
                <div className="flex-1 w-full">
                  <div className="flex items-center gap-3 mb-3 sm:mb-4">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/25">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full"></div>
                    </div>
                    <span className="text-xs sm:text-sm text-slate-600 font-medium">1 of 6 tasks complete</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-slate-900">Get your first 10 sales</h2>
                  <p className="text-sm sm:text-base text-slate-600 mb-4 sm:mb-6 leading-relaxed">Consider the opportunities below to get more visitors, build trust, and start making sales.</p>
                  <div className="bg-gradient-to-r from-slate-50 to-slate-100 p-3 sm:p-4 lg:p-5 rounded-xl border border-slate-200/50">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-violet-500" />
                        <span className="text-xs sm:text-sm font-semibold text-slate-700">Up next: Drive traffic with Pinterest</span>
                      </div>
                      <Button variant="outline" size="sm" className="bg-white hover:bg-slate-50 border-slate-200 rounded-lg px-3 sm:px-4 py-2 font-medium text-xs sm:text-sm">Resume guide</Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activity combined with a simple store preview card */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            <Card className="bg-white/80 backdrop-blur-sm border-slate-200/50 shadow-xl rounded-2xl">
              <CardHeader className="pb-3 sm:pb-4 p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl font-bold text-slate-900">EVENOUR</CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl p-3 sm:p-4 lg:p-5 mb-4 sm:mb-6 h-20 sm:h-24" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-emerald-50 p-3 rounded-xl border border-emerald-200/50 gap-2 sm:gap-0">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
                      <span className="text-xs sm:text-sm font-medium text-emerald-700">Products added</span>
                    </div>
                    <Button variant="outline" size="sm" className="bg-white hover:bg-emerald-50 border-emerald-200 text-emerald-700 rounded-lg text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2 self-end sm:self-auto">Add more</Button>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-emerald-50 p-3 rounded-xl border border-emerald-200/50 gap-2 sm:gap-0">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
                      <span className="text-xs sm:text-sm font-medium text-emerald-700">Theme customized</span>
                    </div>
                    <Button variant="outline" size="sm" className="bg-white hover:bg-emerald-50 border-emerald-200 text-emerald-700 rounded-lg text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2 self-end sm:self-auto">Edit</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-slate-200/50 shadow-xl rounded-2xl">
              <CardHeader className="pb-3 sm:pb-4 p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl font-bold text-slate-900">Recent activity</CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <RecentActivity />
              </CardContent>
            </Card>
          </div>
      </main>
    </div>
  )
}

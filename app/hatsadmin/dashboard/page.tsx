"use client"

import { ChevronDown, Calendar, CheckCircle, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardMetrics } from "@/components/admin/dashboard-metrics"
import { RecentActivity } from "@/components/admin/recent-activity"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Main content inside global layout header/sidebar */}
      <main className="p-6 lg:p-8 space-y-8">
          {/* Top Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border-slate-200/50 hover:bg-white hover:shadow-lg transition-all duration-200 rounded-xl px-4 py-2">
                <Calendar className="w-4 h-4" />
                Last 30 days
                <ChevronDown className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border-slate-200/50 hover:bg-white hover:shadow-lg transition-all duration-200 rounded-xl px-4 py-2">
                All channels
                <ChevronDown className="w-4 h-4" />
              </Button>
              <div className="flex items-center gap-2 text-sm text-slate-600 bg-white/60 backdrop-blur-sm px-3 py-2 rounded-xl border border-slate-200/50">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-lg shadow-emerald-500/50"></div>
                0 live visitors
              </div>
            </div>
          </div>

          <DashboardMetrics />

          {/* Guide/Tasks card (visual only) */}
          <Card className="bg-white/80 backdrop-blur-sm border-slate-200/50 shadow-xl rounded-2xl overflow-hidden">
            <CardContent className="p-8">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-5 h-5 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/25">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <span className="text-sm text-slate-600 font-medium">1 of 6 tasks complete</span>
                  </div>
                  <h2 className="text-2xl font-bold mb-3 text-slate-900">Get your first 10 sales</h2>
                  <p className="text-slate-600 mb-6 leading-relaxed">Consider the opportunities below to get more visitors, build trust, and start making sales.</p>
                  <div className="bg-gradient-to-r from-slate-50 to-slate-100 p-5 rounded-xl border border-slate-200/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Sparkles className="w-5 h-5 text-violet-500" />
                        <span className="text-sm font-semibold text-slate-700">Up next: Drive traffic with Pinterest</span>
                      </div>
                      <Button variant="outline" size="sm" className="bg-white hover:bg-slate-50 border-slate-200 rounded-lg px-4 py-2 font-medium">Resume guide</Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activity combined with a simple store preview card */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="bg-white/80 backdrop-blur-sm border-slate-200/50 shadow-xl rounded-2xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold text-slate-900">EVENOUR</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl p-5 mb-6" />
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center justify-between bg-emerald-50 p-3 rounded-xl border border-emerald-200/50">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-emerald-600" />
                      <span className="text-sm font-medium text-emerald-700">Products added</span>
                    </div>
                    <Button variant="outline" size="sm" className="bg-white hover:bg-emerald-50 border-emerald-200 text-emerald-700 rounded-lg">Add more</Button>
                  </div>
                  <div className="flex items-center justify-between bg-emerald-50 p-3 rounded-xl border border-emerald-200/50">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-emerald-600" />
                      <span className="text-sm font-medium text-emerald-700">Theme customized</span>
                    </div>
                    <Button variant="outline" size="sm" className="bg-white hover:bg-emerald-50 border-emerald-200 text-emerald-700 rounded-lg">Edit</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-slate-200/50 shadow-xl rounded-2xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold text-slate-900">Recent activity</CardTitle>
              </CardHeader>
              <CardContent>
                <RecentActivity />
              </CardContent>
            </Card>
          </div>
      </main>
    </div>
  )
}

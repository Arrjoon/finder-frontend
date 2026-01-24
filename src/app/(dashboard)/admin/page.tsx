"use client";

import React from "react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatCard from "@/components/dashboard/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Building2,
  Users,
  MessageSquare,
  Star,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
} from "lucide-react";

export default function AdminDashboardPage() {
  const stats = [
    {
      title: "Total Businesses",
      value: "1,234",
      change: "+12% from last month",
      changeType: "positive" as const,
      icon: Building2,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-50",
    },
    {
      title: "Active Users",
      value: "8,456",
      change: "+8% from last month",
      changeType: "positive" as const,
      icon: Users,
      iconColor: "text-green-600",
      iconBg: "bg-green-50",
    },
    {
      title: "Pending Approvals",
      value: "23",
      change: "5 new today",
      changeType: "neutral" as const,
      icon: Clock,
      iconColor: "text-yellow-600",
      iconBg: "bg-yellow-50",
    },
    {
      title: "Total Reviews",
      value: "12,890",
      change: "+15% from last month",
      changeType: "positive" as const,
      icon: MessageSquare,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-50",
    },
  ];

  const recentBusinesses = [
    { id: 1, name: "Himalayan Restaurant", status: "approved", category: "Restaurant", date: "2 hours ago" },
    { id: 2, name: "Thamel Coffee House", status: "pending", category: "Cafe", date: "5 hours ago" },
    { id: 3, name: "Kathmandu Spa", status: "approved", category: "Spa", date: "1 day ago" },
    { id: 4, name: "Nepal Adventure Tours", status: "pending", category: "Tourism", date: "2 days ago" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <DashboardSidebar role="admin" />
      <main className="flex-1 overflow-x-hidden">
        <DashboardHeader 
          title="Admin Dashboard" 
          subtitle="Manage your platform and monitor activity" 
        />
        
        <div className="p-6 space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <StatCard key={idx} {...stat} />
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Businesses */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Recent Business Registrations</CardTitle>
                    <Button variant="outline" size="sm" className="text-blue-600 border-blue-600 hover:bg-blue-50">
                      View all
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentBusinesses.map((business) => (
                      <div
                        key={business.id}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-400 to-green-400 flex items-center justify-center text-white font-bold">
                            {business.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{business.name}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {business.category}
                              </Badge>
                              <span className="text-xs text-gray-500">{business.date}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {business.status === "approved" ? (
                            <Badge className="bg-green-600 text-white">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Approved
                            </Badge>
                          ) : (
                            <Badge className="bg-yellow-600 text-white">
                              <Clock className="h-3 w-3 mr-1" />
                              Pending
                            </Badge>
                          )}
                          <Button variant="outline" size="sm">
                            Review
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Analytics Chart Placeholder */}
              <Card>
                <CardHeader>
                  <CardTitle>Platform Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <TrendingUp className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                      <p className="text-gray-600">Analytics chart visualization</p>
                      <p className="text-sm text-gray-500">User growth, business registrations, reviews</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button className="w-full justify-start bg-blue-600 hover:bg-blue-700">
                    <Building2 className="h-4 w-4 mr-2" />
                    Add New Business
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="h-4 w-4 mr-2" />
                    Manage Users
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Review Moderation
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    View Reports
                  </Button>
                </CardContent>
              </Card>

              {/* System Alerts */}
              <Card>
                <CardHeader>
                  <CardTitle>System Alerts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-yellow-900">23 pending approvals</p>
                        <p className="text-xs text-yellow-700 mt-1">Requires your attention</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <CheckCircle2 className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-blue-900">System running smoothly</p>
                        <p className="text-xs text-blue-700">All services operational</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

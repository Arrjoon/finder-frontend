"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatCard from "@/components/dashboard/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ListPagination } from "@/components/ui/list-pagination";
import { drfTotalPages } from "@/lib/pagination";
import { useClampPageToTotalPages } from "@/hooks/usePagination";
import {
  USER_DASHBOARD_PAGE_SIZE,
  useCurrentUser,
  useMyActivitiesPaginated,
  useMyReviewsPaginated,
  useMySavedPlacesPaginated,
} from "@/hooks/user/useUserDashboard";
import {
  MessageSquare,
  Building2,
  Eye,
  Star,
  Bookmark,
  TrendingUp,
  User,
  Loader2,
} from "lucide-react";

function formatRelativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  let sec = Math.floor((Date.now() - then) / 1000);
  if (sec < 60) return "Just now";
  let min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  let hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  let day = Math.floor(hr / 24);
  if (day < 7) return `${day}d ago`;
  return new Date(iso).toLocaleDateString();
}

function contributorLabel(reviewCount: number): string {
  if (reviewCount >= 20) return "Top contributor";
  if (reviewCount >= 5) return "Active reviewer";
  if (reviewCount >= 1) return "Contributor";
  return "Getting started";
}

function activityTypeLabel(type: string): string {
  return type
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

const ACTIVITY_ICON_MAP: Record<string, LucideIcon> = {
  review_created: MessageSquare,
  review_updated: MessageSquare,
  photo_uploaded: Eye,
  place_saved: Bookmark,
  place_unsaved: Bookmark,
  helpful_vote: Star,
  business_created: Building2,
  business_updated: Building2,
  profile_updated: User,
  follow_user: User,
  unfollow_user: User,
};

function activityIcon(type: string): LucideIcon {
  return ACTIVITY_ICON_MAP[type] ?? TrendingUp;
}

export default function UserDashboardPage() {
  const [activityPage, setActivityPage] = useState(1);
  const [reviewsPage, setReviewsPage] = useState(1);
  const [savedPage, setSavedPage] = useState(1);

  const { data: me, isLoading: meLoading, isError: meError } = useCurrentUser();
  const activitiesQ = useMyActivitiesPaginated(activityPage);
  const reviewsQ = useMyReviewsPaginated(reviewsPage);
  const savedQ = useMySavedPlacesPaginated(savedPage);

  const profile = me?.profile;

  const activityTotalPages = drfTotalPages(
    activitiesQ.data?.count ?? 0,
    USER_DASHBOARD_PAGE_SIZE
  );
  const reviewsTotalPages = drfTotalPages(
    reviewsQ.data?.count ?? 0,
    USER_DASHBOARD_PAGE_SIZE
  );
  const savedTotalPages = drfTotalPages(
    savedQ.data?.count ?? 0,
    USER_DASHBOARD_PAGE_SIZE
  );

  useClampPageToTotalPages(activityTotalPages, setActivityPage);
  useClampPageToTotalPages(reviewsTotalPages, setReviewsPage);
  useClampPageToTotalPages(savedTotalPages, setSavedPage);

  const stats = useMemo(() => {
    const rc = profile?.review_count ?? 0;
    const ps = profile?.places_saved ?? 0;
    const ph = profile?.photos_uploaded ?? 0;
    const hv = profile?.helpful_votes ?? 0;
    return [
      {
        title: "Reviews written",
        value: String(rc),
        change: "Total on your profile",
        changeType: "neutral" as const,
        icon: MessageSquare,
        iconColor: "text-blue-600",
        iconBg: "bg-blue-50",
      },
      {
        title: "Saved places",
        value: String(ps),
        change: "Bookmarks",
        changeType: "neutral" as const,
        icon: Building2,
        iconColor: "text-green-600",
        iconBg: "bg-green-50",
      },
      {
        title: "Photos added",
        value: String(ph),
        change: "Total uploads",
        changeType: "neutral" as const,
        icon: Eye,
        iconColor: "text-blue-600",
        iconBg: "bg-blue-50",
      },
      {
        title: "Helpful votes",
        value: String(hv),
        change: "Received on your reviews",
        changeType: "neutral" as const,
        icon: Star,
        iconColor: "text-yellow-600",
        iconBg: "bg-yellow-50",
      },
    ];
  }, [profile]);

  const displayName = me
    ? [me.first_name, me.last_name].filter(Boolean).join(" ").trim() ||
      me.username ||
      ""
    : "";

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <DashboardSidebar role="user" />
      <main className="flex-1 overflow-x-hidden">
        <DashboardHeader
          title="My Dashboard"
          subtitle={
            meLoading
              ? "Loading your account…"
              : meError
                ? "Could not load profile"
                : displayName
                  ? `Hi ${displayName} — your activity and contributions`
                  : "Your activity and contributions"
          }
        />

        <div className="p-6 space-y-6">
          {meError ? (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="py-4 text-sm text-red-800">
                We couldn’t load your profile. Check that you’re signed in and try
                refreshing the page.
              </CardContent>
            </Card>
          ) : null}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {meLoading && !profile ? (
              <>
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6 h-28 bg-gray-100 rounded-xl" />
                  </Card>
                ))}
              </>
            ) : (
              stats.map((stat, idx) => <StatCard key={idx} {...stat} />)
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent activity</CardTitle>
                </CardHeader>
                <CardContent>
                  {activitiesQ.isLoading && !activitiesQ.data ? (
                    <div className="flex justify-center py-12 text-gray-500">
                      <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                  ) : activitiesQ.isError ? (
                    <p className="text-sm text-red-600">
                      Failed to load activity.{" "}
                      <Button
                        variant="link"
                        className="p-0 h-auto"
                        onClick={() => activitiesQ.refetch()}
                      >
                        Retry
                      </Button>
                    </p>
                  ) : (activitiesQ.data?.results.length ?? 0) === 0 ? (
                    <p className="text-sm text-gray-600 py-6 text-center">
                      No activity yet. Reviews, saves, and uploads will show up
                      here.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {activitiesQ.data!.results.map((activity) => {
                        const Icon = activityIcon(activity.activity_type);
                        return (
                          <div
                            key={activity.id}
                            className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-400 to-green-400 flex items-center justify-center text-white shrink-0">
                              <Icon className="h-5 w-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-gray-900">
                                {activity.description}
                              </p>
                              <p className="text-xs text-gray-500 mt-0.5">
                                {activityTypeLabel(activity.activity_type)}
                                {activity.business?.name
                                  ? ` · ${activity.business.name}`
                                  : ""}
                              </p>
                              <span className="text-xs text-gray-500 mt-1 inline-block">
                                {formatRelativeTime(activity.created_at)}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                      <ListPagination
                        page={activityPage}
                        totalPages={activityTotalPages}
                        hasPrevious={Boolean(activitiesQ.data?.previous)}
                        hasNext={Boolean(activitiesQ.data?.next)}
                        onPageChange={setActivityPage}
                        totalCount={activitiesQ.data?.count}
                        isFetching={activitiesQ.isFetching}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>My reviews</CardTitle>
                </CardHeader>
                <CardContent>
                  {reviewsQ.isLoading && !reviewsQ.data ? (
                    <div className="flex justify-center py-12 text-gray-500">
                      <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                  ) : reviewsQ.isError ? (
                    <p className="text-sm text-red-600">
                      Failed to load reviews.{" "}
                      <Button
                        variant="link"
                        className="p-0 h-auto"
                        onClick={() => reviewsQ.refetch()}
                      >
                        Retry
                      </Button>
                    </p>
                  ) : (reviewsQ.data?.results.length ?? 0) === 0 ? (
                    <p className="text-sm text-gray-600 py-6 text-center">
                      You haven’t written any reviews yet.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {reviewsQ.data!.results.map((review) => (
                        <div
                          key={review.id}
                          className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-start justify-between mb-2 gap-2">
                            <div className="min-w-0">
                              <Link
                                href={`/listings/${review.business.slug}`}
                                className="font-semibold text-gray-900 hover:text-blue-600"
                              >
                                {review.business.name}
                              </Link>
                              <div className="flex flex-wrap items-center gap-2 mt-1">
                                <div className="flex items-center gap-0.5">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      className={`h-3 w-3 ${
                                        star <= review.rating
                                          ? "fill-yellow-400 text-yellow-400"
                                          : "text-gray-300"
                                      }`}
                                    />
                                  ))}
                                </div>
                                {review.business.primary_category_name ? (
                                  <Badge variant="outline" className="text-xs">
                                    {review.business.primary_category_name}
                                  </Badge>
                                ) : null}
                                <Badge variant="secondary" className="text-xs">
                                  {review.status}
                                </Badge>
                              </div>
                            </div>
                            <span className="text-xs text-gray-500 shrink-0">
                              {formatRelativeTime(review.created_at)}
                            </span>
                          </div>
                          {review.title ? (
                            <p className="text-sm font-medium text-gray-800 mb-1">
                              {review.title}
                            </p>
                          ) : null}
                          <p className="text-sm text-gray-700 line-clamp-3">
                            {review.content}
                          </p>
                        </div>
                      ))}
                      <ListPagination
                        page={reviewsPage}
                        totalPages={reviewsTotalPages}
                        hasPrevious={Boolean(reviewsQ.data?.previous)}
                        hasNext={Boolean(reviewsQ.data?.next)}
                        onPageChange={setReviewsPage}
                        totalCount={reviewsQ.data?.count}
                        isFetching={reviewsQ.isFetching}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quick actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link href="/dashboard/user/profile" className="w-full block">
                    <Button className="w-full justify-start bg-blue-600 hover:bg-blue-700">
                      <User className="h-4 w-4 mr-2" />
                      Edit profile
                    </Button>
                  </Link>
                  <Button className="w-full justify-start bg-green-600 hover:bg-green-700">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Write a review
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Building2 className="h-4 w-4 mr-2" />
                    Add business
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Eye className="h-4 w-4 mr-2" />
                    Upload photos
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Saved places</CardTitle>
                </CardHeader>
                <CardContent>
                  {savedQ.isLoading && !savedQ.data ? (
                    <div className="flex justify-center py-8 text-gray-500">
                      <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                  ) : savedQ.isError ? (
                    <p className="text-sm text-red-600">
                      Failed to load saved places.{" "}
                      <Button
                        variant="link"
                        className="p-0 h-auto"
                        onClick={() => savedQ.refetch()}
                      >
                        Retry
                      </Button>
                    </p>
                  ) : (savedQ.data?.results.length ?? 0) === 0 ? (
                    <p className="text-sm text-gray-600 py-4 text-center">
                      No saved places yet.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {savedQ.data!.results.map((row) => (
                        <Link
                          key={row.id}
                          href={`/listings/${row.business.slug}`}
                          className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-gray-900 text-sm">
                                {row.business.name}
                              </p>
                              <div className="flex items-center gap-2 mt-1 flex-wrap">
                                {row.business.primary_category_name ? (
                                  <Badge variant="outline" className="text-xs">
                                    {row.business.primary_category_name}
                                  </Badge>
                                ) : null}
                                <div className="flex items-center gap-1">
                                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                  <span className="text-xs text-gray-600">
                                    {row.business.rating != null
                                      ? Number(row.business.rating).toFixed(1)
                                      : "—"}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <Bookmark className="h-4 w-4 text-green-600 shrink-0" />
                          </div>
                        </Link>
                      ))}
                      <ListPagination
                        page={savedPage}
                        totalPages={savedTotalPages}
                        hasPrevious={Boolean(savedQ.data?.previous)}
                        hasNext={Boolean(savedQ.data?.next)}
                        onPageChange={setSavedPage}
                        totalCount={savedQ.data?.count}
                        isFetching={savedQ.isFetching}
                        className="mt-2"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Your contributions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <span className="text-sm font-medium text-blue-900">
                        {contributorLabel(profile?.review_count ?? 0)}
                      </span>
                      <Badge className="bg-blue-600 text-white">
                        {profile?.review_count ?? 0} reviews
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                      <span className="text-sm font-medium text-green-900">
                        Photos
                      </span>
                      <Badge className="bg-green-600 text-white">
                        {profile?.photos_uploaded ?? 0}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <span className="text-sm font-medium text-yellow-900">
                        Helpful votes
                      </span>
                      <Badge className="bg-yellow-600 text-white">
                        {profile?.helpful_votes ?? 0}
                      </Badge>
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

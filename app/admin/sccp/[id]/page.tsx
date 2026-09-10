"use client";

import { useParams } from "next/navigation";
import SccpDetailPage from "@/containers/admin/sccp/SccpDetailPage";

export default function AdminSccpDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  if (!id) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-gray-100 text-center text-gray-500">
        Loading...
      </div>
    );
  }

  return <SccpDetailPage basePath="/admin/sccp" registrationId={id} />;
}

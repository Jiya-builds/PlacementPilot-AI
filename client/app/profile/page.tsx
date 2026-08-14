"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/api";

type ProfileForm = {
  college: string;
  branch: string;
  cgpa: string;
  graduationYear: string;
  skills: string; // comma-separated in the UI, array on the backend
  github: string;
  linkedin: string;
  leetcode: string;
};

const emptyForm: ProfileForm = {
  college: "",
  branch: "",
  cgpa: "",
  graduationYear: "",
  skills: "",
  github: "",
  linkedin: "",
  leetcode: "",
};

export default function ProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<ProfileForm>(emptyForm);
  const [message, setMessage] = useState("");

  const fetchProfile = async () => {
    try {
      const res = await api.get("/auth/profile");

      setUser(res.data.user);

      setForm({
        college: res.data.user.college || "",
        branch: res.data.user.branch || "",
        cgpa: res.data.user.cgpa ? String(res.data.user.cgpa) : "",
        graduationYear: res.data.user.graduationYear
          ? String(res.data.user.graduationYear)
          : "",
        skills: (res.data.user.skills || []).join(", "),
        github: res.data.user.github || "",
        linkedin: res.data.user.linkedin || "",
        leetcode: res.data.user.leetcode || "",
      });
    } catch (error: any) {
      console.log(error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (field: keyof ProfileForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const saveProfile = async () => {
    setMessage("");
    setSaving(true);

    try {
      const payload = {
        college: form.college,
        branch: form.branch,
        cgpa: form.cgpa ? Number(form.cgpa) : undefined,
        graduationYear: form.graduationYear ? Number(form.graduationYear) : undefined,
        skills: form.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        github: form.github,
        linkedin: form.linkedin,
        leetcode: form.leetcode,
      };

      const res = await api.put("/auth/profile", payload);

      setUser(res.data.user);
      setEditing(false);
      setMessage("Profile updated successfully ✅");
    } catch (error: any) {
      console.log(error.response?.data || error.message);
      setMessage("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050816] flex items-center justify-center">
        <h1 className="text-white text-xl">Loading Profile...</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050816] p-10">
      <div className="flex items-center justify-between max-w-xl mb-8">
        <h1 className="text-4xl font-bold text-white">My Profile 👤</h1>

        <button
          onClick={() => router.push("/dashboard")}
          className="text-gray-400 hover:text-white text-sm"
        >
          ← Back
        </button>
      </div>

      {user && (
        <div className="max-w-xl rounded-3xl bg-white/5 border border-white/10 p-8">
          <h2 className="text-2xl text-white font-bold">{user.name}</h2>
          <p className="text-gray-400 mt-1">{user.email}</p>

          <div className="mt-4 text-gray-300 text-sm">
            <p>
              Resume: {user.resume ? "Uploaded ✅" : "Not Uploaded ❌"}
            </p>
            <p className="mt-1">
              AI Analysis: {user.analysis ? "Completed ✅" : "Pending"}
            </p>
          </div>

          <div className="mt-8 border-t border-white/10 pt-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">
                Additional Details
              </h3>

              {!editing && (
                <button
                  onClick={() => setEditing(true)}
                  className="text-sm text-purple-400 hover:text-purple-300"
                >
                  Edit
                </button>
              )}
            </div>

            {editing ? (
              <div className="space-y-4">
                <ProfileField
                  label="College"
                  value={form.college}
                  onChange={(v) => handleChange("college", v)}
                />
                <ProfileField
                  label="Branch"
                  value={form.branch}
                  onChange={(v) => handleChange("branch", v)}
                />
                <div className="grid grid-cols-2 gap-4">
                  <ProfileField
                    label="CGPA"
                    value={form.cgpa}
                    onChange={(v) => handleChange("cgpa", v)}
                    type="number"
                  />
                  <ProfileField
                    label="Graduation Year"
                    value={form.graduationYear}
                    onChange={(v) => handleChange("graduationYear", v)}
                    type="number"
                  />
                </div>
                <ProfileField
                  label="Skills (comma separated)"
                  value={form.skills}
                  onChange={(v) => handleChange("skills", v)}
                  placeholder="React, Node.js, Python"
                />
                <ProfileField
                  label="GitHub URL"
                  value={form.github}
                  onChange={(v) => handleChange("github", v)}
                />
                <ProfileField
                  label="LinkedIn URL"
                  value={form.linkedin}
                  onChange={(v) => handleChange("linkedin", v)}
                />
                <ProfileField
                  label="LeetCode URL"
                  value={form.leetcode}
                  onChange={(v) => handleChange("leetcode", v)}
                />

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={saveProfile}
                    disabled={saving}
                    className="px-6 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold disabled:opacity-60"
                  >
                    {saving ? "Saving..." : "Save"}
                  </button>

                  <button
                    onClick={() => setEditing(false)}
                    className="px-6 py-2 rounded-xl bg-white/10 border border-white/10 text-white"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-gray-300 text-sm">
                <ProfileRow label="College" value={user.college} />
                <ProfileRow label="Branch" value={user.branch} />
                <ProfileRow label="CGPA" value={user.cgpa} />
                <ProfileRow label="Graduation Year" value={user.graduationYear} />
                <ProfileRow
                  label="Skills"
                  value={user.skills?.length ? user.skills.join(", ") : ""}
                />
                <ProfileRow label="GitHub" value={user.github} />
                <ProfileRow label="LinkedIn" value={user.linkedin} />
                <ProfileRow label="LeetCode" value={user.leetcode} />
              </div>
            )}

            {message && (
              <p className="text-center text-purple-400 mt-5 text-sm">
                {message}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function ProfileField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="text-xs text-gray-400">{label}</label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white outline-none placeholder:text-gray-600 focus:border-purple-500"
      />
    </div>
  );
}

function ProfileRow({ label, value }: { label: string; value?: string | number }) {
  return (
    <div className="flex justify-between border-b border-white/5 pb-2">
      <span className="text-gray-500">{label}</span>
      <span className="text-white">{value || "—"}</span>
    </div>
  );
}

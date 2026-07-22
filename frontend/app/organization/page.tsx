"use client";

import React, { useEffect, useState } from "react";
import { OrganizationSwitcher, OrgSummary } from "@/features/organization/components/OrganizationSwitcher";
import { OrganizationDashboardComponent } from "@/features/organization/components/OrganizationDashboardComponent";
import { MemberManagementComponent, Member } from "@/features/organization/components/MemberManagementComponent";
import { RoleEditorComponent, Role } from "@/features/organization/components/RoleEditorComponent";
import { GroupManagementComponent, Group } from "@/features/organization/components/GroupManagementComponent";
import { WorkspaceManagerComponent, Workspace } from "@/features/organization/components/WorkspaceManagerComponent";
import { PolicyManagerComponent, Policy } from "@/features/organization/components/PolicyManagerComponent";
import { Building2, Users, KeyRound, Layers, ShieldCheck, Plus, RefreshCw } from "lucide-react";

export default function OrganizationPage() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "members" | "roles" | "groups" | "workspaces" | "policies">("dashboard");
  const [organizations, setOrganizations] = useState<OrgSummary[]>([]);
  const [activeOrgId, setActiveOrgId] = useState<string | null>(null);

  const [activeOrg, setActiveOrg] = useState<any>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateOrgModal, setShowCreateOrgModal] = useState(false);

  const [newOrgName, setNewOrgName] = useState("");
  const [newOrgSlug, setNewOrgSlug] = useState("");

  const fetchOrganizations = async () => {
    try {
      const res = await fetch("/api/v1/organizations");
      if (res.ok) {
        const data = await res.json();
        setOrganizations(data || []);
        if (!activeOrgId && data && data.length > 0) {
          setActiveOrgId(data[0].id);
        }
      }
    } catch (err) {
      console.error("Failed to load organizations", err);
    }
  };

  const fetchOrgDetails = async (orgId: string) => {
    try {
      setLoading(true);
      const [settingsRes, membersRes, rolesRes, groupsRes, wsRes, polRes] = await Promise.all([
        fetch(`/api/v1/organizations/settings?organization_id=${orgId}`).then((r) => r.json()).catch(() => null),
        fetch(`/api/v1/organizations/members?organization_id=${orgId}`).then((r) => r.json()).catch(() => []),
        fetch(`/api/v1/organizations/roles?organization_id=${orgId}`).then((r) => r.json()).catch(() => []),
        fetch(`/api/v1/organizations/groups?organization_id=${orgId}`).then((r) => r.json()).catch(() => []),
        fetch(`/api/v1/organizations/workspaces?organization_id=${orgId}`).then((r) => r.json()).catch(() => []),
        fetch(`/api/v1/organizations/policies?organization_id=${orgId}`).then((r) => r.json()).catch(() => []),
      ]);

      if (settingsRes) setActiveOrg(settingsRes);
      if (Array.isArray(membersRes)) setMembers(membersRes);
      if (Array.isArray(rolesRes)) setRoles(rolesRes);
      if (Array.isArray(groupsRes)) setGroups(groupsRes);
      if (Array.isArray(wsRes)) setWorkspaces(wsRes);
      if (Array.isArray(polRes)) setPolicies(polRes);
    } catch (err) {
      console.error("Failed to load org details", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);

  useEffect(() => {
    if (activeOrgId) {
      fetchOrgDetails(activeOrgId);
    }
  }, [activeOrgId]);

  const handleCreateOrgSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newOrgName && newOrgSlug) {
      try {
        const res = await fetch("/api/v1/organizations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: newOrgName, slug: newOrgSlug }),
        });
        if (res.ok) {
          const created = await res.json();
          await fetchOrganizations();
          setActiveOrgId(created.id);
          setShowCreateOrgModal(false);
          setNewOrgName("");
          setNewOrgSlug("");
        }
      } catch (err) {
        console.error("Failed to create organization", err);
      }
    }
  };

  const handleInvite = async (email: string, roleId: string) => {
    if (!activeOrgId) return;
    await fetch("/api/v1/organizations/invite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ organization_id: activeOrgId, email, role_id: roleId }),
    });
    fetchOrgDetails(activeOrgId);
  };

  const handleStatusChange = async (userId: string, status: string) => {
    if (!activeOrgId) return;
    await fetch("/api/v1/organizations/members/status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ organization_id: activeOrgId, user_id: userId, status }),
    });
    fetchOrgDetails(activeOrgId);
  };

  const handleCreateRole = async (name: string, desc: string, perms: string[]) => {
    if (!activeOrgId) return;
    await fetch("/api/v1/organizations/roles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ organization_id: activeOrgId, name, description: desc, permissions: perms }),
    });
    fetchOrgDetails(activeOrgId);
  };

  const handleCreateGroup = async (name: string, type: string) => {
    if (!activeOrgId) return;
    await fetch("/api/v1/organizations/groups", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ organization_id: activeOrgId, name, type, member_user_ids: [] }),
    });
    fetchOrgDetails(activeOrgId);
  };

  const handleCreateWorkspace = async (name: string, type: string, dept: string) => {
    if (!activeOrgId) return;
    await fetch("/api/v1/organizations/workspaces", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ organization_id: activeOrgId, name, type, department: dept }),
    });
    fetchOrgDetails(activeOrgId);
  };

  const handleTogglePolicy = async (type: string, enabled: boolean) => {
    if (!activeOrgId) return;
    await fetch("/api/v1/organizations/policies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ organization_id: activeOrgId, type, is_enabled: enabled, rules: {} }),
    });
    fetchOrgDetails(activeOrgId);
  };

  return (
    <div className="container max-w-7xl mx-auto py-8 px-4 space-y-8">
      {/* Header Bar with Context Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Enterprise Organization Portal</h1>
          <p className="text-muted-foreground mt-1">
            Multi-tenant enterprise administration, workspace hierarchy, RBAC & security governance
          </p>
        </div>
        <div className="flex items-center gap-3">
          <OrganizationSwitcher
            organizations={organizations}
            activeOrgId={activeOrgId}
            onSelectOrg={(id) => setActiveOrgId(id)}
            onCreateOrg={() => setShowCreateOrgModal(true)}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b space-x-4 overflow-x-auto">
        <button
          onClick={() => setActiveTab("dashboard")}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === "dashboard" ? "border-accent text-accent" : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Building2 className="w-4 h-4" /> Overview
        </button>
        <button
          onClick={() => setActiveTab("members")}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === "members" ? "border-accent text-accent" : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Users className="w-4 h-4" /> Members
        </button>
        <button
          onClick={() => setActiveTab("roles")}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === "roles" ? "border-accent text-accent" : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <KeyRound className="w-4 h-4" /> Roles & RBAC
        </button>
        <button
          onClick={() => setActiveTab("groups")}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === "groups" ? "border-accent text-accent" : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Users className="w-4 h-4" /> Teams & Groups
        </button>
        <button
          onClick={() => setActiveTab("workspaces")}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === "workspaces" ? "border-accent text-accent" : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Layers className="w-4 h-4" /> Workspaces
        </button>
        <button
          onClick={() => setActiveTab("policies")}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === "policies" ? "border-accent text-accent" : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <ShieldCheck className="w-4 h-4" /> Governance Policies
        </button>
      </div>

      {/* Content */}
      <div>
        {activeTab === "dashboard" && (
          <OrganizationDashboardComponent
            organization={activeOrg}
            membersCount={members.length}
            workspacesCount={workspaces.length}
            rolesCount={roles.length}
            policiesCount={policies.length}
          />
        )}
        {activeTab === "members" && (
          <MemberManagementComponent
            members={members}
            onInvite={handleInvite}
            onStatusChange={handleStatusChange}
            onTransferOwnership={(uid) => {}}
          />
        )}
        {activeTab === "roles" && <RoleEditorComponent roles={roles} onCreateRole={handleCreateRole} />}
        {activeTab === "groups" && <GroupManagementComponent groups={groups} onCreateGroup={handleCreateGroup} />}
        {activeTab === "workspaces" && (
          <WorkspaceManagerComponent workspaces={workspaces} onCreateWorkspace={handleCreateWorkspace} />
        )}
        {activeTab === "policies" && (
          <PolicyManagerComponent policies={policies} onTogglePolicy={handleTogglePolicy} />
        )}
      </div>

      {/* Create Org Modal */}
      {showCreateOrgModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <form onSubmit={handleCreateOrgSubmit} className="bg-card border rounded-xl p-6 w-full max-w-md space-y-4 shadow-xl">
            <h3 className="text-lg font-bold">Create Enterprise Organization</h3>
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Organization Name</label>
              <input
                type="text"
                required
                value={newOrgName}
                onChange={(e) => {
                  setNewOrgName(e.target.value);
                  setNewOrgSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, "-"));
                }}
                placeholder="Acme Corp"
                className="w-full mt-1 px-3 py-2 border rounded-lg bg-secondary text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground">URL Slug</label>
              <input
                type="text"
                required
                value={newOrgSlug}
                onChange={(e) => setNewOrgSlug(e.target.value)}
                placeholder="acme-corp"
                className="w-full mt-1 px-3 py-2 border rounded-lg bg-secondary text-xs font-mono"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCreateOrgModal(false)}
                className="px-4 py-2 rounded-lg border text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold"
              >
                Create Organization
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

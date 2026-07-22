"use client";

import React, { useState } from "react";
import { Shield, Sparkles, FolderKey, Search, Lock, RefreshCw, CheckCircle2, Info, Table as TableIcon } from "lucide-react";
import { ThemeProvider, useTheme } from "../../providers/theme-provider";
import { Button } from "../../components/ui/button";
import { Input, PasswordInput, SearchInput, Textarea } from "../../components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/ui/tabs";
import { Alert } from "../../components/feedback/alert";
import { Spinner } from "../../components/feedback/spinner";
import { Skeleton } from "../../components/feedback/skeleton";
import { EmptyState } from "../../components/feedback/empty-state";
import { ErrorState } from "../../components/feedback/error-state";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../../components/ui/table";
import { Tooltip } from "../../components/ui/tooltip";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "../../components/overlay/dialog";
import { Container, Grid, Section } from "../../components/layout/layout-primitives";
import { TopNavigation, Breadcrumb } from "../../components/layout/top-navigation";

function DesignSystemContent() {
  const { theme, toggleTheme } = useTheme();
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans pb-16">
      <TopNavigation />

      <Container size="lg" className="pt-8">
        <Breadcrumb items={[{ label: "Declutr", href: "/" }, { label: "Design System Showcase" }]} />

        <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="emerald">Issue #042</Badge>
              <Badge variant="outline">shadcn/ui + Radix + Tokens</Badge>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">
              Declutr Unified Design System
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Centralized design tokens, accessible component primitives, and responsive dark/light mode standards.
            </p>
          </div>
          <Button variant="secondary" onClick={toggleTheme}>
            Current Theme: {theme.toUpperCase()} (Toggle)
          </Button>
        </div>

        {/* Component Showcase Tabs */}
        <Tabs defaultValue="buttons" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="buttons">Buttons & Actions</TabsTrigger>
            <TabsTrigger value="inputs">Form Controls</TabsTrigger>
            <TabsTrigger value="display">Cards & Tables</TabsTrigger>
            <TabsTrigger value="feedback">Feedback & States</TabsTrigger>
            <TabsTrigger value="overlay">Modals & Overlays</TabsTrigger>
          </TabsList>

          {/* BUTTONS TAB */}
          <TabsContent value="buttons">
            <Section>
              <h2 className="text-lg font-semibold mb-4 text-emerald-400">Button Variants</h2>
              <div className="flex flex-wrap items-center gap-4">
                <Button variant="default">Primary Action</Button>
                <Button variant="secondary">Secondary Action</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost Button</Button>
                <Button variant="danger">Danger Action</Button>
                <Button variant="default" isLoading>
                  Loading
                </Button>
                <Button variant="default" leftIcon={<Sparkles className="h-4 w-4" />}>
                  With Icon
                </Button>
              </div>
            </Section>
            <Section className="mt-6">
              <h2 className="text-lg font-semibold mb-4 text-emerald-400">Button Sizes</h2>
              <div className="flex flex-wrap items-center gap-4">
                <Button size="sm">Small (sm)</Button>
                <Button size="default">Default (md)</Button>
                <Button size="lg">Large (lg)</Button>
              </div>
            </Section>
          </TabsContent>

          {/* INPUTS TAB */}
          <TabsContent value="inputs">
            <Section>
              <h2 className="text-lg font-semibold mb-4 text-emerald-400">Form Inputs</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
                <Input label="Email Address" placeholder="user@declutr.app" helperText="Your email remains private." />
                <PasswordInput label="Master Passphrase" placeholder="Enter password" />
                <SearchInput placeholder="Search within active vault..." />
                <Textarea label="Notes & Description" placeholder="Add contextual notes..." />
              </div>
            </Section>
          </TabsContent>

          {/* DISPLAY TAB */}
          <TabsContent value="display">
            <Section>
              <h2 className="text-lg font-semibold mb-4 text-emerald-400">Cards & Data Tables</h2>
              <Grid cols={3} className="gap-4 mb-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Storage Utilization</CardTitle>
                    <CardDescription>Encrypted Object Storage</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <span className="text-2xl font-bold text-white">4.2 MB</span>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Vector Embeddings</CardTitle>
                    <CardDescription>512-dim pgvector HNSW</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Badge variant="emerald">Ready</Badge>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Security Status</CardTitle>
                    <CardDescription>SRP-6a Protocol</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Badge variant="outline">Verified</Badge>
                  </CardContent>
                </Card>
              </Grid>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>File Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Category</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-semibold text-white">Tax_Form_1040_2025.pdf</TableCell>
                    <TableCell><Badge variant="emerald">READY 100%</Badge></TableCell>
                    <TableCell>4.2 MB</TableCell>
                    <TableCell>Financial</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold text-white">Prescription_Cardiology.pdf</TableCell>
                    <TableCell><Badge variant="emerald">READY 100%</Badge></TableCell>
                    <TableCell>1.8 MB</TableCell>
                    <TableCell>Medical</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Section>
          </TabsContent>

          {/* FEEDBACK TAB */}
          <TabsContent value="feedback">
            <Section className="space-y-6">
              <h2 className="text-lg font-semibold text-emerald-400">Feedback & Empty States</h2>
              <div className="space-y-3 max-w-xl">
                <Alert variant="info">Zero-knowledge SRP verifier active.</Alert>
                <Alert variant="success">File successfully uploaded and indexed.</Alert>
                <Alert variant="danger">Network connection lost. Retrying...</Alert>
              </div>

              <EmptyState
                icon={<FolderKey className="h-8 w-8 text-emerald-400" />}
                title="Vault Workspace Ready"
                description="Upload your first document or audio file to begin zero-knowledge ingestion."
                actionLabel="Upload Memory"
                onAction={() => {}}
              />
            </Section>
          </TabsContent>

          {/* OVERLAY TAB */}
          <TabsContent value="overlay">
            <Section>
              <h2 className="text-lg font-semibold mb-4 text-emerald-400">Dialog Modals</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="default">Open Modal Dialog</Button>
                </DialogTrigger>
                <DialogContent className="max-w-md bg-slate-900 border-slate-800 text-white">
                  <DialogHeader>
                    <DialogTitle>Create New Vault</DialogTitle>
                    <DialogDescription>
                      Initialize an AES-256 encrypted workspace container.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <Input label="Vault Name" placeholder="e.g. Work & Research Vault" />
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button variant="default">Create Vault</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </Section>
          </TabsContent>
        </Tabs>
      </Container>
    </div>
  );
}

export default function DesignSystemPage() {
  return (
    <ThemeProvider>
      <DesignSystemContent />
    </ThemeProvider>
  );
}

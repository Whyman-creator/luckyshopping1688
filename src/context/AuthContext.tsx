"use client";

import React, { createContext, useContext, useEffect, useState, useId } from "react";
import { UserProfile, UserRole } from "@/types";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole;
  isAdmin: boolean;
  isLoggedIn: boolean;
  isLoading: boolean;
  sessionId: string;
  isSessionTerminated: boolean;
  terminatedReason: string;
  loginWithGoogle: () => Promise<void>;
  loginDemo: (role: UserRole) => void;
  logout: () => Promise<void>;
  dismissTerminatedModal: () => void;
  simulateDeviceKick: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USER_MITRA: UserProfile = {
  id: "demo-mitra-user-id",
  email: "mitra.sukses@gmail.com",
  full_name: "Rian Pratama (Mitra VIP)",
  avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
  role: "mitra",
  last_device: "Smartphone Android",
};

const DEMO_USER_ADMIN: UserProfile = {
  id: "demo-admin-user-id",
  email: "admin.owner@bisnis.com",
  full_name: "Owner / Admin Pusat",
  avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
  role: "admin",
  last_device: "MacBook Pro / Komputer Kantor",
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionId, setSessionId] = useState<string>("");
  const [isSessionTerminated, setIsSessionTerminated] = useState(false);
  const [terminatedReason, setTerminatedReason] = useState("");

  // Initialize or restore session ID
  useEffect(() => {
    let currentSession = sessionStorage.getItem("mitra_hub_session_id");
    if (!currentSession) {
      currentSession = "sess-" + Math.random().toString(36).substring(2, 12);
      sessionStorage.setItem("mitra_hub_session_id", currentSession);
    }
    setSessionId(currentSession);
  }, []);

  // Listen to Supabase Auth state or check localStorage for Demo
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);

      // Check for saved demo session
      const savedDemoRole = localStorage.getItem("mitra_hub_demo_role");
      if (savedDemoRole === "admin") {
        setUser(DEMO_USER_ADMIN);
        setIsLoading(false);
        return;
      } else if (savedDemoRole === "mitra") {
        setUser(DEMO_USER_MITRA);
        setIsLoading(false);
        return;
      }

      // Check Supabase if configured
      if (isSupabaseConfigured && supabase) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            // Fetch profile
            const { data: profile } = await supabase
              .from("profiles")
              .select("*")
              .eq("id", session.user.id)
              .single();

            const role: UserRole = profile?.role === "admin" ? "admin" : "mitra";
            const userProfile: UserProfile = {
              id: session.user.id,
              email: session.user.email || "",
              full_name: profile?.full_name || session.user.user_metadata?.full_name || "Mitra",
              avatar_url: profile?.avatar_url || session.user.user_metadata?.avatar_url,
              role,
              active_session_id: profile?.active_session_id,
              last_device: profile?.last_device,
            };

            // Set current session ID in profiles
            const currentSession = sessionStorage.getItem("mitra_hub_session_id") || "sess-init";
            await supabase
              .from("profiles")
              .update({
                active_session_id: currentSession,
                last_device: navigator.userAgent.includes("Mobile") ? "Smartphone" : "Laptop/Komputer",
                updated_at: new Date().toISOString(),
              })
              .eq("id", session.user.id);

            setUser(userProfile);
          }
        } catch (err) {
          console.error("Auth init error:", err);
        }
      }

      setIsLoading(false);
    };

    initAuth();
  }, []);

  // Realtime single-session listener for Supabase
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase || !user) return;

    const client = supabase;
    const channel = client
      .channel(`profile-session-${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "profiles",
          filter: `id=eq.${user.id}`,
        },
        (payload: any) => {
          const newSessionId = payload.new?.active_session_id;
          const currentSession = sessionStorage.getItem("mitra_hub_session_id");

          if (newSessionId && currentSession && newSessionId !== currentSession) {
            // Kicked out by another device!
            setTerminatedReason(payload.new?.last_device || "Komputer / Perangkat Lain");
            setIsSessionTerminated(true);
            setUser(null);
            client.auth.signOut();
          }
        }
      )
      .subscribe();

    return () => {
      client.removeChannel(channel);
    };
  }, [user]);

  // Google OAuth Login
  const loginWithGoogle = async () => {
    if (isSupabaseConfigured && supabase) {
      const redirectUrl = `${window.location.origin}/auth/callback`;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUrl,
        },
      });
      if (error) {
        alert("Gagal menghubungkan ke Google: " + error.message);
      }
    } else {
      // If Supabase is not yet configured, automatically switch to Demo mode
      alert(
        "Supabase belum terhubung ke .env. Masuk dalam Mode Demo Mitra otomatis agar Anda bisa langsung mencoba fitur!"
      );
      loginDemo("mitra");
    }
  };

  // Login Demo Mode
  const loginDemo = (role: UserRole) => {
    localStorage.setItem("mitra_hub_demo_role", role);
    if (role === "admin") {
      setUser(DEMO_USER_ADMIN);
    } else {
      setUser(DEMO_USER_MITRA);
    }
    setIsSessionTerminated(false);
  };

  // Logout
  const logout = async () => {
    localStorage.removeItem("mitra_hub_demo_role");
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
  };

  // Dismiss session termination modal
  const dismissTerminatedModal = () => {
    setIsSessionTerminated(false);
  };

  // Simulator helper: lets user test the Single Session Kickout feature directly on screen
  const simulateDeviceKick = () => {
    setTerminatedReason("Laptop / Komputer Kantor (Chrome Windows)");
    setIsSessionTerminated(true);
    setUser(null);
    localStorage.removeItem("mitra_hub_demo_role");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || "mitra",
        isAdmin: user?.role === "admin",
        isLoggedIn: !!user,
        isLoading,
        sessionId,
        isSessionTerminated,
        terminatedReason,
        loginWithGoogle,
        loginDemo,
        logout,
        dismissTerminatedModal,
        simulateDeviceKick,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

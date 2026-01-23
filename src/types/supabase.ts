export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      companies: {
        Row: {
          address: string | null;
          created_at: string | null;
          email: string | null;
          id: string;
          name: string;
          notes: string | null;
          phone: string | null;
          tags: string[] | null;
          type: string;
          updated_at: string | null;
          website: string | null;
        };
        Insert: {
          address?: string | null;
          created_at?: string | null;
          email?: string | null;
          id?: string;
          name: string;
          notes?: string | null;
          phone?: string | null;
          tags?: string[] | null;
          type: string;
          updated_at?: string | null;
          website?: string | null;
        };
        Update: {
          address?: string | null;
          created_at?: string | null;
          email?: string | null;
          id?: string;
          name?: string;
          notes?: string | null;
          phone?: string | null;
          tags?: string[] | null;
          type?: string;
          updated_at?: string | null;
          website?: string | null;
        };
        Relationships: [];
      };
      contacts: {
        Row: {
          address: string | null;
          company_id: string | null;
          created_at: string | null;
          email: string | null;
          id: string;
          name: string;
          notes: string | null;
          phone: string | null;
          position: string | null;
          type: string;
          updated_at: string | null;
        };
        Insert: {
          address?: string | null;
          company_id?: string | null;
          created_at?: string | null;
          email?: string | null;
          id?: string;
          name: string;
          notes?: string | null;
          phone?: string | null;
          position?: string | null;
          type: string;
          updated_at?: string | null;
        };
        Update: {
          address?: string | null;
          company_id?: string | null;
          created_at?: string | null;
          email?: string | null;
          id?: string;
          name?: string;
          notes?: string | null;
          phone?: string | null;
          position?: string | null;
          type?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "contacts_company_id_fkey";
            columns: ["company_id"];
            isOneToOne: false;
            referencedRelation: "companies";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          company: string | null;
          email: string | null;
          first_name: string | null;
          last_name: string | null;
          created_at: string | null;
          full_name: string | null;
          id: string;
          role: Database["public"]["Enums"]["app_role"];
          updated_at: string | null;
          username: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          company?: string | null;
          email?: string | null;
          first_name?: string | null;
          last_name?: string | null;
          created_at?: string | null;
          full_name?: string | null;
          id: string;
          role?: Database["public"]["Enums"]["app_role"];
          updated_at?: string | null;
          username?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          company?: string | null;
          email?: string | null;
          first_name?: string | null;
          last_name?: string | null;
          created_at?: string | null;
          full_name?: string | null;
          id?: string;
          role?: Database["public"]["Enums"]["app_role"];
          updated_at?: string | null;
          username?: string | null;
        };
        Relationships: [];
      };
      projects: {
        Row: {
          address: string | null;
          client_id: string | null;
          created_at: string | null;
          id: string;
          location: string | null;
          name: string;
          owner_id: string | null;
          stage: string;
          tags: string[] | null;
          updated_at: string | null;
        };
        Insert: {
          address?: string | null;
          client_id?: string | null;
          created_at?: string | null;
          id?: string;
          location?: string | null;
          name: string;
          owner_id?: string | null;
          stage?: string;
          tags?: string[] | null;
          updated_at?: string | null;
        };
        Update: {
          address?: string | null;
          client_id?: string | null;
          created_at?: string | null;
          id?: string;
          location?: string | null;
          name?: string;
          owner_id?: string | null;
          stage?: string;
          tags?: string[] | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "projects_client_id_fkey";
            columns: ["client_id"];
            isOneToOne: false;
            referencedRelation: "contacts";
            referencedColumns: ["id"];
          },
        ];
      };
      project_briefs: {
        Row: {
          project_id: string;
          residents: Json | null;
          construction: Json | null;
          demolition: Json | null;
          engineering: Json | null;
          equipment: Json | null;
          general_info: Json | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          project_id: string;
          residents?: Json | null;
          construction?: Json | null;
          demolition?: Json | null;
          engineering?: Json | null;
          equipment?: Json | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          project_id?: string;
          residents?: Json | null;
          construction?: Json | null;
          demolition?: Json | null;
          engineering?: Json | null;
          equipment?: Json | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "project_briefs_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: true;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
        ];
      };
      rooms: {
        Row: {
          area: number | null;
          created_at: string | null;
          id: string;
          name: string;
          project_id: string;
          specs: Json | null;
          updated_at: string | null;
        };
        Insert: {
          area?: number | null;
          created_at?: string | null;
          id?: string;
          name: string;
          project_id: string;
          specs?: Json | null;
          updated_at?: string | null;
        };
        Update: {
          area?: number | null;
          created_at?: string | null;
          id?: string;
          name?: string;
          project_id?: string;
          specs?: Json | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "rooms_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
        ];
      };
      tasks: {
        Row: {
          assigned_to: string | null;
          created_at: string | null;
          description: string | null;
          due_date: string | null;
          id: string;
          priority: string;
          project_id: string;
          status: string;
          title: string;
          updated_at: string | null;
        };
        Insert: {
          assigned_to?: string | null;
          created_at?: string | null;
          description?: string | null;
          due_date?: string | null;
          id?: string;
          priority?: string;
          project_id: string;
          status?: string;
          title: string;
          updated_at?: string | null;
        };
        Update: {
          assigned_to?: string | null;
          created_at?: string | null;
          description?: string | null;
          due_date?: string | null;
          id?: string;
          priority?: string;
          project_id?: string;
          status?: string;
          title?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "tasks_assigned_to_fkey";
            columns: ["assigned_to"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "tasks_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      app_role:
        | "admin"
        | "architect"
        | "manager"
        | "designer"
        | "client"
        | "contractor";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

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
          is_strict_mode: boolean | null;
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
          is_strict_mode?: boolean | null;
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
          is_strict_mode?: boolean | null;
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
          object_info: Json | null;
          sections_completed: Json | null;
          style: Json | null;
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
          general_info?: Json | null;
          object_info?: Json | null;
          sections_completed?: Json | null;
          style?: Json | null;
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
          general_info?: Json | null;
          object_info?: Json | null;
          sections_completed?: Json | null;
          style?: Json | null;
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
      project_stage_items: {
        Row: {
          completed: boolean;
          completed_at: string | null;
          created_at: string;
          id: string;
          item_id: string;
          project_id: string;
          stage_id: string;
          updated_at: string;
        };
        Insert: {
          completed?: boolean;
          completed_at?: string | null;
          created_at?: string;
          id?: string;
          item_id: string;
          project_id: string;
          stage_id: string;
          updated_at?: string;
        };
        Update: {
          completed?: boolean;
          completed_at?: string | null;
          created_at?: string;
          id?: string;
          item_id?: string;
          project_id?: string;
          stage_id?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "project_stage_items_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
        ];
      };
      planning_variants: {
        Row: {
          approved: boolean;
          approved_at: string | null;
          created_at: string;
          description: string | null;
          file_url: string;
          id: string;
          project_id: string;
          title: string;
          updated_at: string;
        };
        Insert: {
          approved?: boolean;
          approved_at?: string | null;
          created_at?: string;
          description?: string | null;
          file_url: string;
          id?: string;
          project_id: string;
          title: string;
          updated_at?: string;
        };
        Update: {
          approved?: boolean;
          approved_at?: string | null;
          created_at?: string;
          description?: string | null;
          file_url?: string;
          id?: string;
          project_id?: string;
          title?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "planning_variants_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
        ];
      };
      collage_variants: {
        Row: {
          approved: boolean;
          approved_at: string | null;
          created_at: string;
          description: string | null;
          id: string;
          images: Json | null;
          project_id: string;
          room_id: string;
          title: string;
          updated_at: string;
        };
        Insert: {
          approved?: boolean;
          approved_at?: string | null;
          created_at?: string;
          description?: string | null;
          id?: string;
          images?: Json | null;
          project_id: string;
          room_id: string;
          title: string;
          updated_at?: string;
        };
        Update: {
          approved?: boolean;
          approved_at?: string | null;
          created_at?: string;
          description?: string | null;
          id?: string;
          images?: Json | null;
          project_id?: string;
          room_id?: string;
          title?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "collage_variants_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "collage_variants_room_id_fkey";
            columns: ["room_id"];
            isOneToOne: false;
            referencedRelation: "rooms";
            referencedColumns: ["id"];
          },
        ];
      };
      visualization_variants: {
        Row: {
          approved: boolean;
          approved_at: string | null;
          created_at: string;
          description: string | null;
          id: string;
          images: Json | null;
          project_id: string;
          room_id: string;
          title: string;
          updated_at: string;
        };
        Insert: {
          approved?: boolean;
          approved_at?: string | null;
          created_at?: string;
          description?: string | null;
          id?: string;
          images?: Json | null;
          project_id: string;
          room_id: string;
          title: string;
          updated_at?: string;
        };
        Update: {
          approved?: boolean;
          approved_at?: string | null;
          created_at?: string;
          description?: string | null;
          id?: string;
          images?: Json | null;
          project_id?: string;
          room_id?: string;
          title?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "visualization_variants_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "visualization_variants_room_id_fkey";
            columns: ["room_id"];
            isOneToOne: false;
            referencedRelation: "rooms";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      create_project_with_owner: {
        Args: {
          p_name: string;
          p_address: string;
          p_area: number;
          p_client_id: string | null;
          p_stage: string;
          p_residents: string;
          p_demolition_info: string;
          p_construction_info: string;
        };
        Returns: string;
      };
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

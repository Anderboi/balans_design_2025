export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      collage_variants: {
        Row: {
          approved: boolean | null
          approved_at: string | null
          created_at: string | null
          description: string | null
          file_name: string | null
          file_size: number | null
          file_url: string | null
          id: string
          image_url: string | null
          images: Json | null
          project_id: string
          room_id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          approved?: boolean | null
          approved_at?: string | null
          created_at?: string | null
          description?: string | null
          file_name?: string | null
          file_size?: number | null
          file_url?: string | null
          id?: string
          image_url?: string | null
          images?: Json | null
          project_id: string
          room_id: string
          title: string
          updated_at?: string | null
        }
        Update: {
          approved?: boolean | null
          approved_at?: string | null
          created_at?: string | null
          description?: string | null
          file_name?: string | null
          file_size?: number | null
          file_url?: string | null
          id?: string
          image_url?: string | null
          images?: Json | null
          project_id?: string
          room_id?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "collage_variants_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collage_variants_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          address: string | null
          created_at: string | null
          email: string | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          tags: string[] | null
          type: string
          updated_at: string | null
          user_id: string | null
          website: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          tags?: string[] | null
          type: string
          updated_at?: string | null
          user_id?: string | null
          website?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          tags?: string[] | null
          type?: string
          updated_at?: string | null
          user_id?: string | null
          website?: string | null
        }
        Relationships: []
      }
      contacts: {
        Row: {
          address: string | null
          company_id: string | null
          created_at: string | null
          email: string | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          position: string | null
          type: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          address?: string | null
          company_id?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          position?: string | null
          type: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          address?: string | null
          company_id?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          position?: string | null
          type?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contacts_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contacts_company_id_fkey1"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      drawing_annotations: {
        Row: {
          author_name: string | null
          color: string | null
          content: string
          created_at: string | null
          drawing_id: string
          id: string
          page_number: number
          resolved: boolean | null
          updated_at: string | null
          x_percent: number
          y_percent: number
        }
        Insert: {
          author_name?: string | null
          color?: string | null
          content: string
          created_at?: string | null
          drawing_id: string
          id?: string
          page_number?: number
          resolved?: boolean | null
          updated_at?: string | null
          x_percent: number
          y_percent: number
        }
        Update: {
          author_name?: string | null
          color?: string | null
          content?: string
          created_at?: string | null
          drawing_id?: string
          id?: string
          page_number?: number
          resolved?: boolean | null
          updated_at?: string | null
          x_percent?: number
          y_percent?: number
        }
        Relationships: [
          {
            foreignKeyName: "drawing_annotations_drawing_id_fkey"
            columns: ["drawing_id"]
            isOneToOne: false
            referencedRelation: "drawing_sets"
            referencedColumns: ["id"]
          },
        ]
      }
      drawing_sets: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          file_name: string
          file_size: number
          file_url: string
          id: string
          image_url: string | null
          images: Json | null
          project_id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          category?: string
          created_at?: string | null
          description?: string | null
          file_name: string
          file_size: number
          file_url: string
          id?: string
          image_url?: string | null
          images?: Json | null
          project_id: string
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          file_name?: string
          file_size?: number
          file_url?: string
          id?: string
          image_url?: string | null
          images?: Json | null
          project_id?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "drawing_sets_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      materials: {
        Row: {
          article: string | null
          category: string | null
          color: string | null
          created_at: string | null
          custom_specifications: Json | null
          description: string | null
          finish: string | null
          id: string
          image_url: string | null
          in_stock: boolean | null
          lead_time: number | null
          manufacturer: string | null
          material: string | null
          name: string
          price: number | null
          product_url: string | null
          size: string | null
          supplier: string | null
          tags: string[] | null
          type: string
          unit: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          article?: string | null
          category?: string | null
          color?: string | null
          created_at?: string | null
          custom_specifications?: Json | null
          description?: string | null
          finish?: string | null
          id?: string
          image_url?: string | null
          in_stock?: boolean | null
          lead_time?: number | null
          manufacturer?: string | null
          material?: string | null
          name: string
          price?: number | null
          product_url?: string | null
          size?: string | null
          supplier?: string | null
          tags?: string[] | null
          type: string
          unit?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          article?: string | null
          category?: string | null
          color?: string | null
          created_at?: string | null
          custom_specifications?: Json | null
          description?: string | null
          finish?: string | null
          id?: string
          image_url?: string | null
          in_stock?: boolean | null
          lead_time?: number | null
          manufacturer?: string | null
          material?: string | null
          name?: string
          price?: number | null
          product_url?: string | null
          size?: string | null
          supplier?: string | null
          tags?: string[] | null
          type?: string
          unit?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          id: string
          link: string | null
          metadata: Json | null
          read: boolean
          title: string
          type: string
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          link?: string | null
          metadata?: Json | null
          read?: boolean
          title: string
          type: string
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          link?: string | null
          metadata?: Json | null
          read?: boolean
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      planning_variants: {
        Row: {
          approved: boolean | null
          approved_at: string | null
          created_at: string | null
          description: string | null
          file_name: string
          file_size: number
          file_url: string
          id: string
          image_url: string
          images: Json | null
          project_id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          approved?: boolean | null
          approved_at?: string | null
          created_at?: string | null
          description?: string | null
          file_name: string
          file_size: number
          file_url: string
          id?: string
          image_url: string
          images?: Json | null
          project_id: string
          title: string
          updated_at?: string | null
        }
        Update: {
          approved?: boolean | null
          approved_at?: string | null
          created_at?: string | null
          description?: string | null
          file_name?: string
          file_size?: number
          file_url?: string
          id?: string
          image_url?: string
          images?: Json | null
          project_id?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "planning_variants_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          company: string | null
          email: string | null
          full_name: string | null
          id: string
          notifications_comments: boolean | null
          notifications_file_uploads: boolean | null
          notifications_marketing: boolean | null
          notifications_new_tasks: boolean | null
          notifications_project_statuses: boolean | null
          role: Database["public"]["Enums"]["app_role"] | null
          updated_at: string | null
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          company?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          notifications_comments?: boolean | null
          notifications_file_uploads?: boolean | null
          notifications_marketing?: boolean | null
          notifications_new_tasks?: boolean | null
          notifications_project_statuses?: boolean | null
          role?: Database["public"]["Enums"]["app_role"] | null
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          company?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          notifications_comments?: boolean | null
          notifications_file_uploads?: boolean | null
          notifications_marketing?: boolean | null
          notifications_new_tasks?: boolean | null
          notifications_project_statuses?: boolean | null
          role?: Database["public"]["Enums"]["app_role"] | null
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Relationships: []
      }
      project_briefs: {
        Row: {
          construction: Json | null
          created_at: string | null
          demolition: Json | null
          engineering: Json | null
          equipment: Json | null
          general_info: Json | null
          object_info: Json | null
          project_id: string
          residents: Json | null
          sections_completed: string[] | null
          style: Json | null
          updated_at: string | null
        }
        Insert: {
          construction?: Json | null
          created_at?: string | null
          demolition?: Json | null
          engineering?: Json | null
          equipment?: Json | null
          general_info?: Json | null
          object_info?: Json | null
          project_id: string
          residents?: Json | null
          sections_completed?: string[] | null
          style?: Json | null
          updated_at?: string | null
        }
        Update: {
          construction?: Json | null
          created_at?: string | null
          demolition?: Json | null
          engineering?: Json | null
          equipment?: Json | null
          general_info?: Json | null
          object_info?: Json | null
          project_id?: string
          residents?: Json | null
          sections_completed?: string[] | null
          style?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_briefs_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: true
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_members: {
        Row: {
          created_at: string | null
          id: string
          project_id: string | null
          role: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          project_id?: string | null
          role: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          project_id?: string | null
          role?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_members_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      project_stage_items: {
        Row: {
          completed: boolean | null
          completed_at: string | null
          created_at: string | null
          id: string
          item_id: string
          project_id: string
          stage_id: string
          updated_at: string | null
        }
        Insert: {
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          item_id: string
          project_id: string
          stage_id: string
          updated_at?: string | null
        }
        Update: {
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          item_id?: string
          project_id?: string
          stage_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_stage_items_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          address: string | null
          area: number | null
          client_id: string | null
          construction_info: string | null
          created_at: string | null
          demolition_info: string | null
          id: string
          is_strict_mode: boolean | null
          name: string
          residents: string | null
          stage: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          area?: number | null
          client_id?: string | null
          construction_info?: string | null
          created_at?: string | null
          demolition_info?: string | null
          id?: string
          is_strict_mode?: boolean | null
          name: string
          residents?: string | null
          stage?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          area?: number | null
          client_id?: string | null
          construction_info?: string | null
          created_at?: string | null
          demolition_info?: string | null
          id?: string
          is_strict_mode?: boolean | null
          name?: string
          residents?: string | null
          stage?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_client"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      rooms: {
        Row: {
          area: number | null
          created_at: string | null
          id: string
          name: string
          order: number | null
          preferred_finishes: string | null
          project_id: string | null
          type: string | null
          updated_at: string | null
        }
        Insert: {
          area?: number | null
          created_at?: string | null
          id?: string
          name: string
          order?: number | null
          preferred_finishes?: string | null
          project_id?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          area?: number | null
          created_at?: string | null
          id?: string
          name?: string
          order?: number | null
          preferred_finishes?: string | null
          project_id?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rooms_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      specifications: {
        Row: {
          article: string | null
          color: string | null
          created_at: string | null
          description: string | null
          expected_delivery_date: string | null
          finish: string | null
          id: string
          image_url: string | null
          in_stock: boolean | null
          lead_time: number | null
          manufacturer: string | null
          material: string | null
          material_id: string | null
          name: string | null
          notes: string | null
          order_date: string | null
          price: number | null
          product_url: string | null
          project_article: string | null
          project_id: string | null
          quantity: number
          room_id: string | null
          size: string | null
          status: string | null
          supplier: string | null
          tags: string[] | null
          type: string | null
          unit: string | null
          updated_at: string | null
        }
        Insert: {
          article?: string | null
          color?: string | null
          created_at?: string | null
          description?: string | null
          expected_delivery_date?: string | null
          finish?: string | null
          id?: string
          image_url?: string | null
          in_stock?: boolean | null
          lead_time?: number | null
          manufacturer?: string | null
          material?: string | null
          material_id?: string | null
          name?: string | null
          notes?: string | null
          order_date?: string | null
          price?: number | null
          product_url?: string | null
          project_article?: string | null
          project_id?: string | null
          quantity?: number
          room_id?: string | null
          size?: string | null
          status?: string | null
          supplier?: string | null
          tags?: string[] | null
          type?: string | null
          unit?: string | null
          updated_at?: string | null
        }
        Update: {
          article?: string | null
          color?: string | null
          created_at?: string | null
          description?: string | null
          expected_delivery_date?: string | null
          finish?: string | null
          id?: string
          image_url?: string | null
          in_stock?: boolean | null
          lead_time?: number | null
          manufacturer?: string | null
          material?: string | null
          material_id?: string | null
          name?: string | null
          notes?: string | null
          order_date?: string | null
          price?: number | null
          product_url?: string | null
          project_article?: string | null
          project_id?: string | null
          quantity?: number
          room_id?: string | null
          size?: string | null
          status?: string | null
          supplier?: string | null
          tags?: string[] | null
          type?: string | null
          unit?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "specifications_material_id_fkey"
            columns: ["material_id"]
            isOneToOne: false
            referencedRelation: "materials"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "specifications_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "specifications_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      task_attachments: {
        Row: {
          created_at: string | null
          file_name: string
          file_size: number | null
          file_type: string | null
          file_url: string
          id: string
          task_id: string | null
        }
        Insert: {
          created_at?: string | null
          file_name: string
          file_size?: number | null
          file_type?: string | null
          file_url: string
          id?: string
          task_id?: string | null
        }
        Update: {
          created_at?: string | null
          file_name?: string
          file_size?: number | null
          file_type?: string | null
          file_url?: string
          id?: string
          task_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "task_attachments_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      task_checklist_items: {
        Row: {
          checklist_id: string
          created_at: string | null
          id: string
          is_completed: boolean
          position: number
          title: string
        }
        Insert: {
          checklist_id: string
          created_at?: string | null
          id?: string
          is_completed?: boolean
          position?: number
          title: string
        }
        Update: {
          checklist_id?: string
          created_at?: string | null
          id?: string
          is_completed?: boolean
          position?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_checklist_items_checklist_id_fkey"
            columns: ["checklist_id"]
            isOneToOne: false
            referencedRelation: "task_checklists"
            referencedColumns: ["id"]
          },
        ]
      }
      task_checklists: {
        Row: {
          created_at: string | null
          id: string
          position: number
          task_id: string
          title: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          position?: number
          task_id: string
          title?: string
        }
        Update: {
          created_at?: string | null
          id?: string
          position?: number
          task_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_checklists_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      task_comments: {
        Row: {
          content: string
          created_at: string | null
          id: string
          task_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          task_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          task_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "task_comments_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      task_history: {
        Row: {
          action: string
          created_at: string | null
          details: Json | null
          id: string
          task_id: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          details?: Json | null
          id?: string
          task_id?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          task_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "task_history_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      task_participants: {
        Row: {
          role: string | null
          task_id: string
          user_id: string
        }
        Insert: {
          role?: string | null
          task_id: string
          user_id: string
        }
        Update: {
          role?: string | null
          task_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_participants_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_participants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          assigned_to: string | null
          created_at: string | null
          description: string | null
          due_date: string | null
          id: string
          priority: string | null
          project_id: string | null
          start_date: string | null
          status: string
          tags: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string | null
          project_id?: string | null
          start_date?: string | null
          status: string
          tags?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string | null
          project_id?: string | null
          start_date?: string | null
          status?: string
          tags?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      visualization_variants: {
        Row: {
          approved: boolean | null
          approved_at: string | null
          created_at: string | null
          description: string | null
          file_name: string | null
          file_size: number | null
          file_url: string | null
          id: string
          image_url: string | null
          images: Json | null
          project_id: string
          room_id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          approved?: boolean | null
          approved_at?: string | null
          created_at?: string | null
          description?: string | null
          file_name?: string | null
          file_size?: number | null
          file_url?: string | null
          id?: string
          image_url?: string | null
          images?: Json | null
          project_id: string
          room_id: string
          title: string
          updated_at?: string | null
        }
        Update: {
          approved?: boolean | null
          approved_at?: string | null
          created_at?: string | null
          description?: string | null
          file_name?: string | null
          file_size?: number | null
          file_url?: string | null
          id?: string
          image_url?: string | null
          images?: Json | null
          project_id?: string
          room_id?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "visualization_variants_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "visualization_variants_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_notification: {
        Args: {
          p_body?: string
          p_link?: string
          p_metadata?: Json
          p_title: string
          p_type: string
          p_user_id: string
        }
        Returns: string
      }
      create_project_with_owner: {
        Args: {
          p_address: string
          p_area: number
          p_client_id: string
          p_construction_info: string
          p_demolition_info: string
          p_name: string
          p_residents: string
          p_stage: string
        }
        Returns: Json
      }
      get_current_user_role: { Args: { _project_id: string }; Returns: string }
      get_user_project_role: {
        Args: { p_project_id: string; p_user_id: string }
        Returns: string
      }
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      app_role:
        | "admin"
        | "architect"
        | "manager"
        | "designer"
        | "client"
        | "contractor"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: [
        "admin",
        "architect",
        "manager",
        "designer",
        "client",
        "contractor",
      ],
    },
  },
} as const

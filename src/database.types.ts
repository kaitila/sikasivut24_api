export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      banned_ips: {
        Row: {
          ip: string
        }
        Insert: {
          ip: string
        }
        Update: {
          ip?: string
        }
        Relationships: []
      }
      disallowed_games: {
        Row: {
          created_at: string
          id: string
          ip: string | null
          score: number | null
          telegram: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          ip?: string | null
          score?: number | null
          telegram?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          ip?: string | null
          score?: number | null
          telegram?: string | null
        }
        Relationships: []
      }
      drink_tickets: {
        Row: {
          created_at: string
          game_id: string | null
          id: string
          scanned_at: string | null
          scanner_id: string | null
          used: boolean
        }
        Insert: {
          created_at?: string
          game_id?: string | null
          id?: string
          scanned_at?: string | null
          scanner_id?: string | null
          used?: boolean
        }
        Update: {
          created_at?: string
          game_id?: string | null
          id?: string
          scanned_at?: string | null
          scanner_id?: string | null
          used?: boolean
        }
        Relationships: []
      }
      games: {
        Row: {
          email: string | null
          ended_at: number | null
          id: string
          ip: string | null
          nickname: string | null
          score: number | null
          started_at: number | null
          telegram: string | null
        }
        Insert: {
          email?: string | null
          ended_at?: number | null
          id?: string
          ip?: string | null
          nickname?: string | null
          score?: number | null
          started_at?: number | null
          telegram?: string | null
        }
        Update: {
          email?: string | null
          ended_at?: number | null
          id?: string
          ip?: string | null
          nickname?: string | null
          score?: number | null
          started_at?: number | null
          telegram?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          role: Database["public"]["Enums"]["app_role"]
        }
        Insert: {
          created_at?: string
          email?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          role?: Database["public"]["Enums"]["app_role"]
        }
        Update: {
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          role?: Database["public"]["Enums"]["app_role"]
        }
        Relationships: []
      }
      role_permissions: {
        Row: {
          id: number
          permission: Database["public"]["Enums"]["app_permission"]
          role: Database["public"]["Enums"]["app_role"]
        }
        Insert: {
          id?: number
          permission: Database["public"]["Enums"]["app_permission"]
          role: Database["public"]["Enums"]["app_role"]
        }
        Update: {
          id?: number
          permission?: Database["public"]["Enums"]["app_permission"]
          role?: Database["public"]["Enums"]["app_role"]
        }
        Relationships: []
      }
    }
    Views: {
      distinct_player: {
        Row: {
          nickname: string | null
          score: number | null
          telegram: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      authorize: {
        Args: {
          requested_permission: Database["public"]["Enums"]["app_permission"]
        }
        Returns: boolean
      }
      custom_access_token_hook: {
        Args: {
          event: Json
        }
        Returns: Json
      }
    }
    Enums: {
      app_permission:
        | "drink_tickets.select"
        | "user_roles.select"
        | "user_roles.update"
        | "drink_tickets.update"
        | "user_roles.insert"
        | "profiles.select"
        | "profiles.update"
        | "drink_tickets.insert"
      app_role: "admin" | "worker" | "none"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

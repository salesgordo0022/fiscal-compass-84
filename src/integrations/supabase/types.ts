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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      planilha_geral_empresas: {
        Row: {
          anotacao: string | null
          cnpj: string | null
          cod: string | null
          conciliacao_impostos: boolean | null
          conferir_extratos: boolean | null
          cont_digital: string | null
          created_at: string
          darf: boolean | null
          data_fechamento: string | null
          despesas: boolean | null
          empresa: string
          id: string
          lalur: string | null
          mensalidades: string | null
          mister_cont_dig: boolean | null
          regime: string | null
          regime_ano_anterior: string | null
          situacao: string | null
          solicitacao: boolean | null
          tab: string
          trimestre: string | null
          trimestre_num: string | null
          updated_at: string
        }
        Insert: {
          anotacao?: string | null
          cnpj?: string | null
          cod?: string | null
          conciliacao_impostos?: boolean | null
          conferir_extratos?: boolean | null
          cont_digital?: string | null
          created_at?: string
          darf?: boolean | null
          data_fechamento?: string | null
          despesas?: boolean | null
          empresa: string
          id: string
          lalur?: string | null
          mensalidades?: string | null
          mister_cont_dig?: boolean | null
          regime?: string | null
          regime_ano_anterior?: string | null
          situacao?: string | null
          solicitacao?: boolean | null
          tab?: string
          trimestre?: string | null
          trimestre_num?: string | null
          updated_at?: string
        }
        Update: {
          anotacao?: string | null
          cnpj?: string | null
          cod?: string | null
          conciliacao_impostos?: boolean | null
          conferir_extratos?: boolean | null
          cont_digital?: string | null
          created_at?: string
          darf?: boolean | null
          data_fechamento?: string | null
          despesas?: boolean | null
          empresa?: string
          id?: string
          lalur?: string | null
          mensalidades?: string | null
          mister_cont_dig?: boolean | null
          regime?: string | null
          regime_ano_anterior?: string | null
          situacao?: string | null
          solicitacao?: boolean | null
          tab?: string
          trimestre?: string | null
          trimestre_num?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      planilha_geral_saved_data: {
        Row: {
          anotacoes: Json | null
          checklist_items: Json | null
          cnpj: string | null
          codigo: string | null
          cont_digital: string | null
          created_at: string
          empresa_id: string
          lalur: Json | null
          mensalidades: string | null
          modificado_por: string | null
          regime: string | null
          regime_ano_anterior: string | null
          situacao: string | null
          trimestre: string | null
          updated_at: string
        }
        Insert: {
          anotacoes?: Json | null
          checklist_items?: Json | null
          cnpj?: string | null
          codigo?: string | null
          cont_digital?: string | null
          created_at?: string
          empresa_id: string
          lalur?: Json | null
          mensalidades?: string | null
          modificado_por?: string | null
          regime?: string | null
          regime_ano_anterior?: string | null
          situacao?: string | null
          trimestre?: string | null
          updated_at?: string
        }
        Update: {
          anotacoes?: Json | null
          checklist_items?: Json | null
          cnpj?: string | null
          codigo?: string | null
          cont_digital?: string | null
          created_at?: string
          empresa_id?: string
          lalur?: Json | null
          mensalidades?: string | null
          modificado_por?: string | null
          regime?: string | null
          regime_ano_anterior?: string | null
          situacao?: string | null
          trimestre?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      app_role: ["admin", "user"],
    },
  },
} as const

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      alojamientos: {
        Row: {
          created_at: string | null
          fecha: string
          id: number
          id_cliente: number
          modified_at: string | null
        }
        Insert: {
          created_at?: string | null
          fecha?: string
          id?: number
          id_cliente: number
          modified_at?: string | null
        }
        Update: {
          created_at?: string | null
          fecha?: string
          id?: number
          id_cliente?: number
          modified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "alojamientos_id_cliente_fkey"
            columns: ["id_cliente"]
            isOneToOne: false
            referencedRelation: "cliente"
            referencedColumns: ["id"]
          },
        ]
      }
      cliente: {
        Row: {
          correo: string | null
          created_at: string | null
          doc_ident: string
          id: number
          modified_at: string | null
          nacionalidad: string | null
          nombre: string
          telefono: string | null
        }
        Insert: {
          correo?: string | null
          created_at?: string | null
          doc_ident: string
          id?: number
          modified_at?: string | null
          nacionalidad?: string | null
          nombre: string
          telefono?: string | null
        }
        Update: {
          correo?: string | null
          created_at?: string | null
          doc_ident?: string
          id?: number
          modified_at?: string | null
          nacionalidad?: string | null
          nombre?: string
          telefono?: string | null
        }
        Relationships: []
      }
      embarcacion: {
        Row: {
          amarres_asign: number
          caracteristicas: string
          created_at: string | null
          cuadr_asign: number
          edo_antes: string
          edo_despues: string | null
          id: number
          id_cliente: number
          marcmod: string
          matricula: string
          modified_at: string | null
          nombre: string
          tipo: Database["public"]["Enums"]["tipo_emb"]
        }
        Insert: {
          amarres_asign: number
          caracteristicas: string
          created_at?: string | null
          cuadr_asign: number
          edo_antes: string
          edo_despues?: string | null
          id?: number
          id_cliente: number
          marcmod: string
          matricula: string
          modified_at?: string | null
          nombre: string
          tipo: Database["public"]["Enums"]["tipo_emb"]
        }
        Update: {
          amarres_asign?: number
          caracteristicas?: string
          created_at?: string | null
          cuadr_asign?: number
          edo_antes?: string
          edo_despues?: string | null
          id?: number
          id_cliente?: number
          marcmod?: string
          matricula?: string
          modified_at?: string | null
          nombre?: string
          tipo?: Database["public"]["Enums"]["tipo_emb"]
        }
        Relationships: [
          {
            foreignKeyName: "embarcacion_id_cliente_fkey"
            columns: ["id_cliente"]
            isOneToOne: false
            referencedRelation: "cliente"
            referencedColumns: ["id"]
          },
        ]
      }
      mantenimientos: {
        Row: {
          concepto: string
          created_at: string | null
          fecha: string
          id: number
          matricula_emb: string
          modified_at: string | null
          precio: number
        }
        Insert: {
          concepto: string
          created_at?: string | null
          fecha?: string
          id?: number
          matricula_emb: string
          modified_at?: string | null
          precio: number
        }
        Update: {
          concepto?: string
          created_at?: string | null
          fecha?: string
          id?: number
          matricula_emb?: string
          modified_at?: string | null
          precio?: number
        }
        Relationships: [
          {
            foreignKeyName: "mantenimientos_matricula_emb_fkey"
            columns: ["matricula_emb"]
            isOneToOne: false
            referencedRelation: "embarcacion"
            referencedColumns: ["matricula"]
          },
        ]
      }
      notificaciones: {
        Row: {
          id: string
          leido: boolean | null
          mensaje: string
          reservacion_id: string | null
          timestamp: string | null
          tipo: string | null
        }
        Insert: {
          id?: string
          leido?: boolean | null
          mensaje: string
          reservacion_id?: string | null
          timestamp?: string | null
          tipo?: string | null
        }
        Update: {
          id?: string
          leido?: boolean | null
          mensaje?: string
          reservacion_id?: string | null
          timestamp?: string | null
          tipo?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notificaciones_reservacion_id_fkey"
            columns: ["reservacion_id"]
            isOneToOne: false
            referencedRelation: "Reservaciones"
            referencedColumns: ["id"]
          },
        ]
      }
      personal: {
        Row: {
          cedula: string
          created_at: string | null
          email: string
          id: number
          modified_at: string | null
          nombre: string
          oficio_id: number
          salario: number
          telefono: string
        }
        Insert: {
          cedula: string
          created_at?: string | null
          email: string
          id?: number
          modified_at?: string | null
          nombre: string
          oficio_id: number
          salario: number
          telefono: string
        }
        Update: {
          cedula?: string
          created_at?: string | null
          email?: string
          id?: number
          modified_at?: string | null
          nombre?: string
          oficio_id?: number
          salario?: number
          telefono?: string
        }
        Relationships: [
          {
            foreignKeyName: "personal_oficio_id_fkey"
            columns: ["oficio_id"]
            isOneToOne: false
            referencedRelation: "servicios"
            referencedColumns: ["id"]
          },
        ]
      }
      Reservaciones: {
        Row: {
          cliente_id: string | null
          estado: string | null
          fecha_llegada: string | null
          fecha_registro: string | null
          id: string
          tipo_embarcacion: string | null
          tipo_pago: string | null
          tipo_servicio: string | null
        }
        Insert: {
          cliente_id?: string | null
          estado?: string | null
          fecha_llegada?: string | null
          fecha_registro?: string | null
          id?: string
          tipo_embarcacion?: string | null
          tipo_pago?: string | null
          tipo_servicio?: string | null
        }
        Update: {
          cliente_id?: string | null
          estado?: string | null
          fecha_llegada?: string | null
          fecha_registro?: string | null
          id?: string
          tipo_embarcacion?: string | null
          tipo_pago?: string | null
          tipo_servicio?: string | null
        }
        Relationships: []
      }
      servicios: {
        Row: {
          id: number
          perdidas: number
          precio: string
          tipo: string
        }
        Insert: {
          id?: number
          perdidas: number
          precio: string
          tipo: string
        }
        Update: {
          id?: number
          perdidas?: number
          precio?: string
          tipo?: string
        }
        Relationships: []
      }
      transacciones: {
        Row: {
          conc: string
          created_at: string | null
          fecha: string
          id: number
          id_cliente: number
          id_servicio: number | null
          modified_at: string | null
          modo_pago: string
          monto_total: string
          ref: string
          varadero: string | null
        }
        Insert: {
          conc: string
          created_at?: string | null
          fecha?: string
          id?: number
          id_cliente: number
          id_servicio?: number | null
          modified_at?: string | null
          modo_pago: string
          monto_total: string
          ref: string
          varadero?: string | null
        }
        Update: {
          conc?: string
          created_at?: string | null
          fecha?: string
          id?: number
          id_cliente?: number
          id_servicio?: number | null
          modified_at?: string | null
          modo_pago?: string
          monto_total?: string
          ref?: string
          varadero?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transacciones_id_cliente_fkey"
            columns: ["id_cliente"]
            isOneToOne: false
            referencedRelation: "cliente"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transacciones_id_servicio_fkey"
            columns: ["id_servicio"]
            isOneToOne: false
            referencedRelation: "servicios"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      tipo_emb: "LANCHA" | "YATE" | "MOTO_ACUATICA"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      tipo_emb: ["LANCHA", "YATE", "MOTO_ACUATICA"],
    },
  },
} as const

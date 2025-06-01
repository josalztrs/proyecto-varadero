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
          fecha: string
          id: number
          id_cliente: number
        }
        Insert: {
          fecha?: string
          id?: number
          id_cliente: number
        }
        Update: {
          fecha?: string
          id?: number
          id_cliente?: number
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
          doc_ident: string
          id: number
          nacionalidad: string | null
          nombre: string
          telefono: string | null
        }
        Insert: {
          correo?: string | null
          doc_ident: string
          id?: number
          nacionalidad?: string | null
          nombre: string
          telefono?: string | null
        }
        Update: {
          correo?: string | null
          doc_ident?: string
          id?: number
          nacionalidad?: string | null
          nombre?: string
          telefono?: string | null
        }
        Relationships: []
      }
      datos_pago: {
        Row: {
          conc: string
          id: number
          modo_pago: string
          ref: string
        }
        Insert: {
          conc: string
          id?: number
          modo_pago: string
          ref: string
        }
        Update: {
          conc?: string
          id?: number
          modo_pago?: string
          ref?: string
        }
        Relationships: []
      }
      embarcacion: {
        Row: {
          amarres_asign: number
          caracteristicas: string
          cuadr_asign: number
          edo_antes: string
          edo_despues: string | null
          id_cliente: number
          marcmod: string
          matricula: string
          nombre: string
          tipo: Database["public"]["Enums"]["tipo_emb"]
        }
        Insert: {
          amarres_asign: number
          caracteristicas: string
          cuadr_asign: number
          edo_antes: string
          edo_despues?: string | null
          id_cliente: number
          marcmod: string
          matricula: string
          nombre: string
          tipo: Database["public"]["Enums"]["tipo_emb"]
        }
        Update: {
          amarres_asign?: number
          caracteristicas?: string
          cuadr_asign?: number
          edo_antes?: string
          edo_despues?: string | null
          id_cliente?: number
          marcmod?: string
          matricula?: string
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
          fecha: string
          id: number
          matricula_emb: string
          precio: number
        }
        Insert: {
          concepto: string
          fecha?: string
          id?: number
          matricula_emb: string
          precio: number
        }
        Update: {
          concepto?: string
          fecha?: string
          id?: number
          matricula_emb?: string
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
      personal: {
        Row: {
          cedula: string
          email: string
          id: number
          nombre: string
          oficio_id: number
          salario: number
          telefono: string
        }
        Insert: {
          cedula: string
          email: string
          id?: number
          nombre: string
          oficio_id: number
          salario: number
          telefono: string
        }
        Update: {
          cedula?: string
          email?: string
          id?: number
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
          fecha: string
          id: number
          id_cliente: number
          id_pago: number
          id_servicio: number | null
          monto_total: string
          varadero: string | null
        }
        Insert: {
          fecha?: string
          id?: number
          id_cliente: number
          id_pago: number
          id_servicio?: number | null
          monto_total: string
          varadero?: string | null
        }
        Update: {
          fecha?: string
          id?: number
          id_cliente?: number
          id_pago?: number
          id_servicio?: number | null
          monto_total?: string
          varadero?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transacciones_id_cliente_fkey"
            columns: ["id_cliente"]
            isOneToOne: true
            referencedRelation: "cliente"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transacciones_id_pago_fkey"
            columns: ["id_pago"]
            isOneToOne: true
            referencedRelation: "datos_pago"
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
      tipo_emb: "Lancha" | "Yate" | "Moto Acuatica"
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
      tipo_emb: ["Lancha", "Yate", "Moto Acuatica"],
    },
  },
} as const
